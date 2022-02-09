import { Provider } from '@ethersproject/providers';
import { CallOverrides, PayableOverrides, Signer } from 'ethers';
import {
  ExampleUpgradeableClient,
  ExampleUpgradeable,
  ExampleUpgradeable__factory,
  DeploymentInfo
} from '..';

export class EtherExampleUpgradeableClient implements ExampleUpgradeableClient {
  protected _provider: Provider | Signer | undefined;
  protected _waitConfirmations = 3;
  private _upgradeable: ExampleUpgradeable | undefined;
  private _errorTitle: string | undefined;

  public async connect(
    provider: Provider | Signer,
    address?: string,
    waitConfirmations?: number
  ) {
    this._errorTitle = 'EtherExampleUpgradeableClient';
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
      address = DeploymentInfo[network.chainId].ExampleUpgradeable.proxyAddress;
    }
    this._upgradeable = ExampleUpgradeable__factory.connect(address, provider);
    if (waitConfirmations) {
      this._waitConfirmations = waitConfirmations;
    }
  }

  public address(): string {
    if (!this._provider || !this._upgradeable) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._upgradeable.address;
  }

  /* ================ VIEW FUNCTIONS ================ */

  public async implementationVersion(config?: CallOverrides): Promise<string> {
    if (!this._provider || !this._upgradeable) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._upgradeable.implementationVersion({ ...config });
  }

  /* ================ TRANSACTION FUNCTIONS ================ */

  public async transaction(
    config?: PayableOverrides,
    callback?: Function
  ): Promise<void> {
    if (
      !this._provider ||
      !this._upgradeable ||
      this._provider instanceof Provider
    ) {
      throw new Error(`${this._errorTitle}: no singer`);
    }
    const gas = await this._upgradeable
      .connect(this._provider)
      .estimateGas.transaction({
        ...config
      });
    const tx = await this._upgradeable.connect(this._provider).transaction({
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
