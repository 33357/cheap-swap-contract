import {utils} from 'ethers';

function main() {
  const ethAmount = utils.parseEther('0.0042').toString();

  const mintNFTAddress = '0x174dC5e369993bE60A16657F32E24380fc8A709F';
  const mintNFTSelector = '0x1249c58b';
  const createAmount = 1;
  const mintAmount = 3;
  const startTokenId = 1136;
  const nftAddress = '0xdf76646579172515e8C5831cfEa7fE2159b69Fbc';
  const nftSelector = '0xa0712d68';
  const cheapMintNFTCode =
    mintNFTSelector +
    toHex(createAmount, 2) +
    toHex(mintAmount, 2) +
    toHex(startTokenId, 6) +
    delete0x(nftAddress) +
    delete0x(nftSelector);
  const cheapSwapAddressCode = mintNFTAddress + delete0x(cheapMintNFTCode);
  console.log({cheapMintNFTCode, cheapSwapAddressCode, ethAmount});

  const _mintNFTAddress = '0xAB93961ad0c4d5EF38cDd838E623726b228FA9bC';
  const _mintNFTSelector = '0x1249c58b';
  const _mintAmount = 1;
  const _nftAddress = '0xD524313285c11C150e4B762f2adFE54D4Bf7d429';
  const _nftSelector = '0x6871ee40';
  const _cheapMintNFTCode =
    _mintNFTSelector +
    toHex(_mintAmount, 2) +
    delete0x(_nftAddress) +
    delete0x(_nftSelector);
  const _cheapSwapAddressCode = _mintNFTAddress + delete0x(_cheapMintNFTCode);
  console.log({_cheapMintNFTCode, _cheapSwapAddressCode, ethAmount});
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
