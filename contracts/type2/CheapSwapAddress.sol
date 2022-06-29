//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "./interfaces/ICheapSwapAddress.sol";
import "./interfaces/ICheapSwapFactory.sol";

contract CheapSwapAddress is ICheapSwapAddress {
    address public owner;
    address public target;
    ICheapSwapFactory public cheapSwapFactory;
    mapping(uint256 => bytes) public dataMap;

    constructor(
        address _owner,
        address _target,
        uint256[] memory valueList,
        bytes[] memory dataList
    ) {
        owner = _owner;
        target = _target;
        cheapSwapFactory = ICheapSwapFactory(msg.sender);
        _setDataList(valueList, dataList);
    }

    /* ==================== UTIL FUNCTIONS =================== */

       function _setDataList(uint256[] memory valueList, bytes[] memory dataList) internal {
        require(valueList.length == dataList.length, "CheapSwapAddress: not equal length");
        uint256 length = valueList.length;
        for (uint256 i = 0; i < length; ++i) {
            dataMap[valueList[i]] = dataList[i];
        }
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    receive() external payable {
        require(dataMap[msg.value].length != 0, "CheapSwapAddress: empty data");
        uint256 fee = cheapSwapFactory.fee();
        require(msg.value >= fee, "CheapSwapAddress: insufficient value");
        payable(cheapSwapFactory.feeAddress()).transfer(fee);
        (bool success, ) = target.call{value: msg.value - fee}(dataMap[msg.value]);
        require(success, "CheapSwapTargetAddress: call error");
    }

    /* ==================== ADMIN FUNCTIONS ================== */

    function callData(address _target, bytes calldata data) external payable {
        require(msg.sender == owner, "CheapSwapAddress: not owner");
        (bool success, ) = _target.call{value: msg.value}(data);
        require(success, "CheapSwapAddress: call error");
    }

    function callDataList(
        address[] calldata targetList,
        uint256[] calldata valueList,
        bytes[] calldata dataList
    ) external payable {
        require(msg.sender == owner, "CheapSwapAddress: not owner");
        require(
            targetList.length == valueList.length && valueList.length == dataList.length,
            "CheapSwapAddress: not equal length"
        );
        uint256 length = targetList.length;
        for (uint256 i = 0; i < length; ++i) {
            (bool success, ) = targetList[i].call{value: valueList[i]}(dataList[i]);
            require(success, "CheapSwapAddress: call error");
        }
    }

    function setData(uint256 value, bytes calldata data) external {
        require(msg.sender == owner, "CheapSwapAddress: not owner");
        dataMap[value] = data;
    }

    function setDataList(uint256[] calldata valueList, bytes[] calldata dataList) external {
        require(msg.sender == owner, "CheapSwapAddress: not owner");
        _setDataList(valueList, dataList);
    }
}
