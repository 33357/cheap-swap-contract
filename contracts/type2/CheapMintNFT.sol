//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "../lib/CheapMintNFTBytesLib.sol";
import "./interfaces/ICheapSwapAddress.sol";
import "./interfaces/ICheapMintNFT.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract CheapMintNFT is ICheapMintNFT {
    using CheapMintNFTBytesLib for bytes;

    mapping(address => address) public mintNFTContractOwner;

    constructor() {}

    /* ================ TRANSACTION FUNCTIONS ================ */

    function mintNFT(bytes calldata mintNFTData) external {
        uint8 perContractMint = mintNFTData.toUint8(0);
        uint8 totalContract = mintNFTData.toUint8(1);
        address target = mintNFTData.toAddress(2);
        address owner = msg.sender;
        if (msg.sender != tx.origin) {
            ICheapSwapAddress cheapSwapAddress = ICheapSwapAddress(msg.sender);
            owner = cheapSwapAddress.owner();
        }
        for (uint8 i = 0; i < totalContract; i++) {
            address mintNFTContract = address(
                new MintNFTContract(perContractMint, target, owner, mintNFTData.slice(22, mintNFTData.length - 22))
            );
            mintNFTContractOwner[mintNFTContract] = owner;
            emit MintNFTContractCreated(owner, mintNFTContract);
        }
    }

    function getNFTFromContractList(
        address target,
        address[] calldata contractList,
        uint256[] calldata tokenId
    ) external {
        IERC721 nft = IERC721(target);
        for (uint256 i = 0; i < contractList.length; ++i) {
            require(mintNFTContractOwner[contractList[i]] == msg.sender, "CheapMintNFT: not owner");
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
            require(mintNFTContractOwner[contractAddress] == msg.sender, "CheapMintNFT: not owner");
            nft.transferFrom(contractAddress, msg.sender, tokenId[i]);
        }
    }
}

contract MintNFTContract is IERC721Receiver {
    address owner;

    constructor(
        uint8 perContractMint,
        address target,
        address _owner,
        bytes memory mintData
    ) {
        owner = _owner;
        IERC721 nft = IERC721(target);
        for (uint8 i = 0; i < perContractMint; ++i) {
            (bool success, ) = target.call(mintData);
            require(success, "cheapMintNFT: mint NFT error");
        }
        nft.setApprovalForAll(msg.sender, true);
        selfdestruct(payable(msg.sender));
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        IERC721(msg.sender).safeTransferFrom(address(this), owner, tokenId);
        return this.onERC721Received.selector;
    }
}