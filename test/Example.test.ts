import {expect} from 'chai';
import {ethers, getNamedAccounts} from 'hardhat';
import {Signer} from 'ethers';
import pino from 'pino';
import {EtherExampleClient, Example} from '../sdk/dist';
import {ERC20TEST} from '../sdk/src/typechain';

const Logger = pino();
const contractName = 'Example';

describe(`test ${contractName}`, function () {
  let deployer: Signer;
  let accountA: Signer;

  before('setup accounts', async () => {
    const NamedAccounts = await getNamedAccounts();
    deployer = await ethers.getSigner(NamedAccounts.deployer);
    accountA = await ethers.getSigner(NamedAccounts.accountA);
  });

  describe(`test ${contractName} sdk`, function () {
    const contract = new EtherExampleClient();

    beforeEach('deploy and init contract', async () => {
      const Contract = await ethers.getContractFactory(`${contractName}`);
      const contractResult = await Contract.connect(deployer).deploy();
      await contract.connect(deployer, contractResult.address, 1);
      Logger.info(`deployed ${contractName}`);
    });

    it('check init data', async function () {});
  });

  describe(`test ${contractName}`, function () {
    let contract: Example;
    let erc20: ERC20TEST;

    beforeEach('deploy and init contract', async () => {
      const ERC20 = await ethers.getContractFactory('ERC20_TEST');
      erc20 = (await ERC20.connect(deployer).deploy()) as ERC20TEST;
      Logger.info(`deployed ERC20 contract`);

      const Contract = await ethers.getContractFactory(contractName);
      contract = (await Contract.deploy()) as Example;
      Logger.info(`deployed ${contractName}`);
    });

    it('check admin', async function () {});
  });
});
