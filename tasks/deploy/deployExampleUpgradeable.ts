import '@nomiclabs/hardhat-ethers';
import {task} from 'hardhat/config';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {getImplementationAddress} from '@openzeppelin/upgrades-core';
import {PayableOverrides} from 'ethers';
import {
  EthersExecutionManager,
  getDeployment,
  setDeployment,
  LOCK_DIR,
  RETRY_NUMBER,
  log,
} from '../utils';

const contract = 'ExampleUpgradeable';
const taskName = `${contract}:deploy`;

task(taskName, `Deploy ${contract}`)
  .addOptionalParam('waitNum', 'The waitNum to transaction')
  .addOptionalParam('gasPrice', 'The gasPrice to transaction')
  .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
    const txConfig: PayableOverrides = {};
    txConfig.gasPrice = args['gasPrice']
      ? hre.ethers.utils.parseUnits(args['gasPrice'], 'gwei')
      : undefined;
    const waitNum = args['waitNum'] ? parseInt(args['waitNum']) : 1;
    const ethersExecutionManager = new EthersExecutionManager(
      `${LOCK_DIR}/${taskName}.lock`,
      RETRY_NUMBER,
      waitNum
    );
    await ethersExecutionManager.load();
    const operator = (await hre.ethers.getSigners())[0];

    log.info(`deploy ${contract}`);
    const Contract = await hre.ethers.getContractFactory(contract);
    const chainId = Number(await hre.getChainId());
    const deployResult = await ethersExecutionManager.transaction(
      (<any>hre).upgrades.deployProxy,
      [Contract, [], {kind: 'uups'}],
      ['contractAddress', 'blockNumber'],
      `deploy ${contract}`,
      txConfig
    );
    const contractProxyAddress = deployResult.contractAddress;
    const contractImplAddress = await getImplementationAddress(
      hre.ethers.provider,
      contractProxyAddress
    );
    const contractFromBlock = deployResult.blockNumber;
    const _contract = Contract.attach(contractProxyAddress);
    const contractVersion = await ethersExecutionManager.call(
      _contract.implementationVersion,
      [],
      `${contract} implementationVersion`
    );
    log.info(
      `${contract} deployed proxy at ${contractProxyAddress},impl at ${contractImplAddress},version ${contractVersion},fromBlock ${contractFromBlock}`
    );

    const deployment = await getDeployment(chainId);

    deployment.ExampleUpgradeable = {
      proxyAddress: contractProxyAddress,
      implAddress: contractImplAddress,
      version: contractVersion,
      contract: contract,
      operator: operator.address,
      fromBlock: contractFromBlock,
    };

    await setDeployment(chainId, deployment);

    ethersExecutionManager.printGas();
    ethersExecutionManager.deleteLock();
  });
