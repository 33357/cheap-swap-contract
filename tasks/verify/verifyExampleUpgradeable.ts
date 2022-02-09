import '@nomiclabs/hardhat-ethers';
import {task} from 'hardhat/config';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import * as utils from '../utils';

const contract = 'ExampleUpgradeable';
const taskName = `${contract}:verify`;

task(taskName, `verify ${contract}`).setAction(
  async (_, hre: HardhatRuntimeEnvironment) => {
    const deployment = await utils.getDeployment(
      Number(await hre.getChainId())
    );

    utils.log.info(
      `verify ${contract},implAddress: ${deployment.ExampleUpgradeable.implAddress}`
    );
    await hre.run('verify:verify', {
      address: deployment.ExampleUpgradeable.implAddress,
      constructorArguments: [],
    });
  }
);
