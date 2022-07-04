// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapMintNFT {
    /* =================== VIEW FUNCTIONS =================== */

    function getMintData(bytes calldata msgData, uint256 msgValue)
        external
        pure
        returns (
            uint80 callMsgValue,
            address target,
            uint80 value,
            uint32 selector,
            uint8 mintAmount
        );

    /* ================ TRANSACTION FUNCTIONS ================ */

    function mint() external payable;

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}
