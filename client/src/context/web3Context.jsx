import React, { useContext, createContext, useEffect, useState } from "react";
import { useAddress, useConnect, useSDK } from "@thirdweb-dev/react";
import { metamaskWallet } from '@thirdweb-dev/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const [contractData, setContractData] = useState(null);
    const address = useAddress();
    const connect = useConnect();
    const sdk = useSDK();

    // Check if MetaMask is installed and connect
    const checkIfWalletConnected = async () => {
        if (!window.ethereum) {
            toast.warn("Please install MetaMask to use this app");
            return;
        }

        if (address) {
            console.log("Wallet already connected");
            return;
        }

        try {
            await connect(metamaskWallet());
            console.log("Wallet connected successfully");
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            toast.error("Failed to connect wallet. Please try again.");
        }
    }

    // Add this function to fetch the contract data
    const fetchContractData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/contract');
            const data = await response.json();
            setContractData(data);
            console.log('Contract data loaded:', data); // To verify the data
        } catch (error) {
            console.error('Failed to fetch contract data:', error);
            toast.error('Failed to fetch contract data');
        }
    };

    // Replace the verifyContract function with this:
    const verifyContract = async (contractAddress, startingValue) => {
        try {
            console.log("\n=== Starting Contract Verification Process ===");
            console.log("📍 Contract Address:", contractAddress);
            console.log("📍 Constructor Args:", [startingValue]);
            console.log("📍 Network: sepolia");

            // Wait for contract propagation
            console.log("\n⏳ Waiting 60 seconds before verification...");
            const startWait = Date.now();
            await new Promise(resolve => setTimeout(resolve, 60000));
            console.log(`✅ Waited ${(Date.now() - startWait) / 1000} seconds`);

            console.log("\n🚀 Sending verification request to backend...");
            const response = await fetch('http://localhost:5000/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contractAddress,
                    constructorArgs: [startingValue],
                    network: 'sepolia'
                })
            });

            console.log("📡 Response status:", response.status);
            const data = await response.json();
            console.log("📡 Response data:", data);

            if (!data.success) {
                console.error("❌ Verification failed with message:", data.message);
                throw new Error(data.message);
            }

            console.log("\n=== Verification Response Details ===");
            console.log("✅ Success:", data.success);
            console.log("✅ Message:", data.message);

            // Create Etherscan link
            const etherscanUrl = `https://sepolia.etherscan.io/address/${contractAddress}#code`;
            console.log("\n🔍 View on Etherscan:", etherscanUrl);

            console.log("\n=== Contract Verified Successfully ===");
            toast.success(
                <div>
                    Contract verified successfully!
                    <br />
                    <a href={etherscanUrl} target="_blank" rel="noopener noreferrer">
                        View on Etherscan
                    </a>
                </div>,
                { autoClose: 8000 }
            );

            return data;
        } catch (error) {
            console.error("\n=== Verification Error Details ===");
            console.error("❌ Error type:", error.constructor.name);
            console.error("❌ Error message:", error.message);
            if (error.response) {
                console.error("❌ Response status:", error.response.status);
                console.error("❌ Response data:", error.response.data);
            }
            console.error("❌ Full error:", error);

            toast.error(`Failed to verify contract: ${error.message}`, {
                autoClose: 8000
            });
            throw error;
        }
    };

    // Update deployCounter to include verification
    const deployCounter = async (startingValue) => {
        try {
            if (!sdk) throw new Error('SDK not initialized');
            if (!contractData) throw new Error('Contract data not loaded');

            console.log("\n=== Starting Contract Deployment ===");
            console.log("📍 Starting Value:", startingValue);

            const bytecodeWithPrefix = contractData.bytecode.startsWith('0x')
                ? contractData.bytecode
                : `0x${contractData.bytecode}`;

            console.log("🚀 Deploying contract...");
            const contractAddress = await sdk.deployer.deployContractWithAbi(
                contractData.abi,
                bytecodeWithPrefix,
                [startingValue]
            );
            console.log("✅ Contract deployed at:", contractAddress);

            // Start verification process
            console.log("\n🔍 Starting verification process...");
            await verifyContract(contractAddress, startingValue);

            return contractAddress;
        } catch (error) {
            console.error("\n=== Deployment Error Details ===");
            console.error("❌ Error:", error);
            toast.error("Failed to deploy contract");
            throw error;
        }
    };

    useEffect(() => {
        checkIfWalletConnected();
        fetchContractData();
    }, [address]);

    return (
        <StateContext.Provider
            value={{
                address,
                connect,
                deployCounter,
                verifyContract,
            }}
        >
            <ToastContainer />
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);
