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
      WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
    },
    137: {
      WETH: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
    }
  }
  const path: { [chainId: number]: { amountIn: string, amountOut: string } } = {
    1: {
      amountIn: encodePath([tokenMap[1].WETH, tokenMap[1].USDT], [500]),
      amountOut: encodePath([tokenMap[1].USDT, tokenMap[1].WETH], [500]),
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
    1: {
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
