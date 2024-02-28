// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {ZkSnakeTemp} from "../contracts/ZkSnakeTemp.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        ZkSnakeTemp app = new ZkSnakeTemp();
        vm.stopBroadcast();
    }
}
