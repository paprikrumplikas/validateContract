ERRORS DURING VERIFICATION:

1. HH8: There's one or more errors in your config file: Invalid value undefined for HardhatConfig.networks.sepolia.url - Expected a value of type string.
    - reason: environment vars are undefined or not read or incorrect
2. Failed to deploy: Error: The contract you want to verify was compiled with solidity 0.8.28, but your configured compiler version is: 0.8.19.
    - reason: in harhat.config.js, the desired network has to be set as the default network
3. 