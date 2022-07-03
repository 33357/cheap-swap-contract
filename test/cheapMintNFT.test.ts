import { ethers, BigNumber } from 'ethers';
import { getDeployment } from '../tasks';

async function main() {
  console.log(
    `--------------------------------------safeMint--------------------------------------------`
  );
  const ethAmount = ethers.utils.parseEther('0.0042').toString();
  const deployment = await getDeployment(1);
  const mintNFTAddress = deployment['CheapMintNFT'].implAddress;
  const mintNFTSelector = '0x1249c58b';
  const mintAmount = 1;
  const nftAddress = '0xE94441705cEA3876908E9eDD9BcC67D12d77eF28';
  const nftSelector = '0xa0712d68';
  const value = ethers.utils.parseEther('0');
  const perValue = ethers.utils.parseEther('0');
  const deadline = Math.ceil(new Date().getTime() / 1000) + 60 * 60;
  let cheapMintNFTCode =
    mintNFTSelector +
    numToHex(mintAmount, 2) +
    delete0x(nftAddress) +
    (value.eq(0) ? '' : bigToHex(perValue, 20)) +
    delete0x(nftSelector);
  let cheapSwapAddressCode =
    '0x' +
    numToHex(deadline, 10) +
    mintNFTAddress +
    delete0x(bigToHex(value, 20)) +
    delete0x(cheapMintNFTCode);
  console.log({ cheapMintNFTCode, cheapSwapAddressCode, ethAmount });

  console.log(
    `--------------------------------------priceMint--------------------------------------------`
  );
  const ethAmount2 = ethers.utils.parseEther('0.0043').toString();
  const deployment2 = await getDeployment(1);
  const mintNFTAddress2 = deployment2['CheapMintNFT'].implAddress;
  const mintNFTSelector2 = '0x1249c58b';
  const mintAmount2 = 1;
  const nftAddress2 = '0xE94441705cEA3876908E9eDD9BcC67D12d77eF28';
  const nftSelector2 = '0xa0712d68';
  const value2 = ethers.utils.parseEther('0.01');
  const perValue2 = ethers.utils.parseEther('0.01');
  const deadline2 = Math.ceil(new Date().getTime() / 1000) + 60 * 60;
  const cheapMintNFTCode2 =
    mintNFTSelector2 +
    numToHex(mintAmount2, 2) +
    delete0x(nftAddress2) +
    (value2.eq(0) ? '' : bigToHex(perValue2, 20)) +
    delete0x(nftSelector2);
  const cheapSwapAddressCode2 =
    '0x' +
    numToHex(deadline2, 10) +
    mintNFTAddress2 +
    delete0x(bigToHex(value2, 20)) +
    delete0x(cheapMintNFTCode2);
  console.log({ cheapMintNFTCode2, cheapSwapAddressCode2, ethAmount2 });

  console.log(
    `--------------------------------------Test safeMint--------------------------------------------`
  );
  const ethAmountTest = ethers.utils.parseEther('0.0042').toString();
  const deploymentTest = await getDeployment(97);
  const mintNFTAddressTest = deploymentTest['CheapMintNFT'].implAddress;
  const mintNFTSelectorTest = '0x1249c58b';
  const mintAmountTest = 2;
  const nftAddressTest = deploymentTest['ERC721_TEST'].implAddress;
  const nftSelectorTest = '0x31c864e8';
  const valueTest = BigNumber.from(0);
  const perValueTest = BigNumber.from(0);
  const deadlineTest = Math.ceil(new Date().getTime() / 1000) + 60 * 60;
  const cheapMintNFTCodeTest =
    mintNFTSelectorTest +
    numToHex(mintAmountTest, 2) +
    delete0x(nftAddressTest) +
    (valueTest.eq(0) ? '' : bigToHex(perValueTest, 20)) +
    delete0x(nftSelectorTest);
  const cheapSwapAddressCodeTest =
    '0x' +
    numToHex(deadlineTest, 10) +
    delete0x(mintNFTAddressTest) +
    bigToHex(valueTest, 20) +
    delete0x(cheapMintNFTCodeTest);
  console.log({ cheapMintNFTCodeTest, cheapSwapAddressCodeTest, ethAmountTest });

  console.log(
    `--------------------------------------Test priceMint--------------------------------------------`
  );
  const test2 = {
    msgValue: ethers.utils.parseEther('0.0043').toString(),
    maxRunTime: 1,
    deadline: Math.ceil(new Date().getTime() / 1000) + 60 * 60,
    cheapMintNFTAddress: deploymentTest['CheapMintNFT'].implAddress,
    value: BigNumber.from(100).mul(10),
    cheapMintNFTSelector: '0x1249c58b',
    nftAddress: deploymentTest['ERC721_TEST'].implAddress,
    mintValue: BigNumber.from(100).mul(2),
    nftSelector: '0x0152b8c8',
    mintAmount: 2
  }
  let data =
    test2.cheapMintNFTSelector +
    delete0x(test2.nftAddress) +
    (test2.value.eq(0) ? '' : bigToHex(test2.mintValue, 20)) +
    delete0x(test2.nftSelector) +
    numToHex(test2.mintAmount, 2);

  console.log({
    cheapMintNFTCode,
    msgValue: test2.msgValue,
    maxRunTime: test2.maxRunTime,
    deadline: test2.deadline,
    target: test2.cheapMintNFTAddress,
    value: test2.value,
    data: data,
  });
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
