//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "../lib/CheapMintNFTBytesLib.sol";
import "./interfaces/ICheapSwapAddress.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract CheapMintNFT2 {
    using CheapMintNFTBytesLib for bytes;

    constructor() {}

    /* ================ TRANSACTION FUNCTIONS ================ */

    function mint() external {
        uint8 createAmount = msg.data.toUint8(0);
        uint8 mintAmount = msg.data.toUint8(1);
        uint24 startTokenId = msg.data.toUint24(2);
        address target = msg.data.toAddress(5);
        address owner = msg.sender;
        if (msg.sender != tx.origin) {
            ICheapSwapAddress cheapSwapAddress = ICheapSwapAddress(msg.sender);
            owner = cheapSwapAddress.owner();
        }
        IERC721 nft = IERC721(target);
        while (true) {
            try nft.ownerOf(startTokenId) returns (address) {
                ++startTokenId;
            } catch (bytes memory) {
                break;
            }
        }
        for (uint8 i = 0; i < createAmount; ++i) {
            new MintNFT(mintAmount, startTokenId, owner, target, msg.data.slice(25, msg.data.length - 25));
            startTokenId += mintAmount;
        }
    }
}

contract MintNFT {
    constructor(
        uint256 mintAmount,
        uint256 startTokenId,
        address owner,
        address target,
        bytes memory mintData
    ) {
        (bool success, ) = target.call(mintData);
        require(success, "cheapMintNFT: mint NFT error");
        IERC721 nft = IERC721(target);
        uint256 maxTokenId = startTokenId + mintAmount;
        for (; startTokenId < maxTokenId; ++startTokenId) {
            nft.transferFrom(address(this), owner, startTokenId);
        }
        selfdestruct(payable(msg.sender));
    }
}
