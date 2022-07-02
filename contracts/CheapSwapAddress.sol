//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "./lib/BytesLib.sol";
import "./interfaces/ICheapSwapAddress.sol";
import "./interfaces/ICheapSwapFactory.sol";

contract CheapSwapAddress is ICheapSwapAddress {
    using BytesLib for bytes;

    bool public callPause;
    address public owner;
    ICheapSwapFactory public cheapSwapFactory;
    mapping(uint256 => bytes) public targetDataMap;
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
        require(targetDataMap[msg.value].length != 0, "CheapSwapAddress: empty targetData");
        uint256 fee = cheapSwapFactory.fee();
        require(msg.value >= fee, "CheapSwapAddress: insufficient value");
        payable(cheapSwapFactory.feeAddress()).transfer(fee);
        uint256 value = msg.value - fee;
        if (value > 0) {
            payable(owner).transfer(value);
        }
        bytes memory targetData = targetDataMap[msg.value];
        (bool success, ) = targetData.toAddress(0).call(targetData.slice(20, targetData.length - 20));
        require(success, "CheapSwapAddress: call error");
    }

    function call(address target, bytes calldata data) external payable _canCall {
        bool success;
        if (msg.value > 0) {
            (success, ) = target.call{value: msg.value}(data);
        } else {
            (success, ) = target.call(data);
        }
        require(success, "CheapSwapAddress: call error");
    }

    function sendValue(address target, uint256 value) external _canCall {
        payable(target).transfer(value);
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

    function setTargetData(uint256 value, bytes calldata targetData) external _onlyOwner {
        targetDataMap[value] = targetData;
        emit SetTargetData(value, targetData);
    }

    function setTargetDataList(uint256[] calldata valueList, bytes[] calldata targetDataList) external _onlyOwner {
        require(valueList.length == targetDataList.length, "CheapSwapAddress: not equal length");
        uint256 length = valueList.length;
        for (uint256 i = 0; i < length; ++i) {
            targetDataMap[valueList[i]] = targetDataList[i];
            emit SetTargetData(valueList[i], targetDataList[i]);
        }
    }
}
