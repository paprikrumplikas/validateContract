// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Counter {
    uint256 public number;

    constructor(uint256 startingValue) {
        number = startingValue;
    }

    function increment() public {
        number++;
    }
}
