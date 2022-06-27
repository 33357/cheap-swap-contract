// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapSwap {
    /* ================ EVENTS ================ */

    /* ================ VIEW FUNCTIONS ================ */

    /* ================ TRANSACTION FUNCTIONS ================ */

    /* ================ ADMIN FUNCTIONS ================ */

    function setPath(bytes calldata _path) external;

    function setAmountOutMin(uint256 _amountInOneETH_amountOutMin) external;

    function setPathAndAmountOutMin(bytes calldata _path, uint256 _amountInOneETH_amountOutMin) external;
}
