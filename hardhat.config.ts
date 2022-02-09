import {HardhatUserConfig} from 'hardhat/config';
import {BigNumber} from 'ethers';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-deploy';
import 'hardhat-contract-sizer';
import '@openzeppelin/hardhat-upgrades';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import '@nomiclabs/hardhat-etherscan';
import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('./sdk/src/typechain')) {
  import('./tasks');
}

dotenv.config();
const privateKey = process.env.PRIVATE_KEY;
const gasPrice = process.env.GAS_PRICE || 1;
const mnemonic = 'test test test test test test test test test test test junk';
let accounts;
if (privateKey) {
  accounts = [privateKey];
} else {
  accounts = {
    mnemonic,
  };
}

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
        accountsBalance: '100000000000000000000000000',
      },
      blockGasLimit: 60000000,
      initialBaseFeePerGas: 0,
    },
    localhost: {
      url: 'http://localhost:8545',
      accounts,
      timeout: 60000,
      blockGasLimit: 60000000,
      gasPrice: BigNumber.from(gasPrice)
        .mul(10 ** 9)
        .toNumber(),
    },
    1: {
      url: `https://mainnet.infura.io/v3/${process.env.MAINNET_INFURA}`,
      accounts,
      timeout: 60000,
      gasPrice: BigNumber.from(gasPrice)
        .mul(10 ** 9)
        .toNumber(),
    },
    4: {
      url: `https://rinkeby.infura.io/v3/${process.env.RINKEBY_INFURA}`,
      accounts,
      timeout: 60000,
      gasPrice: BigNumber.from(gasPrice)
        .mul(10 ** 9)
        .toNumber(),
    },
    56: {
      url: `https://bsc-dataseed1.binance.org/`,
      accounts,
      timeout: 60000,
      gasPrice: BigNumber.from(gasPrice)
        .mul(10 ** 9)
        .toNumber(),
    },
    97: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
      accounts,
      timeout: 60000,
      gasPrice: BigNumber.from(gasPrice)
        .mul(10 ** 9)
        .toNumber(),
    },
  },
  namedAccounts: {
    deployer: 0,
    accountA: 1,
    accountB: 2,
    accountC: 3,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  gasReporter: {
    currency: 'CHF',
    gasPrice: 1,
  },
  typechain: {
    outDir: './sdk/src/typechain',
    target: 'ethers-v5',
  },
  etherscan: {
    apiKey: process.env.APIKEY,
  },
};
export default config;
