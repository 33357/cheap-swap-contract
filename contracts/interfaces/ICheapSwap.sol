// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapSwap {
    /* ================ TRANSACTION FUNCTIONS ================ */

    function exactInput() external;

    function exactOutput() external;

    /* ===================== ADMIN FUNCTIONS ==================== */
}
