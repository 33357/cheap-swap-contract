import { ethers, BigNumber } from 'ethers';
import { getDeployment } from '../tasks';

async function main() {
  console.log(`--------------------------------------safeMint--------------------------------------------`);
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
  const cheapMintNFTCode =
    mintNFTSelector +
    numToHex(mintAmount, 2) +
    delete0x(nftAddress) +
    (value.eq(0) ? '' : bigToHex(perValue, 20)) +
    delete0x(nftSelector);
  const cheapSwapAddressCode = '0x' + numToHex(deadline, 10) + mintNFTAddress + delete0x(bigToHex(value, 20)) + delete0x(cheapMintNFTCode);
  console.log({ cheapMintNFTCode, cheapSwapAddressCode, ethAmount })

  console.log(`--------------------------------------priceMint--------------------------------------------`);
  const ethAmount2 = ethers.utils.parseEther('0.0042').toString();
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
  const cheapSwapAddressCode2 = '0x' + numToHex(deadline2, 10) + mintNFTAddress2 + delete0x(bigToHex(value2, 20)) + delete0x(cheapMintNFTCode2);
  console.log({ cheapMintNFTCode2, cheapSwapAddressCode2, ethAmount2 })

  console.log(`--------------------------------------Test safeMint--------------------------------------------`);
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
    '0x' + numToHex(deadlineTest, 10) + delete0x(mintNFTAddressTest) + bigToHex(valueTest, 20) + delete0x(cheapMintNFTCodeTest);
  console.log({ cheapMintNFTCodeTest, cheapSwapAddressCodeTest, ethAmountTest });

  console.log(`--------------------------------------Test priceMint--------------------------------------------`);
  const ethAmountTest2 = ethers.utils.parseEther('0.0042').toString();
  const mintNFTAddressTest2 = deploymentTest['CheapMintNFT'].implAddress;
  const mintNFTSelectorTest2 = '0x1249c58b';
  const mintAmountTest2 = 2;
  const nftAddressTest2 = deploymentTest['ERC721_TEST'].implAddress;
  const nftSelectorTest2 = '0x0152b8c8';
  const valueTest2 = BigNumber.from(100).mul(10);
  const perValueTest2 = BigNumber.from(100).mul(2);
  const deadlineTest2 = Math.ceil(new Date().getTime() / 1000) + 60 * 60;
  const cheapMintNFTCodeTest2 =
    mintNFTSelectorTest2 +
    numToHex(mintAmountTest2, 2) +
    delete0x(nftAddressTest2) +
    (valueTest2.eq(0) ? '' : bigToHex(perValueTest2, 20)) +
    delete0x(nftSelectorTest2);
  const cheapSwapAddressCodeTest2 =
    '0x' + numToHex(deadlineTest2, 10) + delete0x(mintNFTAddressTest2) + bigToHex(valueTest2, 20) + delete0x(cheapMintNFTCodeTest2);
  console.log({ cheapMintNFTCodeTest2, cheapSwapAddressCodeTest2, ethAmountTest2 });
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
