//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "./interfaces/ICheapSwapAddress.sol";
import "./interfaces/ICheapSwapFactory2.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CheapSwapAddress is ICheapSwapAddress {
    bool public allowTransfer = true;
    address public owner;
    address public target;
    ICheapSwapFactory2 public cheapSwapFactory;
    mapping(uint256 => bytes) public dataMap;
    mapping(address => bool) public senderApprove;

    constructor(
        address _owner,
        address _target,
        uint256[] memory valueList,
        bytes[] memory dataList
    ) {
        owner = _owner;
        target = _target;
        cheapSwapFactory = ICheapSwapFactory2(msg.sender);
        _setDataList(valueList, dataList);
    }

    /* ==================== UTIL FUNCTIONS =================== */

    modifier _onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    function _setDataList(uint256[] memory valueList, bytes[] memory dataList) internal {
        require(valueList.length == dataList.length, "CheapSwapAddress: not equal length");
        uint256 length = valueList.length;
        for (uint256 i = 0; i < length; ++i) {
            dataMap[valueList[i]] = dataList[i];
            emit SetData(valueList[i], dataList[i]);
        }
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    receive() external payable {
        require(dataMap[msg.value].length != 0, "CheapSwapAddress: empty data");
        uint256 fee = cheapSwapFactory.fee();
        require(msg.value >= fee, "CheapSwapAddress: insufficient value");
        payable(cheapSwapFactory.feeAddress()).transfer(fee);
        uint256 value = msg.value - fee;
        if (value > 0) {
            payable(owner).transfer(value);
        }
        (bool success, ) = target.call(dataMap[msg.value]);
        require(success, "CheapSwapAddress: call error");
    }

    function transferFrom(
        address token,
        address to,
        uint256 amount
    ) external {
        require(senderApprove[msg.sender], "CheapSwapAddress: not approve");
        IERC20(token).transferFrom(owner, to, amount);
    }

    /* ==================== ADMIN FUNCTIONS ================== */

    function approve(address sender, bool isApprove) external _onlyOwner {
        senderApprove[sender] = isApprove;
        emit Approve(sender, isApprove);
    }

    function setData(uint256 value, bytes calldata data) external _onlyOwner {
        dataMap[value] = data;
        emit SetData(value, data);
    }

    function setAllowTransfer(bool _allowTransfer) external _onlyOwner {
        allowTransfer = _allowTransfer;
        emit SetAllowTransfer(_allowTransfer);
    }

    function setDataList(uint256[] calldata valueList, bytes[] calldata dataList) external _onlyOwner {
        _setDataList(valueList, dataList);
    }

    function transferToken(
        address token,
        address to,
        uint256 amount
    ) external _onlyOwner {
        IERC20(token).transfer(to, amount);
    }
}
