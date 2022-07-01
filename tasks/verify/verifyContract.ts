import '@nomiclabs/hardhat-ethers';
import {task} from 'hardhat/config';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import * as utils from '../utils';

task(`contract:verify`, `verify contract`)
  .addOptionalParam('contract', 'The contract name')
  .addOptionalParam('args', 'The contract args')
  .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
    const contract = args['contract'];
    const _args = JSON.parse(args['args']);

    const deployment = await utils.getDeployment(
      Number(await hre.getChainId())
    );

    utils.log.info(
      `verify ${contract},implAddress: ${deployment[contract].implAddress}`
    );
    await hre.run('verify:verify', {
      address: deployment[contract].implAddress,
      constructorArguments: _args,
    });
  });
