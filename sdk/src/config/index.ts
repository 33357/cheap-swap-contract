export interface Chain {
  scanUrl: string;
  apiScanUrl: string;
  web3Url: string;
  chainName: string;
}

export const chainData: { [chainId: number]: Chain } = {
  56: {
    scanUrl: 'https://bscscan.com',
    apiScanUrl: 'https://api.bscscan.com',
    web3Url: 'https://bsc-dataseed4.binance.org',
    chainName: 'bsc'
  },
  97: {
    scanUrl: 'https://testnet.bscscan.com',
    apiScanUrl: 'https://api-testnet.bscscan.com',
    web3Url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    chainName: 'bsc-test'
  }
};

export interface ContractInfo {
  proxyAddress: string;
  implAddress: string;
  version: string;
  contract: string;
  operator: string;
  fromBlock: number;
}

export interface Deployment {
  Example: ContractInfo;
  ExampleUpgradeable: ContractInfo;
}

export interface DeploymentFull {
  [chainId: number]: Deployment;
}

import * as deploymentData from './deployment.json';
export const DeploymentInfo: DeploymentFull = deploymentData;
