import { CallOverrides, PayableOverrides, BigNumber, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';

export interface ExampleClient {
  connect(
    provider: Provider | Signer,
    address?: string,
    waitConfirmations?: number
  ): Promise<void>;

  address(): string;

  /* ================ VIEW FUNCTIONS ================ */

  viewIt(config?: CallOverrides): Promise<BigNumber>;

  /* ================ TRANSACTION FUNCTIONS ================ */

  transaction(config?: PayableOverrides, callback?: Function): Promise<void>;
}
