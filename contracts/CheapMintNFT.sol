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

    function mint() external payable override {
        unchecked {
            bool isValue;
            if (msg.value > 0) {
                isValue = true;
            }
            uint256 mintAmount = msg.data.toUint8(4);
            address target = msg.data.toAddress(5);
            address owner = msg.sender;
            if (msg.sender != tx.origin) {
                ICheapSwapAddress cheapSwapAddress = ICheapSwapAddress(msg.sender);
                owner = cheapSwapAddress.owner();
            }
            bytes memory mintData;
            uint256 value;
            if (isValue) {
                value = msg.data.toUint80(25);
                mintData = msg.data.slice(35, msg.data.length - 35);
            } else {
                mintData = msg.data.slice(25, msg.data.length - 25);
            }
            (bool success, bytes memory returnData) = target.call{value: value}(abi.encodePacked(mintData, mintAmount));
            require(!success, "CheapMintNFT: can not get startTokenId");
            uint256 startTokenId = returnData.toUint256(returnData.length - 32);
            uint256 thisGas = gasleft();
            uint256 beforeGas = thisGas;
            uint256 useGas;
            while (thisGas >= useGas) {
                beforeGas = thisGas;
                if (isValue) {
                    if (address(this).balance < value) {
                        payable(owner).transfer(address(this).balance);
                        break;
                    }
                    bytes32 salt = keccak256(abi.encodePacked(owner, target, value, mintData, mintAmount));
                    payable(calculateAddr(salt)).transfer(value);
                    new MintNFT{salt: salt}(mintAmount, startTokenId, owner, target, mintData);
                } else {
                    new MintNFT(mintAmount, startTokenId, owner, target, mintData);
                }
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
    ) external pure override returns (bytes4) {
        revert(string(abi.encode(tokenId)));
    }

    function calculateAddr(bytes32 salt) public view override returns (address predictedAddress) {
        predictedAddress = address(
            uint160(
                uint256(
                    keccak256(
                        abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(type(MintNFT).creationCode))
                    )
                )
            )
        );
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
            (bool success, ) = target.call{value: address(this).balance}(abi.encodePacked(mintData, mintAmount));
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
