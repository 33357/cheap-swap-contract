// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapSwapRouterV3 {
    /* =================== VIEW FUNCTIONS =================== */

    function getSwapData(bytes calldata msgData, uint256 msgValue)
        external
        pure
        returns (
            uint8 typeNum,
            uint120 amountOut,
            uint120 amountIn,
            bytes memory path
        );

    /* ================ TRANSACTION FUNCTIONS ================ */

    function exactInput() external payable;

    function exactOutput() external payable;
}
