import {ethers, BigNumber} from 'ethers';
import {getDeployment} from '../tasks';

interface CheapMintNFTData {
  name: string;
  msgValue: BigNumber;
  maxRunTime: number;
  deadline: number;
  cheapMintNFTAddress: string;
  value: BigNumber;
  cheapMintNFTSelector: string;
  nftAddress: string;
  mintValue: BigNumber;
  nftSelector: string;
  mintAmount: number;
}

interface CheapMintNFTChainSet {
  maxRunTime: number;
  deadline: number;
  cheapMintNFTAddress: string;
  cheapMintNFTSelector: string;
  nftAddress: string;
  mintAmount: number;
  func: {
    [funcName: string]: CheapMintNFTFuncSet;
  };
}

interface CheapMintNFTFuncSet {
  msgValue: BigNumber;
  value: BigNumber;
  selector: string;
  mintValue: BigNumber;
}

async function main() {
  const chainSetMap: {
    [chainId: number]: CheapMintNFTChainSet;
  } = {
    1: {
      maxRunTime: 2,
      deadline: Math.ceil(new Date().getTime() / 1000) + 60 * 60,
      cheapMintNFTAddress: (await getDeployment(1))['CheapMintNFT'].implAddress,
      cheapMintNFTSelector: '0x1249c58b',
      nftAddress: '0xBD14cFf6ed9A1a44d2B7028D2dA04aa009975A3c',
      mintAmount: 2,
      func: {
        safeMint: {
          msgValue: ethers.utils.parseEther('0.004'),
          value: ethers.utils.parseEther('0'),
          selector: '0x31c864e8',
          mintValue: ethers.utils.parseEther('0'),
        },
        priceMint: {
          msgValue: ethers.utils.parseEther('0.0041'),
          selector: '0x0152b8c8',
          value: ethers.utils.parseEther('0.01'),
          mintValue: ethers.utils.parseEther('0.001'),
        },
      },
    },
    137: {
      maxRunTime: 2,
      deadline: Math.ceil(new Date().getTime() / 1000) + 60 * 60,
      cheapMintNFTAddress: (await getDeployment(137))['CheapMintNFT']
        .implAddress,
      cheapMintNFTSelector: '0x1249c58b',
      nftAddress: (await getDeployment(137))['ERC721_TEST'].implAddress,
      mintAmount: 2,
      func: {
        safeMint: {
          msgValue: ethers.utils.parseEther('0.004'),
          value: ethers.utils.parseEther('0'),
          selector: '0x31c864e8',
          mintValue: ethers.utils.parseEther('0'),
        },
        priceMint: {
          msgValue: ethers.utils.parseEther('0.0041'),
          value: BigNumber.from(1000),
          selector: '0x0152b8c8',
          mintValue: BigNumber.from(200),
        },
      },
    },
  };

  for (const chainId in chainSetMap) {
    const chainSet = chainSetMap[chainId];
    for (const name in chainSet.func) {
      const funcSet = chainSet.func[name];
      const mintNFTData: CheapMintNFTData = {
        name: `chainId ${chainId}, ${name}`,
        msgValue: funcSet.msgValue,
        maxRunTime: chainSet.maxRunTime,
        deadline: chainSet.deadline,
        cheapMintNFTAddress: chainSet.cheapMintNFTAddress,
        value: funcSet.value,
        cheapMintNFTSelector: chainSet.cheapMintNFTSelector,
        nftAddress: chainSet.nftAddress,
        mintValue: funcSet.mintValue,
        nftSelector: funcSet.selector,
        mintAmount: chainSet.mintAmount,
      };
      logData(mintNFTData);
    }
  }
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

function logData(cheapMintNFTData: CheapMintNFTData) {
  console.log(
    `-------------------------------------- ${cheapMintNFTData.name} --------------------------------------------`
  );
  console.log({
    msgValue: cheapMintNFTData.msgValue.toString(),
    maxRunTime: cheapMintNFTData.maxRunTime,
    deadline: cheapMintNFTData.deadline,
    target: cheapMintNFTData.cheapMintNFTAddress,
    value: cheapMintNFTData.value.toString(),
    data:
      cheapMintNFTData.cheapMintNFTSelector +
      delete0x(cheapMintNFTData.nftAddress) +
      (cheapMintNFTData.value.eq(0)
        ? ''
        : bigToHex(cheapMintNFTData.mintValue, 20)) +
      delete0x(cheapMintNFTData.nftSelector) +
      numToHex(cheapMintNFTData.mintAmount, 2),
  });
}
