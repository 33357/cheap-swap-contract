// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapSwapFactory2 {
    /* ==================== EVENTS =================== */

    event CreateAddress(address owner, address chatSwapAddress);

    /* ==================== VIEW FUNCTIONS =================== */

    function fee() external view returns (uint256);

    function feeAddress() external view returns (address);

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createAddress() external;

    /* ==================== ADMIN FUNCTIONS =================== */

    function setFeeAddress(address _feeAddress) external;

    function setFee(uint256 _fee) external;
}
