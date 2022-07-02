//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "./lib/CheapSwapAddressBytesLib.sol";
import "./interfaces/ICheapSwapAddress.sol";
import "./interfaces/ICheapSwapFactory.sol";

contract CheapSwapAddress is ICheapSwapAddress {
    using CheapSwapAddressBytesLib for bytes;

    bool public pause;
    address public owner;
    ICheapSwapFactory public cheapSwapFactory;
    mapping(uint256 => bytes) public targetValueDataMap;
    mapping(address => bool) public approve;

    constructor(address _owner) {
        owner = _owner;
        cheapSwapFactory = ICheapSwapFactory(msg.sender);
    }

    /* ==================== UTIL FUNCTIONS =================== */

    modifier _onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    receive() external payable {
        if (msg.sender != owner) {
            doReceive();
        }
    }

    function doReceive() public payable {
        unchecked {
            uint256 msgValue;
            uint256 max = type(uint80).max;
            if (targetValueDataMap[msg.value].length != 0) {
                msgValue = msg.value;
            } else if (targetValueDataMap[max].length != 0) {
                msgValue = max;
            }
            if (targetValueDataMap[msgValue].length != 0) {
                uint256 fee = cheapSwapFactory.fee();
                require(msg.value >= fee, "CheapSwapAddress: insufficient value");
                payable(cheapSwapFactory.feeAddress()).transfer(fee);
                bytes memory targetValueData = targetValueDataMap[msgValue];
                uint256 deadline = targetValueData.toUint40(0);
                require(block.timestamp <= deadline, "CheapSwapAddress: over deadline");
                address target = targetValueData.toAddress(5);
                uint256 value;
                bytes memory data;
                if (msgValue != max) {
                    value = targetValueData.toUint80(25);
                    data = targetValueData.slice(35, targetValueData.length - 35);
                } else {
                    if (msg.value - fee > 0) {
                        payable(owner).transfer(msg.value - fee);
                    }
                    value = address(this).balance;
                    data = targetValueData.slice(25, targetValueData.length - 25);
                }
                (bool success, ) = target.call{value: value}(data);
                require(success, "CheapSwapAddress: call error");
            }
        }
    }

    function call(address target, bytes calldata data) external payable {
        require((approve[msg.sender] && !pause) || msg.sender == owner, "CheapSwapAddress: not allow call");
        (bool success, ) = target.call{value: msg.value}(data);
        require(success, "CheapSwapAddress: call error");
    }

    /* ==================== ADMIN FUNCTIONS ================== */

    function getValue() external _onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function setApprove(address sender, bool isApprove) external _onlyOwner {
        approve[sender] = isApprove;
        emit SetApprove(sender, approve[sender]);
    }

    function setPause(bool isPause) external _onlyOwner {
        pause = isPause;
        emit SetPause(isPause);
    }

    function setTargetValueData(uint256 value, bytes calldata targetValueData) external _onlyOwner {
        targetValueDataMap[value] = targetValueData;
        emit SetTargetValueData(value, targetValueData);
    }

    function setTargetValueDataList(uint256[] calldata valueList, bytes[] calldata targetValueDataList)
        external
        _onlyOwner
    {
        require(valueList.length == targetValueDataList.length, "CheapSwapAddress: not equal length");
        uint256 length = valueList.length;
        for (uint256 i = 0; i < length; ++i) {
            targetValueDataMap[valueList[i]] = targetValueDataList[i];
            emit SetTargetValueData(valueList[i], targetValueDataList[i]);
        }
    }
}
