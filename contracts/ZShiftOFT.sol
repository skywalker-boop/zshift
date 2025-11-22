// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@layerzerolabs/contracts/token/oft/OFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZShiftOFT is OFT, Ownable {
    constructor(string memory _name, string memory _symbol, address _lzEndpoint) OFT(_name, _symbol, _lzEndpoint) {}

    // Mint test tokens for testnet demo
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
