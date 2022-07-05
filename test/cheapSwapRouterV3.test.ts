import {BigNumber, ethers} from 'ethers';
import {getDeployment} from '../tasks';

const uniswap = {
  encodePath(path: string[], fees: Array<number>): string {
    if (path.length != fees.length + 1) {
      throw new Error('path/fee lengths do not match');
    }
    let encoded = '0x';
    for (let i = 0; i < fees.length; i++) {
      encoded += path[i].slice(2);
      encoded += fees[i].toString(16).padStart(2 * 3, '0');
    }
    encoded += path[path.length - 1].slice(2);
    return encoded.toLowerCase();
  },
};

async function main() {
  console.log(
    `------------------------------------exactInput----------------------------------------------`
  );
  const deploymentMain = await getDeployment(1);

  console.log(
    `------------------------------------test value exactInput----------------------------------------------`
  );
  const deploymentTest = await getDeployment(137);
  const testValueExactInput = {
    msgValue: ethers.utils.parseEther('0.0042').toString(),
    maxRunTime: 1,
    deadline: Math.ceil(new Date().getTime() / 1000) + 60 * 60,
    cheapSwapRouterV3Address: deploymentTest['CheapSwapRouterV3'].implAddress,
    value: ethers.utils.parseEther('0.001'),
    cheapSwapRouterV3Selector: '0x89a56aae',
    amoutIn: ethers.utils.parseEther('0.001'),
    // amountOutMin
    amountOut: BigNumber.from(100),
    path: uniswap.encodePath(
      [
        '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      ],
      [500]
    ),
  };
  logData(testValueExactInput);

  console.log(
    `------------------------------------test token exactInput----------------------------------------------`
  );
  const testTokenExactInput = {
    msgValue: ethers.utils.parseEther('0.0043').toString(),
    maxRunTime: 1,
    deadline: Math.ceil(new Date().getTime() / 1000) + 60 * 60,
    cheapSwapRouterV3Address: deploymentTest['CheapSwapRouterV3'].implAddress,
    value: ethers.utils.parseEther('0'),
    cheapSwapRouterV3Selector: '0x89a56aae',
    amoutIn: ethers.utils.parseEther('0.001'),
    // amountOutMin
    amountOut: BigNumber.from(100),
    path: uniswap.encodePath(
      [
        '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      ],
      [500]
    ),
  };
  logData(testTokenExactInput);

  console.log(
    `------------------------------------test value exactPerInput----------------------------------------------`
  );
  const testValueExactPerInput = {
    msgValue: ethers.utils.parseEther('0.0044').toString(),
    maxRunTime: 1,
    deadline: Math.ceil(new Date().getTime() / 1000) + 60 * 60,
    cheapSwapRouterV3Address: deploymentTest['CheapSwapRouterV3'].implAddress,
    value: ethers.utils.parseEther('0.001'),
    cheapSwapRouterV3Selector: '0x89a56aae',
    amoutIn: ethers.utils.parseEther('0.001'),
    // amountOutMinPerAmountIn
    amountOut: ethers.utils
      .parseEther('0.001')
      .mul(BigNumber.from((10 ** 18).toString()))
      .div(BigNumber.from(100)),
    path: uniswap.encodePath(
      [
        '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      ],
      [500]
    ),
  };
  logData(testValueExactPerInput);

  console.log(
    `------------------------------------test token exactPerInput----------------------------------------------`
  );
  const testTokenExactPerInput = {
    msgValue: ethers.utils.parseEther('0.0045').toString(),
    maxRunTime: 1,
    deadline: Math.ceil(new Date().getTime() / 1000) + 60 * 60,
    cheapSwapRouterV3Address: deploymentTest['CheapSwapRouterV3'].implAddress,
    value: ethers.utils.parseEther('0.001'),
    cheapSwapRouterV3Selector: '0x89a56aae',
    amoutIn: ethers.utils.parseEther('0.001'),
    // amountOutMinPerAmountIn
    amountOut: ethers.utils
      .parseEther('0.001')
      .mul(BigNumber.from((10 ** 18).toString()))
      .div(BigNumber.from(100)),
    path: uniswap.encodePath(
      [
        '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      ],
      [500]
    ),
  };
  logData(testTokenExactPerInput);

  console.log(
    `------------------------------------test value exactOutput----------------------------------------------`
  );
  const testValueExactOutput = {
    msgValue: ethers.utils.parseEther('0.0046').toString(),
    maxRunTime: 1,
    deadline: Math.ceil(new Date().getTime() / 1000) + 60 * 60,
    cheapSwapRouterV3Address: deploymentTest['CheapSwapRouterV3'].implAddress,
    value: ethers.utils.parseEther('0.001'),
    cheapSwapRouterV3Selector: '0xb1e0a10c',
    // amountInMax
    amoutIn: ethers.utils.parseEther('0.001'),
    amountOut: BigNumber.from(100),
    path: uniswap.encodePath(
      [
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      ],
      [500]
    ),
  };
  logData(testValueExactOutput);

  console.log(
    `------------------------------------test token exactOutput----------------------------------------------`
  );
  const testTokenExactOutput = {
    msgValue: ethers.utils.parseEther('0.0047').toString(),
    maxRunTime: 1,
    deadline: Math.ceil(new Date().getTime() / 1000) + 60 * 60,
    cheapSwapRouterV3Address: deploymentTest['CheapSwapRouterV3'].implAddress,
    value: ethers.utils.parseEther('0'),
    cheapSwapRouterV3Selector: '0xb1e0a10c',
    // amountInMax
    amoutIn: ethers.utils.parseEther('0.001'),
    amountOut: BigNumber.from(100),
    path: uniswap.encodePath(
      [
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      ],
      [500]
    ),
  };
  logData(testTokenExactOutput);
}

main();

function numToHex(num: number, fixed: number) {
  let hex = num.toString(16);
  while (hex.length < fixed) {
    hex = '0' + hex;
  }
  return hex;
}

function bigToHex(big: BigNumber, fixed: number) {
  let hex = delete0x(big.toHexString());
  while (hex.length < fixed) {
    hex = '0' + hex;
  }
  return hex;
}

function delete0x(str: string) {
  return str.replace('0x', '');
}

function logData(obj: any) {
  console.log(
    {
      msgValue: obj.msgValue,
      maxRunTime: obj.maxRunTime,
      deadline: obj.deadline,
      target: obj.cheapSwapRouterV3Address,
      value: obj.value.toString(),
      data:
        obj.cheapSwapRouterV3Selector +
        bigToHex(obj.amountOut, 30) +
        (obj.value.eq(0) ? bigToHex(obj.amoutIn, 30) : '') +
        delete0x(obj.path),
    },
    obj.amoutIn
  );
}
