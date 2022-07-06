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
    `------------------------------------ setting ----------------------------------------------`
  );
  // const deploymentMain = await getDeployment(1);
  // const WETHMain = '0xc778417E063141139Fce010982780140Aa0cD5Ab';
  // const USDTMain = '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735';
  // const amountInMain = ethers.utils.parseEther('0.001');
  // const amountOutMain = BigNumber.from(100);
  // const maxRunTimeMain = 1;
  // const deadlineMain = Math.ceil(new Date().getTime() / 1000) + 60 * 60;
  // const cheapSwapRouterV3AddressMain = deploymentMain['CheapSwapRouterV3'].implAddress;
  const cheapSwapRouterV3AmountInSelector = '0x89a56aae';
  const cheapSwapRouterV3PerAmountInSelector = '0xf60a7336';
  const cheapSwapRouterV3AmountOutSelector = '0xb1e0a10c';
  // const amountZeroMain = ethers.utils.parseEther('0');
  // const amount18Main = BigNumber.from((10 ** 18).toString());
  // const feeMain = 3000;
  // const amountInPathMain = uniswap.encodePath(
  //   [
  //     WETHMain,
  //     USDTMain,
  //   ],
  //   [feeMain]
  // );
  // const amountOutPathMain = uniswap.encodePath(
  //   [
  //     USDTMain,
  //     WETHMain,
  //   ],
  //   [feeMain]
  // )

  console.log(
    `------------------------------------exactInput----------------------------------------------`
  );

  console.log(
    `------------------------------------ test setting ----------------------------------------------`
  );
  const deploymentTest = await getDeployment(137);
  const WETH = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';
  const USDT = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
  const amountIn = ethers.utils.parseEther('0.001');
  const amountOut = BigNumber.from(100);
  const maxRunTime = 1;
  const deadline = Math.ceil(new Date().getTime() / 1000) + 60 * 60;
  const cheapSwapRouterV3Address =
    deploymentTest['CheapSwapRouterV3'].implAddress;
  const amountZero = ethers.utils.parseEther('0');
  const amount18 = BigNumber.from((10 ** 18).toString());
  const fee = 3000;
  const amountInPath = uniswap.encodePath([WETH, USDT], [fee]);
  const amountOutPath = uniswap.encodePath([USDT, WETH], [fee]);

  console.log(
    `------------------------------------ test value exactInput ----------------------------------------------`
  );
  const testValueExactInput = {
    msgValue: ethers.utils.parseEther('0.0042').toString(),
    maxRunTime: maxRunTime,
    deadline: deadline,
    cheapSwapRouterV3Address: cheapSwapRouterV3Address,
    value: amountIn,
    cheapSwapRouterV3Selector: cheapSwapRouterV3AmountInSelector,
    amoutIn: amountZero,
    // amountOutMin
    amountOut: amountOut,
    path: amountInPath,
  };
  logData(testValueExactInput);

  console.log(
    `------------------------------------test token exactInput----------------------------------------------`
  );
  const testTokenExactInput = {
    msgValue: ethers.utils.parseEther('0.0043').toString(),
    maxRunTime: maxRunTime,
    deadline: deadline,
    cheapSwapRouterV3Address: cheapSwapRouterV3Address,
    value: amountZero,
    cheapSwapRouterV3Selector: cheapSwapRouterV3AmountInSelector,
    amoutIn: amountIn,
    // amountOutMin
    amountOut: amountOut,
    path: amountInPath,
  };
  logData(testTokenExactInput);

  console.log(
    `------------------------------------test value exactPerInput----------------------------------------------`
  );

  const testValueExactPerInput = {
    msgValue: ethers.utils.parseEther('0.0044').toString(),
    maxRunTime: maxRunTime,
    deadline: deadline,
    cheapSwapRouterV3Address: cheapSwapRouterV3Address,
    value: amountZero,
    cheapSwapRouterV3Selector: cheapSwapRouterV3PerAmountInSelector,
    amoutIn: amountZero,
    // amountOutMinPerAmountIn
    amountOut: amountOut.mul(amount18).div(amountIn),
    path: amountInPath,
  };
  logData(testValueExactPerInput);

  console.log(
    `------------------------------------test token exactPerInput----------------------------------------------`
  );
  const testTokenExactPerInput = {
    msgValue: ethers.utils.parseEther('0.0045').toString(),
    maxRunTime,
    deadline,
    cheapSwapRouterV3Address: cheapSwapRouterV3Address,
    value: amountZero,
    cheapSwapRouterV3Selector: cheapSwapRouterV3PerAmountInSelector,
    amoutIn: amountZero,
    // amountOutMinPerAmountIn
    amountOut: amountOut.mul(amount18).div(amountIn),
    path: amountInPath,
  };
  logData(testTokenExactPerInput);

  console.log(
    `------------------------------------test value exactPerInputmax----------------------------------------------`
  );
  const testValueExactPerInputmax = {
    msgValue: ethers.utils.parseEther('0').toString(),
    maxRunTime,
    deadline,
    cheapSwapRouterV3Address: cheapSwapRouterV3Address,
    value: amountZero,
    cheapSwapRouterV3Selector: cheapSwapRouterV3PerAmountInSelector,
    amoutIn: amountZero,
    // amountOutMinPerAmountIn
    amountOut: amountOut.mul(amount18).div(amountIn),
    path: amountInPath,
  };
  logData(testValueExactPerInputmax);

  console.log(
    `------------------------------------test token exactPerInputmax----------------------------------------------`
  );
  const testTokenExactPerInputmax = {
    msgValue: ethers.utils.parseEther('0.0047').toString(),
    maxRunTime,
    deadline,
    cheapSwapRouterV3Address: cheapSwapRouterV3Address,
    value: amountZero,
    cheapSwapRouterV3Selector: cheapSwapRouterV3PerAmountInSelector,
    amoutIn: amountZero,
    // amountOutMinPerAmountIn
    amountOut: amountOut.mul(amount18).div(amountIn),
    path: amountInPath,
  };
  logData(testTokenExactPerInputmax);

  console.log(
    `------------------------------------test value exactOutput----------------------------------------------`
  );
  const testValueExactOutput = {
    msgValue: ethers.utils.parseEther('0.0048').toString(),
    maxRunTime: maxRunTime,
    deadline: deadline,
    cheapSwapRouterV3Address: cheapSwapRouterV3Address,
    value: amountIn,
    cheapSwapRouterV3Selector: cheapSwapRouterV3AmountOutSelector,
    // amountInMax
    amoutIn: amountZero,
    amountOut: amountOut,
    path: amountOutPath,
  };
  logData(testValueExactOutput);

  console.log(
    `------------------------------------test token exactOutput----------------------------------------------`
  );
  const testTokenExactOutput = {
    msgValue: ethers.utils.parseEther('0.0049').toString(),
    maxRunTime: maxRunTime,
    deadline: deadline,
    cheapSwapRouterV3Address: cheapSwapRouterV3Address,
    value: amountZero,
    cheapSwapRouterV3Selector: cheapSwapRouterV3AmountOutSelector,
    // amountInMax
    amoutIn: amountIn,
    amountOut: amountOut,
    path: amountOutPath,
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
  console.log({
    msgValue: obj.msgValue,
    maxRunTime: obj.maxRunTime,
    deadline: obj.deadline,
    target: obj.cheapSwapRouterV3Address,
    value: obj.value.toString(),
    data:
      obj.cheapSwapRouterV3Selector +
      bigToHex(obj.amountOut, 30) +
      (obj.value.eq(0) && obj.msgValue != '0'
        ? bigToHex(obj.amoutIn, 30)
        : '') +
      delete0x(obj.path),
  });
}
