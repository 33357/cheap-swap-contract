import { utils } from 'ethers';
import * as taskUtils from '../tasks/utils'

async function main() {
  const ethAmount = utils.parseEther('0.0042').toString();
  const deploymentMain = await taskUtils.getDeployment(1);

  const mintNFTAddress = deploymentMain['CheapMintNFT'].implAddress;
  const mintNFTSelector = '0x1249c58b';
  const mintAmount = 1;
  const nftAddress = '0xE94441705cEA3876908E9eDD9BcC67D12d77eF28';
  const nftSelector = '0xa0712d68';
  const cheapMintNFTCode =
    mintNFTSelector +
    toHex(mintAmount, 2) +
    delete0x(nftAddress) +
    delete0x(nftSelector);
  const cheapSwapAddressCode = mintNFTAddress + delete0x(cheapMintNFTCode);
  console.log({ cheapMintNFTCode, cheapSwapAddressCode, ethAmount });

  const deploymentTest = await taskUtils.getDeployment(97);

  const mintNFTAddressTest = deploymentTest['CheapMintNFT'].implAddress;
  const mintNFTSelectorTest = '0x1249c58b';
  const mintAmountTest = 1;
  const nftAddressTest = deploymentTest['ERC721_TEST'].implAddress;
  const nftSelectorTest = '0x31c864e8';
  const cheapMintNFTCodeTest =
    mintNFTSelectorTest +
    toHex(mintAmountTest, 2) +
    delete0x(nftAddressTest) +
    delete0x(nftSelectorTest);
  const cheapSwapAddressCodeTest = mintNFTAddressTest + delete0x(cheapMintNFTCodeTest);
  console.log({ cheapMintNFTCodeTest, cheapSwapAddressCodeTest, ethAmount });
}

main();

function toHex(num: number, fixed: number) {
  let hex = num.toString(16);
  while (hex.length < fixed) {
    hex = '0' + hex;
  }
  return hex;
}

function delete0x(str: string) {
  return str.replace('0x', '');
}
