import {ethers, BigNumber} from 'ethers';
import {getDeployment} from '../tasks';

async function main() {
  console.log(
    `--------------------------------------safeMint--------------------------------------------`
  );
  const deploymentMain = await getDeployment(1);
  const mainSafeMint = {
    msgValue: ethers.utils.parseEther('0.0042').toString(),
    maxRunTime: 1,
    deadline: Math.ceil(new Date().getTime() / 1000) + 60 * 60,
    cheapMintNFTAddress: deploymentMain['CheapMintNFT'].implAddress,
    value: ethers.utils.parseEther('0'),
    cheapMintNFTSelector: '0x1249c58b',
    nftAddress: '0xBD14cFf6ed9A1a44d2B7028D2dA04aa009975A3c',
    mintValue: ethers.utils.parseEther('0'),
    nftSelector: '0x31c864e8',
    mintAmount: 2,
  };
  logData(mainSafeMint);

  console.log(
    `--------------------------------------priceMint--------------------------------------------`
  );
  const mainPriceMint = {
    msgValue: ethers.utils.parseEther('0.0043').toString(),
    maxRunTime: 1,
    deadline: Math.ceil(new Date().getTime() / 1000) + 60 * 60,
    cheapMintNFTAddress: deploymentMain['CheapMintNFT'].implAddress,
    value: ethers.utils.parseEther('0.01'),
    cheapMintNFTSelector: '0x1249c58b',
    nftAddress: '0xBD14cFf6ed9A1a44d2B7028D2dA04aa009975A3c',
    mintValue: ethers.utils.parseEther('0.001'),
    nftSelector: '0x0152b8c8',
    mintAmount: 2,
  };
  logData(mainPriceMint);

  console.log(
    `--------------------------------------Test safeMint--------------------------------------------`
  );
  const deploymentTest = await getDeployment(137);
  const testSafeMint = {
    msgValue: ethers.utils.parseEther('0.0042').toString(),
    maxRunTime: 1,
    deadline: Math.ceil(new Date().getTime() / 1000) + 60 * 60,
    cheapMintNFTAddress: deploymentTest['CheapMintNFT'].implAddress,
    value: BigNumber.from(0),
    cheapMintNFTSelector: '0x1249c58b',
    nftAddress: deploymentTest['ERC721_TEST'].implAddress,
    mintValue: BigNumber.from(0),
    nftSelector: '0x31c864e8',
    mintAmount: 2,
  };
  logData(testSafeMint);

  console.log(
    `--------------------------------------Test priceMint--------------------------------------------`
  );
  const testPriceMint = {
    msgValue: ethers.utils.parseEther('0.0043').toString(),
    maxRunTime: 1,
    deadline: Math.ceil(new Date().getTime() / 1000) + 60 * 60,
    cheapMintNFTAddress: deploymentTest['CheapMintNFT'].implAddress,
    value: BigNumber.from(100).mul(10),
    cheapMintNFTSelector: '0x1249c58b',
    nftAddress: deploymentTest['ERC721_TEST'].implAddress,
    mintValue: BigNumber.from(100).mul(2),
    nftSelector: '0x0152b8c8',
    mintAmount: 2,
  };
  logData(testPriceMint);
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
