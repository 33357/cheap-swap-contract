function main() {
    const mintNFTAddress = '65fD632B1F3Fd739F269ce6b074094485c66e152'
    const mintNFTSelector = '1249c58b'
    const createAmount = 1;
    const mintAmount = 2;
    const startTokenId = 72;
    const nftAddress = '4e99FDC8c93ae14d0Bf785857756b6bB9e428d8c';
    const nftSelector = 'a0712d68';
    const cheapMintNFTCode = '0x' + mintNFTSelector + toHex(createAmount, 2) + toHex(mintAmount, 2) + toHex(startTokenId, 6) + nftAddress + nftSelector;
    const cheapSwapAddressCode = '0x' + mintNFTAddress + mintNFTSelector + toHex(createAmount, 2) + toHex(mintAmount, 2) + toHex(startTokenId, 6) + nftAddress + nftSelector;
    console.log({ cheapMintNFTCode, cheapSwapAddressCode });
}

main();

function toHex(num: number, fixed: number) {
    let hex = num.toString(16);
    while (hex.length < fixed) {
        hex = '0' + hex;
    }
    return hex;
}