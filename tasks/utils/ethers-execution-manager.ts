import fs from 'fs';
import promiseRetry from 'promise-retry';
import {BigNumber, PayableOverrides} from 'ethers';
import pino from 'pino';

const Logger = pino();

export class EthersExecutionManager {
  lockPath: string;
  functionIndex: number = 0;
  RETRY_NUMBER: number;
  WAIT_NUMBER: number;
  functionGas: Array<{
    functionName: string;
    gasUsed: number;
    gasPrice: string;
    fee: string;
  }> = [];
  totalGas: BigNumber = BigNumber.from(0);
  gasPrice: BigNumber = BigNumber.from(0);
  lock: any = {};

  lockFile = {
    write: async (): Promise<void> => {
      await fs.promises.writeFile(this.lockPath, JSON.stringify(this.lock));
    },
    read: async (): Promise<void> => {
      if (fs.existsSync(this.lockPath)) {
        const obj = JSON.parse(
          (await fs.promises.readFile(this.lockPath)).toString()
        );
        HexToBigNumber(obj);
        this.lock = obj;
      }
    },
    unlink: async (): Promise<void> => {
      if (fs.existsSync(this.lockPath)) {
        await fs.promises.unlink(this.lockPath);
      }
    },
  };

  constructor(lockPath: string, RETRY_NUMBER = 3, WAIT_NUMBER = 1) {
    this.lockPath = lockPath;
    this.RETRY_NUMBER = RETRY_NUMBER;
    this.WAIT_NUMBER = WAIT_NUMBER;
  }

  async load(): Promise<void> {
    await this.lockFile.read();
    if (this.lock.functionGas) {
      this.functionGas = this.lock.functionGas;
      let totalGas = 0;
      for (const i in this.functionGas) {
        totalGas += this.functionGas[i].gasUsed;
        this.gasPrice = BigNumber.from(
          this.functionGas[i].gasPrice.replace(' gwei', '')
        ).mul(10 ** 9);
      }
      this.totalGas = BigNumber.from(totalGas);
    }
  }

  addFunctionIndex(): void {
    this.functionIndex++;
  }

  async deleteLock(): Promise<void> {
    await this.lockFile.unlink();
  }

  printGas(): void {
    this.functionGas.push({
      functionName: `totalGas`,
      gasUsed: this.totalGas.toNumber(),
      gasPrice: `${this.gasPrice.div(10 ** 9)} gwei`,
      fee: `${
        parseFloat(this.totalGas.mul(this.gasPrice).toString()) / 10 ** 18
      } ether`,
    });
    console.table(this.functionGas);
  }

  async call(func: any, args: Array<any>, functionName: string): Promise<any> {
    const functionIndex = this.functionIndex++;
    if (!this.lock[functionIndex]) {
      const result = await promiseRetry(async (retry: any, number: number) => {
        Logger.info(
          `execute operation call:${functionIndex}, ${functionName}, try ${number}`
        );
        try {
          return await func(...args);
        } catch (err) {
          if (number >= this.RETRY_NUMBER) throw err;
          retry(err);
        }
      });
      Logger.info(`success call:${functionIndex},${functionName}`);
      this.lock[functionIndex] = result;
      await this.lockFile.write();
      return result;
    } else {
      Logger.info(`skip call:${functionIndex},${functionName}`);
      return this.lock[functionIndex];
    }
  }

  async transaction(
    func: any,
    args: Array<any>,
    saves: Array<string>,
    functionName: string,
    config: PayableOverrides
  ): Promise<any> {
    const functionIndex = this.functionIndex++;
    if (!this.lock[functionIndex]) {
      const ret = await promiseRetry(async (retry: any, number: number) => {
        Logger.info(
          `execute operation transaction:${functionIndex}, ${functionName}, try ${number}`
        );
        return func(...args, config).catch((err: Error) => {
          if (number >= this.RETRY_NUMBER) throw err;
          retry(err);
        });
      });
      const tx = ret.deployTransaction ? ret.deployTransaction : ret;
      this.gasPrice = tx.gasPrice;
      const receipt = await tx.wait(this.WAIT_NUMBER);
      const gasUsed = receipt.gasUsed;
      this.totalGas = this.totalGas.add(gasUsed);
      const json = {
        functionName: functionName,
        gasUsed: gasUsed.toNumber(),
        gasPrice: `${this.gasPrice.div(10 ** 9)} gwei`,
        fee: `${
          parseFloat(gasUsed.mul(this.gasPrice).toString()) / 10 ** 18
        } ether`,
      };
      this.functionGas.push(json);
      if (!this.lock.functionGas) {
        this.lock.functionGas = [];
      }
      this.lock.functionGas.push(json);
      Logger.info(`success transaction:${functionIndex},${functionName}`);
      const result: any = {};
      saves.forEach((e) => {
        result[e] = receipt[e];
      });
      this.lock[functionIndex] = result;
      await this.lockFile.write();
      return result;
    } else {
      Logger.info(`skip transaction:${functionIndex},${functionName}`);
      return this.lock[functionIndex];
    }
  }
}

function HexToBigNumber(obj: any) {
  for (const key in obj) {
    if (obj[key].hex) {
      obj[key] = BigNumber.from(obj[key].hex);
    } else if (typeof obj[key] == 'object') {
      HexToBigNumber(obj[key]);
    }
  }
}
