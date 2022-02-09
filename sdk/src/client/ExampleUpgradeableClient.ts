import { CallOverrides, PayableOverrides, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';

export interface ExampleUpgradeableClient {
  connect(
    provider: Provider | Signer,
    address?: string,
    waitConfirmations?: number
  ): Promise<void>;

  address(): string;

  /* ================ VIEW FUNCTIONS ================ */

  implementationVersion(config?: CallOverrides): Promise<string>;

  /* ================ TRANSACTION FUNCTIONS ================ */

  transaction(config?: PayableOverrides, callback?: Function): Promise<void>;
}
