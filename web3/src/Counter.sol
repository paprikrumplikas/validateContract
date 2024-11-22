// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Counter is Ownable, Pausable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    uint256 public number;
    Counters.Counter private _incrementCounter;
    
    event NumberChanged(address indexed by, uint256 newValue);
    event NumberReset(address indexed by);

    constructor(uint256 startingValue) {
        number = startingValue;
        _transferOwnership(msg.sender);
    }

    function increment() public nonReentrant whenNotPaused {
        number++;
        _incrementCounter.increment();
        emit NumberChanged(msg.sender, number);
    }

    // Only owner can pause/unpause
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // Reset function with access control
    function reset() public onlyOwner {
        number = 0;
        emit NumberReset(msg.sender);
    }

    // View functions
    function getIncrementCount() public view returns (uint256) {
        return _incrementCounter.current();
    }
}
