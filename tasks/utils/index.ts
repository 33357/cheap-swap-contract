export * from './ethers-execution-manager';
import fs from 'fs';
import pino from 'pino';

const DEPLOYMENT_DIR = './deployment';
const DEPLOYMENT_PATH = `${DEPLOYMENT_DIR}/deployment.json`;
export const LOCK_DIR = './logs';
export const RETRY_NUMBER = 100;

export async function getDeployment(networkId: number): Promise<Deployment> {
  if (!fs.existsSync(DEPLOYMENT_DIR)) {
    await fs.promises.mkdir(DEPLOYMENT_DIR);
  }
  if (!fs.existsSync(DEPLOYMENT_PATH)) {
    return {} as Deployment;
  } else {
    const deploymentFull: DeploymentFull = JSON.parse(
      (await fs.promises.readFile(DEPLOYMENT_PATH)).toString()
    );
    if (deploymentFull[networkId]) {
      return deploymentFull[networkId];
    } else {
      return {} as Deployment;
    }
  }
}

export async function setDeployment(
  networkId: number,
  deployment: Deployment
): Promise<void> {
  if (!fs.existsSync(DEPLOYMENT_DIR)) {
    await fs.promises.mkdir(DEPLOYMENT_DIR);
  }
  if (!fs.existsSync(DEPLOYMENT_PATH)) {
    const deploymentFull: DeploymentFull = {};
    deploymentFull[networkId] = deployment;
    await fs.promises.writeFile(
      DEPLOYMENT_PATH,
      JSON.stringify(deploymentFull, undefined, 2)
    );
  } else {
    const deploymentFull: DeploymentFull = JSON.parse(
      (await fs.promises.readFile(DEPLOYMENT_PATH)).toString()
    );
    deploymentFull[networkId] = deployment;
    await fs.promises.writeFile(
      DEPLOYMENT_PATH,
      JSON.stringify(deploymentFull, undefined, 2)
    );
  }
}

export const log = pino();

export const EMPTY_CONTRACT = {
  proxyAddress: '',
  implAddress: '',
  version: '',
  contract: '',
  operator: '',
  fromBlock: 0,
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
  [contractName: string]: ContractInfo;
}

export interface DeploymentFull {
  [networkId: number]: Deployment;
}
