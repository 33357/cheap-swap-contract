function main() {
    const mintNFTAddress = '0x65fD632B1F3Fd739F269ce6b074094485c66e152'
    const mintNFTSelector = '0x1249c58b'
    const createAmount = 1;
    const mintAmount = 2;
    const startTokenId = 72;
    const nftAddress = '0x4e99FDC8c93ae14d0Bf785857756b6bB9e428d8c';
    const nftSelector = '0xa0712d68';
    const cheapMintNFTCode = mintNFTSelector + toHex(createAmount, 2) + toHex(mintAmount, 2) + toHex(startTokenId, 6) + delete0x(nftAddress) + delete0x(nftSelector);
    const cheapSwapAddressCode = mintNFTAddress + delete0x(cheapMintNFTCode);
    console.log({ cheapMintNFTCode, cheapSwapAddressCode });

    const _mintNFTAddress = '0x2B65A39B3a91e5E209000dF9ABA52C0E6b1606E6'
    const _mintNFTSelector = '0x1249c58b'
    const _createAmount = 1;
    const _mintAmount = 1;
    const _startTokenId = 10;
    const _nftAddress = '0xD524313285c11C150e4B762f2adFE54D4Bf7d429';
    const _nftSelector = '0x6871ee40';
    const _cheapMintNFTCode = _mintNFTSelector + toHex(_createAmount, 2) + toHex(_mintAmount, 2) + toHex(_startTokenId, 6) + delete0x(_nftAddress) + delete0x(_nftSelector);
    const _cheapSwapAddressCode = _mintNFTAddress + delete0x(_cheapMintNFTCode);
    console.log({ _cheapMintNFTCode, _cheapSwapAddressCode });
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