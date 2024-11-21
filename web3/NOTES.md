ERRORS AND THEIR FIEXES DURING VERIFICATION:

1. HH8: There's one or more errors in your config file: Invalid value undefined for HardhatConfig.networks.sepolia.url - Expected a value of type string.
    - reason: environment vars are undefined or not read or incorrect
2. Failed to deploy: Error: The contract you want to verify was compiled with solidity 0.8.28, but your configured compiler version is: 0.8.19.
    - reason: in harhat.config.js, the desired network has to be set as the default network
3. Error: The address provided as argument contains a contract, but its bytecode doesn't match any of your local contracts.
    - Fix: replaced solc with HH as verification tool

    Learnings:

                1. Hardhat looks for contracts in these locations by default:

                server/
                ├── contracts/          # Source Solidity files
                ├── artifacts/         # Compiled contract artifacts (generated after compilation)
                └── cache/            # Compilation cache

                2.  The artifacts folder is Hardhat's default location for compiled contracts. When Hardhat compiles a contract, it creates:

                artifacts/
                ├── contracts/
                │   └── Counter.sol/
                │       ├── Counter.json           # Contains ABI, bytecode, etc.
                │       └── Counter.dbg.json       # Debug information
                └── build-info/                    # Contains detailed compilation info
                    └── ...

                3. Let Hardhat use its default artifacts/ folder (not needed to be added in hhconfig, as this is really the default)

                    module.exports = {
                    // ... other config ...
                    paths: {
                        artifacts: "./artifacts",  // Default
                        sources: "./contracts"     // Default
                    }
                }


4. ❌ Error: TypeError: contractData.bytecode is undefined
    - Reasons potentaially: 
        - caching issues
        - @crucial the contract to be compiled has to be in the same directory where HH was installed in (now it is the server dir, but can be one of its subdirs as well)