//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "./lib/CheapSwapAddressBytesLib.sol";
import "./interfaces/ICheapSwapAddress.sol";
import "./interfaces/ICheapSwapFactory.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CheapSwapAddress is ICheapSwapAddress, ReentrancyGuard {
    using CheapSwapAddressBytesLib for bytes;

    // call调用是否暂停
    bool public pause;
    // 所有者地址
    address public owner;
    // cheapSwapFactory 地址
    ICheapSwapFactory public cheapSwapFactory;
    // msgValue 到 targetData 的映射
    mapping(uint256 => bytes) public targetDataMap;

    constructor(address _owner) {
        owner = _owner;
        cheapSwapFactory = ICheapSwapFactory(msg.sender);
    }

    /* ==================== UTIL FUNCTIONS =================== */

    modifier _onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    function _checkApprove(
        uint8 runTime,
        uint8 maxRunTime,
        uint40 deadline
    ) internal view {
        require(!pause, "CheapSwapAddress: pause");
        // 不能超时
        require(block.timestamp <= deadline, "CheapSwapAddress: over deadline");
        // 不能超过运行次数
        if (maxRunTime != 0) {
            require(runTime < maxRunTime, "CheapSwapAddress: over runTime");
        }
    }

    /* =================== VIEW FUNCTIONS =================== */

    function getTargetData(bytes memory targetData, uint256 msgValue)
        public
        pure
        returns (
            // 运行次数
            uint8 runTime,
            // 最大运行次数
            uint8 maxRunTime,
            // 截止日期
            uint40 deadline,
            // 目标地址
            address target,
            // value
            uint80 value,
            // data
            bytes memory data
        )
    {
        runTime = targetData.toUint8(0);
        maxRunTime = targetData.toUint8(1);
        deadline = targetData.toUint40(2);
        target = targetData.toAddress(7);
        if (msgValue > 0) {
            value = targetData.toUint80(27);
            data = abi.encodePacked(
                targetData.toUint32(37),
                uint80(msgValue),
                targetData.slice(41, targetData.length - 41)
            );
        } else {
            data = abi.encodePacked(
                targetData.toUint32(27),
                uint80(msgValue),
                targetData.slice(31, targetData.length - 31)
            );
        }
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    receive() external payable {
        // 所有者默认存入 value
        if (msg.sender != owner) {
            doReceive();
        }
    }

    function doReceive() public payable nonReentrant {
        unchecked {
            uint256 msgValue;
            // 如果 msg.value 映射的 targetData 不为空，msgValue 等于 msg.value
            if (targetDataMap[msg.value].length != 0) {
                msgValue = msg.value;
            }
            // 如果 0 映射的 targetData 不为空，也能执行
            if (msgValue != 0 || targetDataMap[0].length != 0) {
                (
                    uint8 runTime,
                    uint8 maxRunTime,
                    uint40 deadline,
                    address target,
                    uint80 value,
                    bytes memory data
                ) = getTargetData(targetDataMap[msg.value], msgValue);
                _checkApprove(runTime, maxRunTime, deadline);
                // 收费
                uint256 fee = cheapSwapFactory.fee();
                require(msg.value >= fee, "CheapSwapAddress: insufficient value");
                payable(cheapSwapFactory.feeAddress()).transfer(fee);
                // 除非 msgValue 为 0，否则退给所有者 msg.value
                if (msgValue != 0) {
                    if (msg.value - fee > 0) {
                        payable(owner).transfer(msg.value - fee);
                    }
                } else {
                    value = uint80(address(this).balance);
                }
                // 执行targetData
                (bool success, ) = target.call{value: value}(data);
                require(success, "CheapSwapAddress: call error");
                if (maxRunTime != 0) {
                    targetDataMap[msg.value][0] = bytes1(++runTime);
                }
            }
        }
    }

    function call(
        uint256 callMsgValue,
        address target,
        bytes calldata data
    ) external payable {
        (uint8 runTime, uint8 maxRunTime, uint40 deadline, address _target, , ) = getTargetData(
            targetDataMap[callMsgValue],
            callMsgValue
        );
        // 只有授权者和所有者才能调用
        if (msg.sender != owner) {
            _checkApprove(runTime, maxRunTime, deadline);
            require(msg.sender == _target, "CheapSwapAddress: not approver");
        }
        (bool success, ) = target.call{value: msg.value}(data);
        require(success, "CheapSwapAddress: call error");
    }

    /* ==================== ADMIN FUNCTIONS ================== */
    // 获取value
    function getValue() external _onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // 暂停授权
    function setPause(bool isPause) external _onlyOwner {
        pause = isPause;
        emit SetPause(isPause);
    }

    // 设置 targetData
    function setTargetData(
        uint256 msgValue,
        uint8 maxRunTime,
        uint40 deadline,
        address target,
        uint80 value,
        bytes calldata data
    ) external _onlyOwner {
        bytes memory targetData = abi.encodePacked(uint8(0), maxRunTime, deadline, target, value, data);
        targetDataMap[msgValue] = targetData;
        emit SetTargetData(msgValue, targetData);
    }
}
