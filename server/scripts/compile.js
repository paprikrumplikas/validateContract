const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, '../build');
const contractPath = path.resolve(__dirname, '../../web3/src', 'Counter.sol');

const compile = async () => {
    // Delete build folder if it exists
    await fs.remove(buildPath);

    // Read the Counter.sol file
    const source = await fs.readFile(contractPath, 'utf8');

    // Prepare input for solc compiler with explicit settings
    const input = {
        language: 'Solidity',
        sources: {
            'Counter.sol': {
                content: source,
            },
        },
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            },
            evmVersion: "paris",
            outputSelection: {
                '*': {
                    '*': [
                        'abi',
                        'evm.bytecode',
                        'evm.deployedBytecode',
                        'evm.methodIdentifiers',
                        'metadata'
                    ],
                },
            },
            metadata: {
                bytecodeHash: "ipfs",
            },
            viaIR: false
        },
    };

    // Compile the contract
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    // Check for errors
    if (output.errors) {
        output.errors.forEach(error => {
            console.error(error.formattedMessage);
        });
        // Throw error if there are any severe errors
        if (output.errors.some(error => error.severity === 'error')) {
            throw new Error('Compilation failed');
        }
    }

    // Create build folder
    await fs.ensureDir(buildPath);

    // Extract and write the contract data
    const contractOutput = output.contracts['Counter.sol']['Counter'];

    await fs.writeJson(
        path.resolve(buildPath, 'Counter.json'),
        {
            abi: contractOutput.abi,
            bytecode: contractOutput.evm.bytecode.object,
            deployedBytecode: contractOutput.evm.deployedBytecode.object,
            metadata: contractOutput.metadata,
        },
        { spaces: 2 }
    );

    console.log('Contract compiled successfully!');
};

compile();
