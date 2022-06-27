import {expect} from 'chai';
import {ethers, getNamedAccounts, upgrades} from 'hardhat';
import {BigNumber, Signer} from 'ethers';
import pino from 'pino';
import {EtherExampleUpgradeableClient, ExampleUpgradeable} from '../sdk/dist';
import {ERC20TEST} from '../sdk/src/typechain';

const Logger = pino();
const contractName = 'ExampleUpgradeable';

describe(`test ${contractName}`, function () {
  let deployer: Signer;
  let accountA: Signer;

  before('setup accounts', async () => {
    const NamedAccounts = await getNamedAccounts();
    deployer = await ethers.getSigner(NamedAccounts.deployer);
    accountA = await ethers.getSigner(NamedAccounts.accountA);
  });

  describe(`test ${contractName} sdk`, function () {
    const contract = new EtherExampleUpgradeableClient();

    beforeEach(`deploy and init ${contractName}`, async () => {
      const Contract = await ethers.getContractFactory(`${contractName}`);
      const contractResult = await upgrades.deployProxy(
        Contract.connect(deployer),
        [],
        {
          kind: 'uups',
        }
      );
      await contract.connect(deployer, contractResult.address, 1);
      Logger.info(`deployed ${contractName}`);
    });

    it('check init data', async function () {});
  });

  describe(`test ${contractName}`, function () {
    let contract: ExampleUpgradeable;
    let erc20: ERC20TEST;

    beforeEach('deploy and init contract', async () => {
      const ERC20 = await ethers.getContractFactory('ERC20_TEST');
      erc20 = (await ERC20.connect(deployer).deploy()) as ERC20TEST;
      Logger.info(`deployed ERC20 contract`);

      const Contract = await ethers.getContractFactory(contractName);
      contract = (await upgrades.deployProxy(Contract.connect(deployer), [], {
        kind: 'uups',
      })) as ExampleUpgradeable;
      Logger.info(`deployed ${contractName}`);
    });

    it('check admin', async function () {
      const Contract = await ethers.getContractFactory(contractName);
      await expect(
        upgrades.upgradeProxy(contract.address, Contract.connect(accountA), {
          kind: 'uups',
        })
      ).revertedWith(`${contractName}: require admin permission`);
      await upgrades.upgradeProxy(
        contract.address,
        Contract.connect(deployer),
        {
          kind: 'uups',
        }
      );

      await expect(contract.connect(accountA).pause()).revertedWith(
        `${contractName}: require admin permission`
      );
      await contract.connect(deployer).pause();
      expect(await contract.paused()).equal(true);

      await expect(contract.connect(accountA).unpause()).revertedWith(
        `${contractName}: require admin permission`
      );
      await contract.connect(deployer).unpause();
      expect(await contract.paused()).equal(false);

      await erc20.transfer(contract.address, BigNumber.from(100));
      await expect(
        contract
          .connect(accountA)
          .transferAnyERC20Token(
            erc20.address,
            await accountA.getAddress(),
            BigNumber.from(100)
          )
      ).revertedWith(`${contractName}: require admin permission`);
      await contract
        .connect(deployer)
        .transferAnyERC20Token(
          erc20.address,
          await accountA.getAddress(),
          BigNumber.from(100)
        );
      expect(await erc20.balanceOf(await accountA.getAddress())).equal(
        BigNumber.from(100)
      );
    });
  });
});
