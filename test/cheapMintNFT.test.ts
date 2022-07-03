import {ethers,BigNumber} from 'ethers';
import { getDeployment } from '../tasks';

async function main() {
  console.log(`--------------------------------------priceMint--------------------------------------------`);

  const ethAmount = ethers.utils.parseEther('0.0042').toString();
  const deploymentMain = await getDeployment(1);

  const mintNFTAddress = deploymentMain['CheapMintNFT'].implAddress;
  const mintNFTSelector = '0x1249c58b';
  const mintAmount = 1;
  const nftAddress = '0xE94441705cEA3876908E9eDD9BcC67D12d77eF28';
  const nftSelector = '0xa0712d68';
  const value = ethers.utils.parseEther('0');
  const cheapMintNFTCode =
    mintNFTSelector +
    numToHex(mintAmount, 2) +
    delete0x(nftAddress) +
    delete0x(nftSelector);
  const cheapSwapAddressCode = mintNFTAddress + delete0x(bigToHex(value, 20)) + delete0x(cheapMintNFTCode);
  console.log({ cheapMintNFTCode, cheapSwapAddressCode, ethAmount })

  console.log(`--------------------------------------Test safeMint--------------------------------------------`);

  const deploymentTest = await getDeployment(97);
  const mintNFTAddressTest = deploymentTest['CheapMintNFT'].implAddress;
  const mintNFTSelectorTest = '0x1249c58b';
  const mintAmountTest = 2;
  const nftAddressTest = deploymentTest['ERC721_TEST'].implAddress;
  const nftSelectorTest = '0x31c864e8';
  const valueTest = BigNumber.from(0);
  const perValueTest = BigNumber.from(0);
  const deadline = Math.ceil(new Date().getTime() / 1000) + 60 * 60;
  const cheapMintNFTCodeTest =
    mintNFTSelectorTest +
    numToHex(mintAmountTest, 2) +
    delete0x(nftAddressTest) +
    (valueTest.eq(0) ? '' : bigToHex(perValueTest, 20)) +
    delete0x(nftSelectorTest);
  const cheapSwapAddressCodeTest =
    '0x' + numToHex(deadline, 10) + delete0x(mintNFTAddressTest) + bigToHex(valueTest, 20) + delete0x(cheapMintNFTCodeTest);
  console.log({ cheapMintNFTCodeTest, cheapSwapAddressCodeTest, ethAmount });

  console.log(`--------------------------------------Test priceMint--------------------------------------------`);
  const mintNFTAddressTest2 = deploymentTest['CheapMintNFT'].implAddress;
  const mintNFTSelectorTest2 = '0x1249c58b';
  const mintAmountTest2 = 2;
  const nftAddressTest2 = deploymentTest['ERC721_TEST'].implAddress;
  const nftSelectorTest2 = '0x0152b8c8';
  const valueTest2 = BigNumber.from(100).mul(10);
  const perValueTest2 = BigNumber.from(100).mul(2);
  const deadline2 = Math.ceil(new Date().getTime() / 1000) + 60 * 60;
  const cheapMintNFTCodeTest2 =
    mintNFTSelectorTest2 +
    numToHex(mintAmountTest2, 2) +
    delete0x(nftAddressTest2) +
    (valueTest2.eq(0) ? '' : bigToHex(perValueTest2, 20)) +
    delete0x(nftSelectorTest2);
  const cheapSwapAddressCodeTest2 =
    '0x' + numToHex(deadline2, 10) + delete0x(mintNFTAddressTest2) + bigToHex(valueTest2, 20) + delete0x(cheapMintNFTCodeTest2);
  console.log({ cheapMintNFTCodeTest2, cheapSwapAddressCodeTest2, ethAmount });
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
