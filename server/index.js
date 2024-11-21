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


app.get('/api/contract', async (req, res) => {
    try {
        const contractPath = path.resolve(__dirname, 'build', 'Counter.json');
        const contractData = await fs.readJson(contractPath);
        res.json(contractData);
    } catch (error) {
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

app.use((req, res) => {
    console.log('404 - Route not found:', req.url);
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});