//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "./lib/CheapMintNFTBytesLib.sol";
import "./interfaces/ICheapMintNFT.sol";
import "./interfaces/ICheapSwapAddress.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract CheapMintNFT is ICheapMintNFT {
    using CheapMintNFTBytesLib for bytes;

    constructor() {}

    /* ================ TRANSACTION FUNCTIONS ================ */

    function mint() external override {
        unchecked {
            uint256 mintAmount = uint256(msg.data.toUint8(4));
            address target = msg.data.toAddress(5);
            address owner = msg.sender;
            if (msg.sender != tx.origin) {
                ICheapSwapAddress cheapSwapAddress = ICheapSwapAddress(msg.sender);
                owner = cheapSwapAddress.owner();
            }
            bytes memory mintData = msg.data.slice(25, msg.data.length - 25);
            (bool success, bytes memory returnData) = target.call(abi.encodePacked(mintData, mintAmount));
            require(!success, "CheapMintNFT: can not get startTokenId");
            uint256 startTokenId = returnData.toUint256(returnData.length - 32);
            uint256 thisGas = gasleft();
            uint256 beforeGas = thisGas;
            uint256 useGas;
            while (thisGas >= useGas) {
                beforeGas = thisGas;
                new MintNFT(mintAmount, startTokenId, owner, target, mintData);
                startTokenId += mintAmount;
                thisGas = gasleft();
                useGas = beforeGas - thisGas;
            }
        }
    }

    function onERC721Received(
        address,
        address,
        uint256 tokenId,
        bytes calldata
    ) external override pure returns (bytes4) {
        revert(string(abi.encode(tokenId)));
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
        unchecked {
            (bool success, ) = target.call(abi.encodePacked(mintData, mintAmount));
            require(success, "cheapMintNFT: mint NFT error");
            IERC721 nft = IERC721(target);
            uint256 maxTokenId = startTokenId + mintAmount;
            for (; startTokenId < maxTokenId; ++startTokenId) {
                nft.transferFrom(address(this), owner, startTokenId);
            }
            selfdestruct(payable(msg.sender));
        }
    }
}
