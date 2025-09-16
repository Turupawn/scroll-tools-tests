// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

interface ISwapRouter02 {
    struct ExactOutputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 amountOut;
        uint256 amountInMaximum;
        uint160 sqrtPriceLimitX96;
    }

    function exactOutputSingle(ExactOutputSingleParams calldata params) external payable returns (uint256 amountIn);
}

contract UniV3 {
    address SCROLL_SEPOLIA_UNIV3_ROUTER_V2 = 0x17AFD0263D6909Ba1F9a8EAC697f76532365Fb95;

    // https://uniswap-showcase.sepolia.scroll.xyz/#/swap
    // Token In: 0x5300000000000000000000000000000000000004
    // Token Out: 0xD9692f1748aFEe00FACE2da35242417dd05a8615
    // Amount In Max: 40000000000000
    // Amount Out: 1000000000000000000
    // Fee: 3000
    function swap(address tokenIn, address tokenOut, uint256 amountInMax, uint256 amountOut, uint24 fee) external {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountInMax);
        IERC20(tokenIn).approve(SCROLL_SEPOLIA_UNIV3_ROUTER_V2, amountInMax);

        ISwapRouter02.ExactOutputSingleParams memory params = ISwapRouter02.ExactOutputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: fee,
            recipient: msg.sender,
            amountOut: amountOut,
            amountInMaximum: amountInMax,
            sqrtPriceLimitX96: 0
        });

        uint256 amountIn = ISwapRouter02(SCROLL_SEPOLIA_UNIV3_ROUTER_V2).exactOutputSingle(params);

        if (amountIn < amountInMax) {
            IERC20(tokenIn).approve(SCROLL_SEPOLIA_UNIV3_ROUTER_V2, 0);
            IERC20(tokenIn).transfer(msg.sender, amountInMax - amountIn);
        }
    }
}
