// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapSwap {
    /* ================ TRANSACTION FUNCTIONS ================ */

    function exactInput(
        bytes calldata path,
        uint32 deadline,
        uint112 amountIn,
        uint112 amountOutMin
    ) external;

    function exactOutput(
        bytes calldata path,
        uint32 deadline,
        uint112 amountOut,
        uint112 amountInMax
    ) external;

    /* ===================== ADMIN FUNCTIONS ==================== */
}
