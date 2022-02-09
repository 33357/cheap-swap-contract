import { BigNumber, CallOverrides, PayableOverrides, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';

export interface ERC20Client {
  connect(
    provider: Provider | Signer,
    address: string,
    waitConfirmations?: number
  ): Promise<void>;

  address(): string;

  /* ================ VIEW FUNCTIONS ================ */

  name(config?: CallOverrides): Promise<string>;

  symbol(config?: CallOverrides): Promise<string>;

  decimals(config?: CallOverrides): Promise<number>;

  totalSupply(config?: CallOverrides): Promise<BigNumber>;

  balanceOf(account: string, config?: CallOverrides): Promise<BigNumber>;

  allowance(
    owner: string,
    spender: string,
    config?: CallOverrides
  ): Promise<BigNumber>;

  /* ================ TRANSACTION FUNCTIONS ================ */

  transfer(
    recipient: string,
    amount: BigNumber,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<void>;

  approve(
    spender: string,
    amount: BigNumber,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<void>;

  transferFrom(
    sender: string,
    recipient: string,
    amount: BigNumber,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<void>;
}
