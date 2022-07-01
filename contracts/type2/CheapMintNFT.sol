//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "../lib/CheapMintNFTBytesLib.sol";
import "./interfaces/ICheapSwapAddress.sol";
import "./interfaces/ICheapMintNFT.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract CheapMintNFT is ICheapMintNFT {
    using CheapMintNFTBytesLib for bytes;

    mapping(address => address) public mintNFTOwner;

    constructor() {}

    /* ================ TRANSACTION FUNCTIONS ================ */

    function mint(bytes calldata mintNFTData) external {
        uint8 total = mintNFTData.toUint8(0);
        uint8 perMint = mintNFTData.toUint8(1);
        uint24 startTokenId = mintNFTData.toUint24(2);
        address target = mintNFTData.toAddress(5);
        address owner = msg.sender;
        if (msg.sender != tx.origin) {
            ICheapSwapAddress cheapSwapAddress = ICheapSwapAddress(msg.sender);
            owner = cheapSwapAddress.owner();
        }
        for (uint8 i = 0; i < total; i++) {
            address mintNFT = address(
                new MintNFT(perMint, startTokenId, owner, target, mintNFTData.slice(22, mintNFTData.length - 22))
            );
            mintNFTOwner[mintNFT] = owner;
            emit MintNFTCreated(owner, mintNFT);
        }
    }

    function getNFTFromContractList(
        address target,
        address[] calldata contractList,
        uint256[] calldata tokenId
    ) external {
        IERC721 nft = IERC721(target);
        for (uint256 i = 0; i < contractList.length; ++i) {
            require(mintNFTOwner[contractList[i]] == msg.sender, "CheapMintNFT: not owner");
            nft.transferFrom(contractList[i], msg.sender, tokenId[i]);
        }
    }

    function getNFTFromTokenIdList(
        address target,
        address contractAddress,
        uint256[] calldata tokenId
    ) external {
        IERC721 nft = IERC721(target);
        for (uint256 i = 0; i < tokenId.length; ++i) {
            require(mintNFTOwner[contractAddress] == msg.sender, "CheapMintNFT: not owner");
            nft.transferFrom(contractAddress, msg.sender, tokenId[i]);
        }
    }
}

contract MintNFT {
    constructor(
        uint256 perMint,
        uint256 startTokenId,
        address owner,
        address target,
        bytes memory mintData
    ) {
        IERC721 nft = IERC721(target);
        for (uint8 i = 0; i < perMint; ++i) {
            (bool success, ) = target.call(mintData);
            require(success, "cheapMintNFT: mint NFT error");
        }
        while (true) {
            if (nft.ownerOf(startTokenId) == address(this)) {
                nft.transferFrom(address(this), owner, startTokenId);
            } else if (nft.ownerOf(startTokenId) == address(0)) {
                break;
            }
            ++startTokenId;
        }
        nft.setApprovalForAll(msg.sender, true);
        selfdestruct(payable(msg.sender));
    }
}
