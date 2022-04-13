import { Provider } from '@ethersproject/providers';
import { BigNumber, CallOverrides, PayableOverrides, Signer } from 'ethers';
import { ExampleClient, Example, Example__factory, DeploymentInfo } from '..';

export class EtherExampleClient implements ExampleClient {
  protected _provider: Provider | Signer | undefined;
  protected _waitConfirmations = 3;
  private _contract: Example | undefined;
  private _errorTitle: string | undefined;

  public async connect(
    provider: Provider | Signer,
    address?: string,
    waitConfirmations?: number
  ) {
    this._errorTitle = 'EtherExampleClient';
    if (!address) {
      let network;
      if (provider instanceof Signer) {
        if (provider.provider) {
          network = await provider.provider.getNetwork();
        }
      } else {
        network = await provider.getNetwork();
      }
      if (!network) {
        throw new Error(`${this._errorTitle}: no provider`);
      }
      if (!DeploymentInfo[network.chainId]) {
        throw new Error(`${this._errorTitle}: error chain`);
      }
      address = DeploymentInfo[network.chainId].Example.proxyAddress;
    }
    this._contract = Example__factory.connect(address, provider);
    this._provider = provider;
    if (waitConfirmations) {
      this._waitConfirmations = waitConfirmations;
    }
  }

  public address(): string {
    if (!this._provider || !this._contract) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._contract.address;
  }

  /* ================ VIEW FUNCTIONS ================ */

  public async viewIt(config?: CallOverrides): Promise<BigNumber> {
    if (!this._provider || !this._contract) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._contract.viewIt({ ...config });
  }

  /* ================ TRANSACTION FUNCTIONS ================ */

  public async transaction(
    config?: PayableOverrides,
    callback?: Function
  ): Promise<void> {
    if (
      !this._provider ||
      !this._contract ||
      this._provider instanceof Provider
    ) {
      throw new Error(`${this._errorTitle}: no singer`);
    }
    const gas = await this._contract
      .connect(this._provider)
      .estimateGas.transaction({
        ...config
      });
    const tx = await this._contract.connect(this._provider).transaction({
      gasLimit: gas.mul(13).div(10),
      ...config
    });
    if (callback) {
      callback(tx);
    }
    const rx = await tx.wait(this._waitConfirmations);
    if (callback) {
      callback(rx);
    }
  }
}
