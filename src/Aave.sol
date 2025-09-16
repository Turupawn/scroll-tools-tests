// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

library DataTypes {
    struct ReserveConfigurationMap {
        uint256 data;
    }

    struct ReserveData {
        ReserveConfigurationMap configuration;
        uint128 liquidityIndex;
        uint128 currentLiquidityRate;
        uint128 variableBorrowIndex;
        uint128 currentVariableBorrowRate;
        uint128 currentStableBorrowRate;
        uint40 lastUpdateTimestamp;
        uint16 id;
        address aTokenAddress;
        address stableDebtTokenAddress;
        address variableDebtTokenAddress;
        address interestRateStrategyAddress;
        uint128 accruedToTreasury;
        uint128 unbacked;
        uint128 isolationModeTotalDebt;
    }
}

interface IPool {
    function borrow(
        address asset,
        uint256 amount,
        uint256 interestRateMode, // 1 for Stable, 2 for Variable
        uint16 referralCode,
        address onBehalfOf
    ) external;

    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;

    function withdraw(address asset, uint256 amount, address to) external returns (uint256);

    function getReserveData(address asset) external view returns (DataTypes.ReserveData memory);
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract Aave {
    address public immutable AAVE_POOL_ADDRESS;
    address public immutable STAKED_TOKEN_ADDRESS;
    address public immutable ATOKEN_ADDRESS;
    address public immutable OWNER;

    // Ejemplo en Scroll Sepolia
    // Pool Address
    // 0x48914C788295b5db23aF2b5F0B3BE775C4eA9440
    // DAI
    // 0x7984E363c38b590bB4CA35aEd5133Ef2c6619C40

    // check at https://app.aave.com/
    constructor(address aavePoolAddress, address stakedTokenAddress) {
        AAVE_POOL_ADDRESS = aavePoolAddress;
        STAKED_TOKEN_ADDRESS = stakedTokenAddress;
        OWNER = msg.sender;
        ATOKEN_ADDRESS = IPool(aavePoolAddress).getReserveData(stakedTokenAddress).aTokenAddress;
    }

    function stake(uint256 amount) public {
        IERC20(STAKED_TOKEN_ADDRESS).transferFrom(msg.sender, address(this), amount);
        IERC20(STAKED_TOKEN_ADDRESS).approve(AAVE_POOL_ADDRESS, amount);
        IPool(AAVE_POOL_ADDRESS).supply(STAKED_TOKEN_ADDRESS, amount, msg.sender, 0);
    }

    function unstake(uint256 amount) public {
        IERC20(ATOKEN_ADDRESS).transferFrom(msg.sender, address(this), amount);
        IERC20(ATOKEN_ADDRESS).approve(AAVE_POOL_ADDRESS, amount);
        IPool(AAVE_POOL_ADDRESS).withdraw(STAKED_TOKEN_ADDRESS, amount, msg.sender);
    }
}
