import { Provider } from '@ethersproject/providers';
import { BigNumber, CallOverrides, PayableOverrides, Signer } from 'ethers';
import { ERC20Client } from '..';
import { ERC20, ERC20__factory } from '../typechain';

export class EtherERC20Client implements ERC20Client {
  private _erc20: ERC20 | undefined;
  protected _provider: Provider | Signer | undefined;
  protected _waitConfirmations = 3;
  protected _errorTitle = 'EtherERC20Client';

  public async connect(
    provider: Provider | Signer,
    address: string,
    waitConfirmations?: number
  ) {
    this._erc20 = ERC20__factory.connect(address, provider);
    if (waitConfirmations) {
      this._waitConfirmations = waitConfirmations;
    }
    this._provider = provider;
  }

  public address(): string {
    if (!this._provider || !this._erc20) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._erc20.address;
  }

  /* ================ VIEW FUNCTIONS ================ */

  public async name(config?: CallOverrides): Promise<string> {
    if (!this._provider || !this._erc20) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return await this._erc20.name({ ...config });
  }

  public async symbol(config?: CallOverrides): Promise<string> {
    if (!this._provider || !this._erc20) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return await this._erc20.symbol({ ...config });
  }

  public async decimals(config?: CallOverrides): Promise<number> {
    if (!this._provider || !this._erc20) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return await this._erc20.decimals({ ...config });
  }

  public async totalSupply(config?: CallOverrides): Promise<BigNumber> {
    if (!this._provider || !this._erc20) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return await this._erc20.totalSupply({ ...config });
  }

  public async balanceOf(
    account: string,
    config?: CallOverrides
  ): Promise<BigNumber> {
    if (!this._provider || !this._erc20) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return await this._erc20.balanceOf(account, { ...config });
  }

  public async allowance(
    owner: string,
    spender: string,
    config?: CallOverrides
  ): Promise<BigNumber> {
    if (!this._provider || !this._erc20) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return await this._erc20.allowance(owner, spender, { ...config });
  }

  /* ================ TRANSACTION FUNCTIONS ================ */

  public async transfer(
    recipient: string,
    amount: BigNumber,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<void> {
    if (!this._provider || !this._erc20 || this._provider instanceof Provider) {
      throw new Error(`${this._errorTitle}: no singer`);
    }
    const gas = await this._erc20
      .connect(this._provider)
      .estimateGas.transfer(recipient, amount, { ...config });
    const transaction = await this._erc20
      .connect(this._provider)
      .transfer(recipient, amount, {
        gasLimit: gas.mul(13).div(10),
        ...config
      });
    if (callback) {
      callback(transaction);
    }
    const receipt = await transaction.wait(this._waitConfirmations);
    if (callback) {
      callback(receipt);
    }
  }

  public async approve(
    spender: string,
    amount: BigNumber,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<void> {
    if (!this._provider || !this._erc20 || this._provider instanceof Provider) {
      throw new Error(`${this._errorTitle}: no singer`);
    }
    const gas = await this._erc20
      .connect(this._provider)
      .estimateGas.approve(spender, amount, { ...config });
    const transaction = await this._erc20
      .connect(this._provider)
      .approve(spender, amount, { gasLimit: gas.mul(13).div(10), ...config });
    if (callback) {
      callback(transaction);
    }
    const receipt = await transaction.wait(this._waitConfirmations);
    if (callback) {
      callback(receipt);
    }
  }

  public async transferFrom(
    sender: string,
    recipient: string,
    amount: BigNumber,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<void> {
    if (!this._provider || !this._erc20 || this._provider instanceof Provider) {
      throw new Error(`${this._errorTitle}: no singer`);
    }
    const gas = await this._erc20
      .connect(this._provider)
      .estimateGas.transferFrom(sender, recipient, amount, { ...config });
    const transaction = await this._erc20
      .connect(this._provider)
      .transferFrom(sender, recipient, amount, {
        gasLimit: gas.mul(13).div(10),
        ...config
      });
    await transaction.wait(this._waitConfirmations);
    if (callback) {
      callback(transaction);
    }
    const receipt = await transaction.wait(this._waitConfirmations);
    if (callback) {
      callback(receipt);
    }
  }
}
