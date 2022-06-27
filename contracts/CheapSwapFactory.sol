//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ICheapSwapFactory.sol";
import "./lib/ISwapRouter.sol";
import "./lib/IWETH.sol";
import "./CheapSwapAddress.sol";

contract CheapSwapFactory is ICheapSwapFactory, Ownable {
    ISwapRouter public Router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    IWETH9 public WETH = IWETH9(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

    mapping(address => bytes) public pathMap;
    mapping(address => uint256) public oneETHAmountOutMinMap;
    mapping(address => mapping(address => address)) public addressMap;

    address public feeAddress;
    uint256 public fee = 0.001 ether;

    constructor() {
        feeAddress = msg.sender;
        WETH.approve(address(Router), type(uint256).max);
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createAddress(address tokenOut) external {
        CheapSwapAddress cheapSwapAddress = new CheapSwapAddress(msg.sender, tokenOut);
        addressMap[msg.sender][tokenOut] = address(cheapSwapAddress);
    }

    function amountInETH_amountOutMin(address tokenOut, address recipient) external payable {
        require(msg.value > fee, "CheapSwapFactory: value too low");
        require(pathMap[tokenOut].length != 0, "CheapSwapFactory: empty path");
        payable(feeAddress).transfer(fee);
        uint256 amountIn = msg.value - fee;
        WETH.deposit{value: amountIn}();
        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams({
            path: pathMap[tokenOut],
            recipient: recipient,
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: (amountIn * oneETHAmountOutMinMap[tokenOut]) / 10**18
        });
        Router.exactInput(params);
    }

    /* ================ ADMIN FUNCTIONS ================ */

    function setFeeAddress(address _feeAddress) external onlyOwner {
        feeAddress = _feeAddress;
    }

    function setFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    function setPath(address tokenOut, bytes calldata path) external onlyOwner {
        pathMap[tokenOut] = path;
    }

    function setOneETHAmountOutMin(address tokenOut, uint256 oneETHAmountOutMin) external onlyOwner {
        oneETHAmountOutMinMap[tokenOut] = oneETHAmountOutMin;
    }
}
