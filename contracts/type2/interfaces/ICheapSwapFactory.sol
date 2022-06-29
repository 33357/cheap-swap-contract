// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapSwapFactory {
    /* ================ VIEW FUNCTIONS ================ */
    function fee() external view returns (uint256);

    function feeAddress() external view returns (address);

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createAddress(
        address target,
        uint256[] calldata valueList,
        bytes[] calldata dataList
    ) external;

    /* ================ ADMIN FUNCTIONS ================ */

    function setFeeAddress(address _feeAddress) external;

    function setFee(uint256 _fee) external;
}
