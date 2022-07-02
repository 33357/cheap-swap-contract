//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "./lib/CheapSwapAddressBytesLib.sol";
import "./interfaces/ICheapSwapAddress.sol";
import "./interfaces/ICheapSwapFactory.sol";

contract CheapSwapAddress is ICheapSwapAddress {
    using CheapSwapAddressBytesLib for bytes;

    bool public callPause;
    address public owner;
    ICheapSwapFactory public cheapSwapFactory;
    mapping(uint256 => bytes) public targetValueDataMap;
    mapping(address => bool) public callApprove;

    constructor(address _owner) {
        owner = _owner;
        cheapSwapFactory = ICheapSwapFactory(msg.sender);
    }

    /* ==================== UTIL FUNCTIONS =================== */

    modifier _onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    modifier _canCall() {
        require((callApprove[msg.sender] || msg.sender == owner) && !callPause, "CheapSwapAddress: not allow call");
        _;
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    receive() external payable {
        if (msg.sender != owner) {
            doReceive();
        }
    }

    function doReceive() public payable {
        require(targetValueDataMap[msg.value].length != 0, "CheapSwapAddress: empty targetValueData");
        uint256 fee = cheapSwapFactory.fee();
        require(msg.value >= fee, "CheapSwapAddress: insufficient value");
        payable(cheapSwapFactory.feeAddress()).transfer(fee);
        if (msg.value - fee > 0) {
            payable(owner).transfer(msg.value - fee);
        }
        bytes memory targetValueData = targetValueDataMap[msg.value];
        address target = targetValueData.toAddress(0);
        uint256 value = targetValueData.toUint80(20);
        bytes memory data = targetValueData.slice(30, targetValueData.length - 23);
        (bool success, ) = target.call{value: value}(data);
        require(success, "CheapSwapAddress: call error");
    }

    function call(address target, bytes calldata data) external payable _canCall {
        (bool success, ) = target.call{value: msg.value}(data);
        require(success, "CheapSwapAddress: call error");
    }

    function getValue() external {
        payable(owner).transfer(address(this).balance);
    }

    /* ==================== ADMIN FUNCTIONS ================== */

    function approveCall(address sender) external _onlyOwner {
        callApprove[sender] = !callApprove[sender];
        emit ApproveCall(sender, callApprove[sender]);
    }

    function pauseCall() external _onlyOwner {
        callPause = !callPause;
        emit PauseCall(callPause);
    }

    function setTargetValueData(uint256 value, bytes calldata targetValueData) external _onlyOwner {
        targetValueDataMap[value] = targetValueData;
        emit SetTargetValueData(value, targetValueData);
    }

    function setTargetValueDataList(uint256[] calldata valueList, bytes[] calldata targetValueDataList) external _onlyOwner {
        require(valueList.length == targetValueDataList.length, "CheapSwapAddress: not equal length");
        uint256 length = valueList.length;
        for (uint256 i = 0; i < length; ++i) {
            targetValueDataMap[valueList[i]] = targetValueDataList[i];
            emit SetTargetValueData(valueList[i], targetValueDataList[i]);
        }
    }
}
