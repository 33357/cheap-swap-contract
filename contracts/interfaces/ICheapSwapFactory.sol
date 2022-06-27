// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapSwapFactory {
    /* ================ TRANSACTION FUNCTIONS ================ */

    function createAddress(address tokenOut) external;

    function amountInETH_amountOutMin(address tokenOut, address recipient) external payable;

    /* ================ ADMIN FUNCTIONS ================ */

    function setFeeAddress(address _feeAddress) external;

    function setFeePoint(uint256 _feePoint) external;

    function setPath(address tokenOut, bytes calldata path) external;

    function setOneETHAmountOutMin(address tokenOut, uint256 oneETHAmountOutMin) external;
}