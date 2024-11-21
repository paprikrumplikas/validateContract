const hre = require("hardhat");

async function main() {
    try {
        // Compile using Hardhat
        console.log("Compiling contracts with Hardhat...");
        await hre.run("compile", { force: true });
        console.log("Contract compiled successfully!");
    } catch (error) {
        console.error("Compilation failed:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
