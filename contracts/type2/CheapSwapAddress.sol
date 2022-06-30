//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "../lib/BytesLib.sol";
import "./interfaces/ICheapSwapAddress.sol";
import "./interfaces/ICheapSwapFactory2.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CheapSwapAddress is ICheapSwapAddress {
    using BytesLib for bytes;

    bool public callPause;
    address public owner;
    ICheapSwapFactory2 public cheapSwapFactory;
    mapping(uint256 => bytes) public targetDataMap;
    mapping(address => bool) public callApprove;

    constructor(
        address _owner,
        uint256[] memory valueList,
        bytes[] memory targetDataList
    ) {
        owner = _owner;
        cheapSwapFactory = ICheapSwapFactory2(msg.sender);
        _setDataList(valueList, targetDataList);
    }

    /* ==================== UTIL FUNCTIONS =================== */

    modifier _onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    function _setDataList(uint256[] memory valueList, bytes[] memory targetDataList) internal {
        require(valueList.length == targetDataList.length, "CheapSwapAddress: not equal length");
        uint256 length = valueList.length;
        for (uint256 i = 0; i < length; ++i) {
            targetDataMap[valueList[i]] = targetDataList[i];
            emit SetTargetData(valueList[i], targetDataList[i]);
        }
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    receive() external payable {
        require(targetDataMap[msg.value].length != 0, "CheapSwapAddress: empty targetData");
        uint256 fee = cheapSwapFactory.fee();
        require(msg.value >= fee, "CheapSwapAddress: insufficient value");
        payable(cheapSwapFactory.feeAddress()).transfer(fee);
        uint256 value = msg.value - fee;
        if (value > 0) {
            payable(owner).transfer(value);
        }
        bytes memory targetData = targetDataMap[msg.value];
        (bool success, ) = targetData.toAddress(0).call(targetData.slice(20, targetData.length));
        require(success, "CheapSwapAddress: call error");
    }

    function call(address target, bytes calldata data) external payable {
        require(callApprove[msg.sender] && !callPause, "CheapSwapAddress: not allow call");
        bool success;
        if (msg.value > 0) {
            (success, ) = target.call{value: msg.value}(data);
        } else {
            (success, ) = target.call(data);
        }
        require(success, "CheapSwapAddress: call error");
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
        _setDataList(valueList, targetDataList);
    }
}
