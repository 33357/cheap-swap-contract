import { ethers, BigNumber } from 'ethers';
import { getDeployment } from '../tasks';

async function main() {
  const chainSetMap: { [chainId: number]: any } = {
    1: {
      maxRunTime: 2,
      deadline: Math.ceil(new Date().getTime() / 1000) + 60 * 60,
      cheapMintNFTAddress: (await getDeployment(1))['CheapMintNFT'].implAddress,
      cheapMintNFTSelector: '0x1249c58b',
      nftAddress: '0xBD14cFf6ed9A1a44d2B7028D2dA04aa009975A3c',
      mintAmount: 2,
      func: {
        safeMint: {
          msgValue: ethers.utils.parseEther('0.004').toString(),
          value: ethers.utils.parseEther('0'),
          selector: '0x31c864e8',
          mintValue: ethers.utils.parseEther('0')
        },
        priceMint: {
          msgValue: ethers.utils.parseEther('0.0041').toString(),
          selector: '0x0152b8c8',
          value: ethers.utils.parseEther('0.01'),
          mintValue: ethers.utils.parseEther('0.001')
        }
      }
    },
    137: {
      maxRunTime: 2,
      deadline: Math.ceil(new Date().getTime() / 1000) + 60 * 60,
      cheapMintNFTAddress: (await getDeployment(137))['CheapMintNFT'].implAddress,
      cheapMintNFTSelector: '0x1249c58b',
      nftAddress: (await getDeployment(137))['ERC721_TEST'].implAddress,
      mintAmount: 2,
      func: {
        safeMint: {
          msgValue: ethers.utils.parseEther('0.004').toString(),
          value: ethers.utils.parseEther('0'),
          selector: '0x31c864e8',
          mintValue: ethers.utils.parseEther('0')
        },
        priceMint: {
          msgValue: ethers.utils.parseEther('0.0041').toString(),
          value: BigNumber.from(1000),
          selector: '0x0152b8c8',
          mintValue: BigNumber.from(200),
        }
      }
    }
  }

  for (const chainId in chainSetMap) {
    const chainSet = chainSetMap[chainId];
    for (const name in chainSet.func) {
      const funcSet = chainSet.func[name]
      logData({
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
      });
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

function logData(obj: any) {
  console.log(
    `-------------------------------------- ${obj.name} --------------------------------------------`
  );
  console.log({
    msgValue: obj.msgValue,
    maxRunTime: obj.maxRunTime,
    deadline: obj.deadline,
    target: obj.cheapMintNFTAddress,
    value: obj.value.toString(),
    data:
      obj.cheapMintNFTSelector +
      delete0x(obj.nftAddress) +
      (obj.value.eq(0) ? '' : bigToHex(obj.mintValue, 20)) +
      delete0x(obj.nftSelector) +
      numToHex(obj.mintAmount, 2),
  });
}
