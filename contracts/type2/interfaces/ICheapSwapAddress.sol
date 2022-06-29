// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ICheapSwapAddress {
    /* ==================== VIEW FUNCTIONS =================== */

    function owner() external view returns (address);
    
    /* ================ TRANSACTION FUNCTIONS ================ */

    function tokenApprove(
        address sender,
        address token,
        uint256 allowance
    ) external;

    function tokenTransferFrom(
        address token,
        address to,
        uint256 amount
    ) external;

    /* ===================== ADMIN FUNCTIONS ==================== */

    // function callData(address _target, bytes calldata data) external payable;

    // function callDataList(
    //     address[] calldata targetList,
    //     uint256[] calldata valueList,
    //     bytes[] calldata dataList
    // ) external payable;

    function setData(uint256 value, bytes calldata data) external;

    function setDataList(uint256[] calldata valueList, bytes[] calldata dataList) external;
}
