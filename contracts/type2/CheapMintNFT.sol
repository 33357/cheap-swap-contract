//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "../lib/CheapMintNFTBytesLib.sol";
import "./interfaces/ICheapSwapAddress.sol";
import "./interfaces/ICheapMintNFT.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract CheapMintNFT is ICheapMintNFT {
    using CheapMintNFTBytesLib for bytes;

    mapping(address => address) public mintNFTOwner;

    constructor() {}

    /* ================ TRANSACTION FUNCTIONS ================ */

    function mint(bytes calldata mintNFTData) external {
        uint8 perMint = mintNFTData.toUint8(0);
        uint8 total = mintNFTData.toUint8(1);
        address target = mintNFTData.toAddress(2);
        address owner = msg.sender;
        if (msg.sender != tx.origin) {
            ICheapSwapAddress cheapSwapAddress = ICheapSwapAddress(msg.sender);
            owner = cheapSwapAddress.owner();
        }
        for (uint8 i = 0; i < total; i++) {
            MintNFT mintNFT = new MintNFT();
            mintNFT.mint(perMint, target, owner, mintNFTData.slice(22, mintNFTData.length - 22));
            mintNFTOwner[address(mintNFT)] = owner;
            emit MintNFTCreated(owner, address(mintNFT));
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

contract MintNFT is IERC721Receiver {
    address owner;

    constructor() {}

    function mint(
        uint8 perMint,
        address target,
        address _owner,
        bytes memory mintData
    ) external {
        owner = _owner;
        IERC721 nft = IERC721(target);
        for (uint8 i = 0; i < perMint; ++i) {
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
