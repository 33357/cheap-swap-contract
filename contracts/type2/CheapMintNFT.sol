//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "../lib/CheapMintNFTBytesLib.sol";
import "./interfaces/ICheapSwapAddress.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract CheapMintNFT {
    using CheapMintNFTBytesLib for bytes;

    constructor() {}

    /* ================ TRANSACTION FUNCTIONS ================ */

    function mintNFT(bytes calldata mintNFTData) public {
        uint8 perContractMint = mintNFTData.toUint8(0);
        uint8 totalContract = mintNFTData.toUint8(1);
        address target = mintNFTData.toAddress(2);
        ICheapSwapAddress cheapSwapAddress = ICheapSwapAddress(msg.sender);
        for (uint8 i = 0; i < totalContract; i++) {
            new MintNFT(
                perContractMint,
                target,
                cheapSwapAddress.owner(),
                mintNFTData.slice(22, mintNFTData.length - 22)
            );
        }
    }
}

contract MintNFT is IERC721Receiver {
    address owner;

    constructor(
        uint8 perContractMint,
        address target,
        address _owner,
        bytes memory mintData
    ) {
        owner = _owner;
        for (uint8 i = 0; i < perContractMint; i++) {
            (bool success, ) = target.call(mintData);
            require(success, "cheapMintNFT: mint NFT error");
        }
        selfdestruct(payable(msg.sender));
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        IERC721(msg.sender).transferFrom(address(this), owner, tokenId);
        return IERC721Receiver.onERC721Received.selector;
    }
}
