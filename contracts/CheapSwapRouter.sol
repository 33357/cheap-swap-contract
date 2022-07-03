//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ICheapSwapRouter.sol";
import "./interfaces/ICheapSwapAddress.sol";
import "./lib/ISwapRouter.sol";
import "./lib/IWETH.sol";
import "./lib/CheapSwapRouterBytesLib.sol";

contract CheapSwapRouter is ICheapSwapRouter {
    using CheapSwapRouterBytesLib for bytes;

    // uniswapV3 Router
    ISwapRouter public Router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    // WETH
    IWETH9 public WETH = IWETH9(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

    constructor() {
        // WETH 授权给 Router
        IERC20(address(WETH)).approve(address(Router), type(uint256).max);
    }

    /* =================== VIEW FUNCTIONS =================== */

    function getSwapData(bytes calldata msgData, uint256 msgValue)
        public
        pure
        override
        returns (
            // 类型
            uint8 typeNum,
            // 买入数量
            uint120 amountOut,
            // 卖出数量
            uint120 amountIn,
            // 交易路径
            bytes memory path
        )
    {
        typeNum = msgData.toUint8(4);
        amountOut = msgData.toUint120(5);
        if (msgValue > 0) {
            amountIn = uint120(msgValue);
            path = msgData.slice(20, msgData.length - 20);
        } else {
            amountIn = msgData.toUint120(19);
            path = msgData.slice(35, msgData.length - 35);
        }
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function exactInput() external payable {
        (uint8 typeNum, uint120 amountOutMin, uint120 amountIn, bytes memory path) = getSwapData(msg.data, msg.value);
        if (typeNum == 1) {
            // amountOutMin = amountIn * amountOutMinPerAmountIn / 10**18
            amountOutMin = (amountIn * amountOutMin) / 10**18;
        }
        ICheapSwapAddress cheapSwapAddress = ICheapSwapAddress(msg.sender);
        address owner = cheapSwapAddress.owner();
        // 获取卖出代币
        if (msg.value > 0) {
            WETH.deposit{value: amountIn}();
        } else {
            address tokenIn = path.toAddress(0);
            cheapSwapAddress.call(
                tokenIn,
                abi.encodeWithSignature("transferFrom(address,address,uint256)", owner, address(this), amountIn)
            );
            if (IERC20(tokenIn).allowance(address(this), address(Router)) == 0) {
                IERC20(tokenIn).approve(address(Router), type(uint256).max);
            }
        }
        // 执行 swap
        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams({
            path: path,
            recipient: owner,
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: amountOutMin
        });
        Router.exactInput(params);
    }

    function exactOutput() external payable {
        (uint8 typeNum, uint120 amountOut, uint120 amountInMax, bytes memory path) = getSwapData(msg.data, msg.value);
        if (typeNum == 1) {
            // amountOutMax = amountOut * amountInMaxPerAmountOut / 10**18
            amountInMax = (amountOut * amountInMax) / 10**18;
        }
        address tokenIn;
        ICheapSwapAddress cheapSwapAddress = ICheapSwapAddress(msg.sender);
        address owner = cheapSwapAddress.owner();
        // 获取卖出代币
        if (msg.value > 0) {
            WETH.deposit{value: amountInMax}();
        } else {
            tokenIn = path.toAddress(23);
            cheapSwapAddress.call(
                tokenIn,
                abi.encodeWithSignature("transferFrom(address,address,uint256)", owner, address(this), amountInMax)
            );
            if (IERC20(tokenIn).allowance(address(this), address(Router)) == 0) {
                IERC20(tokenIn).approve(address(Router), type(uint256).max);
            }
        }
        // 执行 swap
        ISwapRouter.ExactOutputParams memory params = ISwapRouter.ExactOutputParams({
            path: path,
            recipient: owner,
            deadline: block.timestamp,
            amountOut: amountOut,
            amountInMaximum: amountInMax
        });
        uint256 amountIn = Router.exactOutput(params);
        uint256 amount = amountInMax - amountIn;
        // 退回多余代币
        if (amount > 0) {
            if (msg.value > 0) {
                WETH.withdraw(amount);
                payable(owner).transfer(amount);
            } else {
                IERC20(tokenIn).transfer(owner, amount);
            }
        }
    }
}
