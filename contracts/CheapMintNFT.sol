//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "./lib/CheapMintNFTBytesLib.sol";
import "./interfaces/ICheapMintNFT.sol";
import "./interfaces/ICheapSwapAddress.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract CheapMintNFT is ICheapMintNFT {
    using CheapMintNFTBytesLib for bytes;

    constructor() {}

    /* =================== VIEW FUNCTIONS =================== */

    function getMintData(bytes calldata msgData, uint256 msgValue)
        public
        pure
        override
        returns (
            // 目标地址
            address target,
            // value
            uint80 value,
            // 选择器
            uint32 selector,
            // mint数量
            uint8 mintAmount
        )
    {
        target = msgData.toAddress(4);
        if (msgValue > 0) {
            value = msgData.toUint80(24);
            selector = msgData.toUint32(34);
            mintAmount = msgData.toUint8(38);
        } else {
            selector = msgData.toUint32(24);
            mintAmount = msgData.toUint8(28);
        }
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function mint() external payable override {
        unchecked {
            (address target, uint80 value, uint32 selector, uint8 mintAmount) = getMintData(msg.data, msg.value);
            // 兼容 msg.sender
            address owner = msg.sender;
            if (msg.sender != tx.origin) {
                ICheapSwapAddress cheapSwapAddress = ICheapSwapAddress(msg.sender);
                owner = cheapSwapAddress.owner();
            }
            // 模拟 mint，获取 startTokenId
            (bool success, bytes memory returnData) = target.call{value: value}(
                abi.encodePacked(selector, uint256(mintAmount))
            );
            require(!success, "CheapMintNFT: can not get startTokenId");
            uint256 startTokenId = returnData.toUint32(returnData.length - 32);
            uint256 thisGas = gasleft();
            uint256 beforeGas;
            uint256 useGas;
            // 检查 gas 和 balance
            while (thisGas >= useGas && address(this).balance >= value) {
                beforeGas = thisGas;
                new MintNFT{value: value}(owner, startTokenId, target, selector, mintAmount);
                startTokenId += mintAmount;
                thisGas = gasleft();
                useGas = beforeGas - thisGas;
            }
            // 返回 value
            if (address(this).balance > 0) {
                payable(owner).transfer(address(this).balance);
            }
        }
    }

    // 收到 ERC721，抛出tokenId
    function onERC721Received(
        address,
        address,
        uint256 tokenId,
        bytes calldata
    ) external pure override returns (bytes4) {
        revert(string(abi.encode(tokenId)));
    }
}

contract MintNFT {
    constructor(
        address owner,
        uint256 startTokenId,
        address target,
        uint32 selector,
        uint256 mintAmount
    ) payable {
        unchecked {
            // 执行 mint
            (bool success, ) = target.call{value: msg.value}(abi.encodePacked(selector, mintAmount));
            require(success, "cheapMintNFT: mint NFT error");
            // 发送 ERC721 给 owner
            IERC721 nft = IERC721(target);
            uint256 maxTokenId = startTokenId + mintAmount;
            for (; startTokenId < maxTokenId; ++startTokenId) {
                nft.transferFrom(address(this), owner, startTokenId);
            }
            // 合约自毁
            selfdestruct(payable(msg.sender));
        }
    }
}
