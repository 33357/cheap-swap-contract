import { BigNumber, ethers } from 'ethers';
import { getDeployment } from '../tasks';

interface CheapSwapRouterV3Data {
  name: string,
  msgValue: BigNumber,
  maxRunTime: number,
  deadline: number,
  cheapSwapRouterV3Address: string,
  value: BigNumber,
  cheapSwapRouterV3Selector: string,
  amountIn: BigNumber,
  amountOut: BigNumber,
  path: string,
}

interface CheapSwapRouterV3ChainSet {
  maxRunTime: number;
  deadline: number;
  func: {
    [funcName: string]: CheapSwapRouterV3FuncSet;
  };
}

interface CheapSwapRouterV3FuncSet {
  msgValue: BigNumber;
  cheapSwapRouterV3Selector: string,
  value: BigNumber,
  amountIn: BigNumber,
  amountOut: BigNumber,
  path: string
}

async function main() {
  const tokenMap: { [chainId: number]: { [tokenName: string]: string } } = {
    1: {
      WETH: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
    },
    137: {
      WETH: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
    }
  }
  const path: { [chainId: number]: { amountIn: string, amountOut: string } } = {
    1: {
      amountIn: encodePath([tokenMap[1].WETH, tokenMap[1].USDT], [3000]),
      amountOut: encodePath([tokenMap[1].USDT, tokenMap[1].WETH], [3000]),
    },
    137: {
      amountIn: encodePath([tokenMap[137].WETH, tokenMap[137].USDT], [3000]),
      amountOut: encodePath([tokenMap[137].USDT, tokenMap[137].WETH], [3000]),
    }
  }
  const amountInSelector = '0x89a56aae';
  const perAmountInSelector = '0xf60a7336';
  const amountOutSelector = '0xb1e0a10c';
  const chainSetMap: {
    [chainId: number]: CheapSwapRouterV3ChainSet;
  } = {
    // 1: {
    //   maxRunTime: 2,
    //   deadline: Math.ceil(new Date().getTime() / 1000) + 60 * 60,
    //   func: {
    //     safeMint: {
    //       msgValue: ethers.utils.parseEther('0.004'),
    //       value: ethers.utils.parseEther('0'),
    //       selector: '0x31c864e8',
    //       mintValue: ethers.utils.parseEther('0'),
    //     },
    //     priceMint: {
    //       msgValue: ethers.utils.parseEther('0.0041'),
    //       selector: '0x0152b8c8',
    //       value: ethers.utils.parseEther('0.01'),
    //       mintValue: ethers.utils.parseEther('0.001'),
    //     },
    //   },
    // },
    137: {
      maxRunTime: 2,
      deadline: Math.ceil(new Date().getTime() / 1000) + 60 * 60,
      func: {
        amountInValue: {
          msgValue: ethers.utils.parseEther('0.0042'),
          cheapSwapRouterV3Selector: amountInSelector,
          value: ethers.utils.parseEther('0.001'),
          amountIn: ethers.utils.parseEther('0'),
          // amountOutMin
          amountOut: BigNumber.from(100),
          path: path[137].amountIn
        },
        amountInToken: {
          msgValue: ethers.utils.parseEther('0.0043'),
          cheapSwapRouterV3Selector: amountInSelector,
          value: ethers.utils.parseEther('0'),
          amountIn: ethers.utils.parseEther('0.001'),
          // amountOutMin
          amountOut: BigNumber.from(100),
          path: path[137].amountIn
        },
        perAmountInValueMax: {
          msgValue: ethers.utils.parseEther('0'),
          cheapSwapRouterV3Selector: perAmountInSelector,
          value: ethers.utils.parseEther('0'),
          amountIn: ethers.utils.parseEther('0'),
          // amountOutMinPerAmountIn
          amountOut: BigNumber.from(100).mul((10 ** 18).toString()).div(ethers.utils.parseEther('0.001')),
          path: path[137].amountIn
        },
        perAmountInTokenMax: {
          msgValue: ethers.utils.parseEther('0.0044'),
          cheapSwapRouterV3Selector: perAmountInSelector,
          value: ethers.utils.parseEther('0'),
          amountIn: ethers.utils.parseEther('0'),
          // amountOutMinPerAmountIn
          amountOut: BigNumber.from(100).mul((10 ** 18).toString()).div(ethers.utils.parseEther('0.001')),
          path: path[137].amountIn
        },
        amountOut_InValue: {
          msgValue: ethers.utils.parseEther('0.0045'),
          cheapSwapRouterV3Selector: amountOutSelector,
          value: ethers.utils.parseEther('0.001'),
          // amountInMax
          amountIn: ethers.utils.parseEther('0'),
          amountOut: BigNumber.from(100),
          path: path[137].amountOut
        },
        amountOut_InToken: {
          msgValue: ethers.utils.parseEther('0.0046'),
          cheapSwapRouterV3Selector: amountOutSelector,
          value: ethers.utils.parseEther('0'),
          // amountInMax
          amountIn: ethers.utils.parseEther('0.001'),
          amountOut: BigNumber.from(100),
          path: path[137].amountOut
        },
      },
    },
  };

  for (const chainId in chainSetMap) {
    const chainSet = chainSetMap[chainId];
    for (const name in chainSet.func) {
      const funcSet = chainSet.func[name];
      const cheapSwapRouterV3Data: CheapSwapRouterV3Data = {
        name: `chainId ${chainId}, ${name}`,
        msgValue: funcSet.msgValue,
        maxRunTime: chainSet.maxRunTime,
        deadline: chainSet.deadline,
        cheapSwapRouterV3Address: (await getDeployment(Number(chainId)))['CheapSwapRouterV3'].implAddress,
        value: funcSet.value,
        cheapSwapRouterV3Selector: funcSet.cheapSwapRouterV3Selector,
        amountIn: funcSet.amountIn,
        amountOut: funcSet.amountOut,
        path: funcSet.path,
      };
      logData(cheapSwapRouterV3Data);
    }
  }
  // const deploymentMain = await getDeployment(1);
  // const WETHMain = '0xc778417E063141139Fce010982780140Aa0cD5Ab';
  // const USDTMain = '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735';
  // const amountInMain = ethers.utils.parseEther('0.001');
  // const amountOutMain = BigNumber.from(100);
  // const maxRunTimeMain = 1;
  // const deadlineMain = Math.ceil(new Date().getTime() / 1000) + 60 * 60;
  // const cheapSwapRouterV3AddressMain = deploymentMain['CheapSwapRouterV3'].implAddress;

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

  // console.log(
  //   `------------------------------------exactInput----------------------------------------------`
  // );

  // console.log(
  //   `------------------------------------ test setting ----------------------------------------------`
  // );
  // const deploymentTest = await getDeployment(137);
  // const WETH = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';
  // const USDT = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
  // const amountIn = ethers.utils.parseEther('0.001');
  // const amountOut = BigNumber.from(100);
  // const maxRunTime = 1;
  // const deadline = Math.ceil(new Date().getTime() / 1000) + 60 * 60;
  // const cheapSwapRouterV3Address =
  //   deploymentTest['CheapSwapRouterV3'].implAddress;
  // const amountZero = ethers.utils.parseEther('0');
  // const amount18 = BigNumber.from((10 ** 18).toString());
  // const fee = 3000;
  // const amountInPath = uniswap.encodePath([WETH, USDT], [fee]);
  // const amountOutPath = uniswap.encodePath([USDT, WETH], [fee]);

  // console.log(
  //   `------------------------------------ test value exactInput ----------------------------------------------`
  // );
  // const testValueExactInput = {
  //   msgValue: ethers.utils.parseEther('0.0042').toString(),
  //   maxRunTime: maxRunTime,
  //   deadline: deadline,
  //   cheapSwapRouterV3Address: cheapSwapRouterV3Address,
  //   value: amountIn,
  //   cheapSwapRouterV3Selector: cheapSwapRouterV3AmountInSelector,
  //   amoutIn: amountZero,
  //   // amountOutMin
  //   amountOut: amountOut,
  //   path: amountInPath,
  // };
  // logData(testValueExactInput);

  // console.log(
  //   `------------------------------------test token exactInput----------------------------------------------`
  // );
  // const testTokenExactInput = {
  //   msgValue: ethers.utils.parseEther('0.0043').toString(),
  //   maxRunTime: maxRunTime,
  //   deadline: deadline,
  //   cheapSwapRouterV3Address: cheapSwapRouterV3Address,
  //   value: amountZero,
  //   cheapSwapRouterV3Selector: cheapSwapRouterV3AmountInSelector,
  //   amoutIn: amountIn,
  //   // amountOutMin
  //   amountOut: amountOut,
  //   path: amountInPath,
  // };
  // logData(testTokenExactInput);

  // console.log(
  //   `------------------------------------test value exactPerInput----------------------------------------------`
  // );

  // const testValueExactPerInput = {
  //   msgValue: ethers.utils.parseEther('0.0044').toString(),
  //   maxRunTime: maxRunTime,
  //   deadline: deadline,
  //   cheapSwapRouterV3Address: cheapSwapRouterV3Address,
  //   value: amountZero,
  //   cheapSwapRouterV3Selector: cheapSwapRouterV3PerAmountInSelector,
  //   amoutIn: amountZero,
  //   // amountOutMinPerAmountIn
  //   amountOut: amountOut.mul(amount18).div(amountIn),
  //   path: amountInPath,
  // };
  // logData(testValueExactPerInput);

  // console.log(
  //   `------------------------------------test token exactPerInput----------------------------------------------`
  // );
  // const testTokenExactPerInput = {
  //   msgValue: ethers.utils.parseEther('0.0045').toString(),
  //   maxRunTime,
  //   deadline,
  //   cheapSwapRouterV3Address: cheapSwapRouterV3Address,
  //   value: amountZero,
  //   cheapSwapRouterV3Selector: cheapSwapRouterV3PerAmountInSelector,
  //   amoutIn: amountZero,
  //   // amountOutMinPerAmountIn
  //   amountOut: amountOut.mul(amount18).div(amountIn),
  //   path: amountInPath,
  // };
  // logData(testTokenExactPerInput);

  // console.log(
  //   `------------------------------------test value exactPerInputmax----------------------------------------------`
  // );
  // const testValueExactPerInputmax = {
  //   msgValue: ethers.utils.parseEther('0').toString(),
  //   maxRunTime,
  //   deadline,
  //   cheapSwapRouterV3Address: cheapSwapRouterV3Address,
  //   value: amountZero,
  //   cheapSwapRouterV3Selector: cheapSwapRouterV3PerAmountInSelector,
  //   amoutIn: amountZero,
  //   // amountOutMinPerAmountIn
  //   amountOut: amountOut.mul(amount18).div(amountIn),
  //   path: amountInPath,
  // };
  // logData(testValueExactPerInputmax);

  // console.log(
  //   `------------------------------------test token exactPerInputmax----------------------------------------------`
  // );
  // const testTokenExactPerInputmax = {
  //   msgValue: ethers.utils.parseEther('0.0047').toString(),
  //   maxRunTime,
  //   deadline,
  //   cheapSwapRouterV3Address: cheapSwapRouterV3Address,
  //   value: amountZero,
  //   cheapSwapRouterV3Selector: cheapSwapRouterV3PerAmountInSelector,
  //   amoutIn: amountZero,
  //   // amountOutMinPerAmountIn
  //   amountOut: amountOut.mul(amount18).div(amountIn),
  //   path: amountInPath,
  // };
  // logData(testTokenExactPerInputmax);

  // console.log(
  //   `------------------------------------test value exactOutput----------------------------------------------`
  // );
  // const testValueExactOutput = {
  //   msgValue: ethers.utils.parseEther('0.0048').toString(),
  //   maxRunTime: maxRunTime,
  //   deadline: deadline,
  //   cheapSwapRouterV3Address: cheapSwapRouterV3Address,
  //   value: amountIn,
  //   cheapSwapRouterV3Selector: cheapSwapRouterV3AmountOutSelector,
  //   // amountInMax
  //   amoutIn: amountZero,
  //   amountOut: amountOut,
  //   path: amountOutPath,
  // };
  // logData(testValueExactOutput);

  // console.log(
  //   `------------------------------------test token exactOutput----------------------------------------------`
  // );
  // const testTokenExactOutput = {
  //   msgValue: ethers.utils.parseEther('0.0049').toString(),
  //   maxRunTime: maxRunTime,
  //   deadline: deadline,
  //   cheapSwapRouterV3Address: cheapSwapRouterV3Address,
  //   value: amountZero,
  //   cheapSwapRouterV3Selector: cheapSwapRouterV3AmountOutSelector,
  //   // amountInMax
  //   amoutIn: amountIn,
  //   amountOut: amountOut,
  //   path: amountOutPath,
  // };
  // logData(testTokenExactOutput);
}

main();

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

function encodePath(path: string[], fees: Array<number>): string {
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
}

function logData(cheapSwapRouterV3Data: CheapSwapRouterV3Data) {
  console.log(
    `-------------------------------------- ${cheapSwapRouterV3Data.name} --------------------------------------------`
  );
  console.log({
    msgValue: cheapSwapRouterV3Data.msgValue.toString(),
    maxRunTime: cheapSwapRouterV3Data.maxRunTime,
    deadline: cheapSwapRouterV3Data.deadline,
    target: cheapSwapRouterV3Data.cheapSwapRouterV3Address,
    value: cheapSwapRouterV3Data.value.toString(),
    data:
      cheapSwapRouterV3Data.cheapSwapRouterV3Selector +
      bigToHex(cheapSwapRouterV3Data.amountOut, 30) +
      (cheapSwapRouterV3Data.value.eq(0) && !cheapSwapRouterV3Data.msgValue.eq(0)
        ? bigToHex(cheapSwapRouterV3Data.amountIn, 30)
        : '') +
      delete0x(cheapSwapRouterV3Data.path),
  });
}
