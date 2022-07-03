//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ICheapSwap.sol";
import "./interfaces/ICheapSwapAddress.sol";
import "./lib/ISwapRouter.sol";
import "./lib/IWETH.sol";
import "./lib/CheapSwapBytesLib.sol";

contract CheapSwap is ICheapSwap {
    using CheapSwapBytesLib for bytes;
    ISwapRouter public Router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    IWETH9 public WETH = IWETH9(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

    constructor() {
        IERC20(address(WETH)).approve(address(Router), type(uint256).max);
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function exactInput() external payable {
        uint256 amountOutMin = msg.data.toUint120(4);
        uint256 amountIn;
        bytes memory path;
        ICheapSwapAddress cheapSwapAddress = ICheapSwapAddress(msg.sender);
        address owner = cheapSwapAddress.owner();
        if (msg.value > 0) {
            amountIn = msg.value;
            path = msg.data.slice(19, msg.data.length - 19);
            WETH.deposit{value: amountIn}();
        } else {
            amountIn = msg.data.toUint120(19);
            path = msg.data.slice(34, msg.data.length - 34);
            address tokenIn = path.toAddress(0);
            cheapSwapAddress.call(
                tokenIn,
                abi.encodeWithSignature("transferFrom(address,address,uint256)", owner, address(this), amountIn)
            );
            if (IERC20(tokenIn).allowance(address(this), address(Router)) == 0) {
                IERC20(tokenIn).approve(address(Router), type(uint256).max);
            }
        }

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
        uint256 amountOut = msg.data.toUint120(4);
        uint256 amountInMax;
        bytes memory path;
        address tokenIn;
        ICheapSwapAddress cheapSwapAddress = ICheapSwapAddress(msg.sender);
        address owner = cheapSwapAddress.owner();
        if (msg.value > 0) {
            amountInMax = msg.value;
            path = msg.data.slice(19, msg.data.length - 19);
            WETH.deposit{value: amountInMax}();
        } else {
            amountInMax = msg.data.toUint120(19);
            path = msg.data.slice(34, msg.data.length - 34);
            tokenIn = path.toAddress(23);
            cheapSwapAddress.call(
                tokenIn,
                abi.encodeWithSignature("transferFrom(address,address,uint256)", owner, address(this), amountInMax)
            );
            if (IERC20(tokenIn).allowance(address(this), address(Router)) == 0) {
                IERC20(tokenIn).approve(address(Router), type(uint256).max);
            }
        }

        ISwapRouter.ExactOutputParams memory params = ISwapRouter.ExactOutputParams({
            path: path,
            recipient: owner,
            deadline: block.timestamp,
            amountOut: amountOut,
            amountInMaximum: amountInMax
        });
        uint256 amountIn = Router.exactOutput(params);
        uint256 amount = amountInMax - amountIn;
        if (amount > 0) {
            if (msg.value > 0) {
                WETH.withdraw(amount);
                payable(owner).transfer(amount);
            } else {
                IERC20(tokenIn).transfer(owner, amount);
            }
        }
    }

    function exactMaxInput() external payable {
        uint256 amountOutMinPerAmountIn = msg.data.toUint120(4);
        uint256 amountIn;
        bytes memory path;
        ICheapSwapAddress cheapSwapAddress = ICheapSwapAddress(msg.sender);
        address owner = cheapSwapAddress.owner();
        if (msg.value > 0) {
            amountIn = msg.value;
            path = msg.data.slice(19, msg.data.length - 19);
            WETH.deposit{value: amountIn}();
        } else {
            path = msg.data.slice(19, msg.data.length - 19);
            address tokenIn = path.toAddress(0);
            amountIn = IERC20(tokenIn).balanceOf(owner);
            cheapSwapAddress.call(
                tokenIn,
                abi.encodeWithSignature("transferFrom(address,address,uint256)", owner, address(this), amountIn)
            );
            if (IERC20(tokenIn).allowance(address(this), address(Router)) == 0) {
                IERC20(tokenIn).approve(address(Router), type(uint256).max);
            }
        }

        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams({
            path: path,
            recipient: owner,
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: (amountOutMinPerAmountIn * amountIn) / 10**18
        });
        Router.exactInput(params);
    }
}
