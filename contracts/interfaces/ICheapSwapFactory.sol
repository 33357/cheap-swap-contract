// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapSwapFactory {
    /* ==================== EVENTS =================== */

    event CreateAddress(address indexed owner, address cheapSwapAddress);

    /* ==================== VIEW FUNCTIONS =================== */

    function fee() external view returns (uint256);

    function feeAddress() external view returns (address);

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createCheapSwapAddress() external;

    /* ==================== ADMIN FUNCTIONS =================== */

    function setFeeAddress(address _feeAddress) external;

    function setFee(uint256 _fee) external;
}
