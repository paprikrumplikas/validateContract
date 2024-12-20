// @note simple Express server

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// console log
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// @note @crucial Express endpoint serving the contract's ABI and bytecode to the frontend
app.get('/api/contract', async (req, res) => {
    try {
        const contractPath = path.resolve(__dirname, 'artifacts/contracts/Counter.sol/Counter.json');
        console.log("Looking for contract at:", contractPath);
        const contractData = await fs.readJson(contractPath);
        console.log("Contract data found:", {
            hasAbi: !!contractData.abi,
            hasBytecode: !!contractData.bytecode,
            bytecodeLength: contractData.bytecode?.length
        });
        res.json(contractData);
    } catch (error) {
        console.error("Error reading contract:", error);
        res.status(500).json({ error: 'Failed to fetch contract data' });
    }
});

app.post('/api/verify', async (req, res) => {
    try {
        const { contractAddress, constructorArgs } = req.body;

        console.log("\n=== Starting Verification Process ===");
        console.log("📍 Contract Address:", contractAddress);
        console.log("📍 Constructor Args:", constructorArgs);

        // Use the Hardhat Runtime Environment (hre)
        const hre = require("hardhat");

        // Log the current network
        console.log("Current network:", hre.network.name);

        // Run the verification
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: constructorArgs
        });

        res.json({
            success: true,
            message: 'Contract verified successfully'
        });

    } catch (error) {
        console.error("\n=== Verification Error Details ===");
        console.error("❌ Error:", error);

        // Handle "already verified" case
        if (error.message.includes('Already Verified')) {
            res.json({
                success: true,
                message: 'Contract already verified'
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Verification failed'
        });
    }
});

// @crucial endpoint to trigger compilation from frontend
app.post('/api/compile', async (req, res) => {
    try {
        console.log("\n=== Starting Contract Compilation ===");

        // Delete artifacts folder
        const artifactsPath = path.resolve(__dirname, 'artifacts');
        await fs.remove(artifactsPath);
        console.log("✅ Artifacts folder deleted");

        // Compile contracts
        const hre = require("hardhat");
        await hre.run("compile", { force: true });
        console.log("✅ Contracts compiled successfully");

        res.json({ success: true, message: 'Compilation successful' });
    } catch (error) {
        console.error("❌ Compilation failed:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.use((req, res) => {
    console.log('404 - Route not found:', req.url);
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});