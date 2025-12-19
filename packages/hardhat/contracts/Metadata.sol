//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Metadata {
    /**
     * @notice Returns the name for the graduation NFT
     * @dev This will appear on the NFT as your identity
     */
    function getName() external pure returns (string memory) {
        return "dharmanan"; // Replace with your name or nickname
    }

    /**
     * @notice Returns RGB color values for the NFT background
     * @dev Each value must be between 0-255
     * @return r Red component (0-255)
     * @return g Green component (0-255)
     * @return b Blue component (0-255)
     */
    function getColor() external pure returns (uint8, uint8, uint8) {
        // Example: Purple color (148, 0, 211)
        // You can change this to any color you like!
        // Try: https://www.rapidtables.com/web/color/RGB_Color.html
        return (148, 0, 211); // Purple
    }
}
