// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapSwap {
    /* ================ TRANSACTION FUNCTIONS ================ */

    function exactInput() external payable;

    function exactOutput() external payable;

    /* ===================== ADMIN FUNCTIONS ==================== */
}
