// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapSwapAddress {
    /* ==================== VIEW FUNCTIONS =================== */

    function owner() external view returns (address);

    /* ================ TRANSACTION FUNCTIONS ================ */

    function transferFrom(
        address token,
        address to,
        uint256 amount
    ) external;

    /* ===================== ADMIN FUNCTIONS ==================== */

    function approve(
        address sender,
        bool isApprove
    ) external;

    function setData(uint256 value, bytes calldata data) external;

    function setDataList(uint256[] calldata valueList, bytes[] calldata dataList) external;

    function setAllowTransfer(bool _allowTransfer) external;
}
