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

    // Update deployCounter to use the fetched data
    const deployCounter = async (startingValue) => {
        try {
            if (!sdk) throw new Error('SDK not initialized');
            if (!contractData) throw new Error('Contract data not loaded');

            // Ensure bytecode has 0x prefix
            const bytecodeWithPrefix = contractData.bytecode.startsWith('0x')
                ? contractData.bytecode
                : `0x${contractData.bytecode}`;

            // Try passing parameters directly instead of as an object
            const contractAddress = await sdk.deployer.deployContractWithAbi(
                contractData.abi,
                bytecodeWithPrefix,
                [startingValue]
            );

            console.log("Contract deployed at:", contractAddress);
            return contractAddress;
        } catch (error) {
            console.error("Deployment error:", error);
            toast.error("Failed to deploy contract");
            throw error;
        }
    };

    useEffect(() => {
        checkIfWalletConnected();
        fetchContractData(); // Add this to load contract data when component mounts
    }, [address]);

    return (
        <StateContext.Provider
            value={{
                address,
                connect,
                deployCounter,
            }}
        >
            <ToastContainer />
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);
