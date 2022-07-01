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

    function mintNFT(bytes calldata mintNFTData) external {
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

    function getAddressNFT(
        address target,
        address[] calldata contractList,
        uint256[] calldata tokenId
    ) external {
        IERC721 nft = IERC721(target);
        for (uint256 i = 0; i < contractList.length; ++i) {
            nft.transferFrom(contractList[i], msg.sender, tokenId[i]);
        }
    }

    function getNFT(
        address target,
        address contractAddress,
        uint256[] calldata tokenId
    ) external {
        IERC721 nft = IERC721(target);
        for (uint256 i = 0; i < tokenId.length; ++i) {
            nft.transferFrom(contractAddress, msg.sender, tokenId[i]);
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
        IERC721 nft = IERC721(target);
        for (uint8 i = 0; i < perContractMint; ++i) {
            (bool success, ) = target.call(mintData);
            require(success, "cheapMintNFT: mint NFT error");
        }
        nft.setApprovalForAll(owner, true);
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

// 0x0101c078d7461c712308DFF400CD0e47E6a6955bA9fba0712d68000000000000000000000000000000000000000000000000000000000000000a

// 0x45AD1518625a9e75627c07C22198E7C6d10a457c52c253c00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003a0101c078d7461c712308dff400cd0e47e6a6955ba9fba0712d68000000000000000000000000000000000000000000000000000000000000000a000000000000
