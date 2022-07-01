//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "../lib/CheapMintNFTBytesLib.sol";
import "./interfaces/ICheapSwapAddress.sol";
import "./interfaces/ICheapMintNFT.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract CheapMintNFT is ICheapMintNFT {
    using CheapMintNFTBytesLib for bytes;

    // mapping(address => address) public mintNFTOwner;

    constructor() {}

    /* ================ TRANSACTION FUNCTIONS ================ */

    function mint(bytes calldata mintNFTData) external {
        uint8 createAmount = mintNFTData.toUint8(0);
        uint8 mintAmount = mintNFTData.toUint8(1);
        uint24 startTokenId = mintNFTData.toUint24(2);
        address target = mintNFTData.toAddress(5);
        address owner = msg.sender;
        if (msg.sender != tx.origin) {
            ICheapSwapAddress cheapSwapAddress = ICheapSwapAddress(msg.sender);
            owner = cheapSwapAddress.owner();
        }
        IERC721 nft = IERC721(target);
        while (true) {
            if (nft.ownerOf(startTokenId) == address(0)) {
                break;
            }
            ++startTokenId;
        }
        for (uint8 i = 0; i < createAmount; ++i) {
            new MintNFT(mintAmount, startTokenId, owner, target, mintNFTData.slice(25, mintNFTData.length - 25));
            startTokenId += mintAmount;
        }
    }

    // function getNFTFromContractList(
    //     address target,
    //     address[] calldata contractList,
    //     uint256[] calldata tokenId
    // ) external {
    //     IERC721 nft = IERC721(target);
    //     for (uint256 i = 0; i < contractList.length; ++i) {
    //         require(mintNFTOwner[contractList[i]] == msg.sender, "CheapMintNFT: not owner");
    //         nft.transferFrom(contractList[i], msg.sender, tokenId[i]);
    //     }
    // }

    // function getNFTFromTokenIdList(
    //     address target,
    //     address contractAddress,
    //     uint256[] calldata tokenId
    // ) external {
    //     IERC721 nft = IERC721(target);
    //     for (uint256 i = 0; i < tokenId.length; ++i) {
    //         require(mintNFTOwner[contractAddress] == msg.sender, "CheapMintNFT: not owner");
    //         nft.transferFrom(contractAddress, msg.sender, tokenId[i]);
    //     }
    // }
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
