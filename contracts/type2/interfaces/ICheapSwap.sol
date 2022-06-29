// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapSwap {
    /* ================ TRANSACTION FUNCTIONS ================ */

    function exactInput(
        bytes calldata path,
        uint256 amountIn,
        uint256 amountOutMin
    ) external;

    function exactOutput(
        bytes calldata path,
        uint256 amountOut,
        uint256 amountInMax
    ) external;

    /* ===================== ADMIN FUNCTIONS ==================== */
}
