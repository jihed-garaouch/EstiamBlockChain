// scripts/deploy.js
const hre = require("hardhat");

async function main() {
    const title = "Election Délégué - Promo 2025";
    const candidates = ["Alice", "Bob", "Charlie"];

    const Vote = await hre.ethers.getContractFactory("Vote");
    const vote = await Vote.deploy(title, candidates);

    // Ethers v6:
    await vote.waitForDeployment();

    const address = await vote.getAddress();
    console.log("Vote contract deployed to:", address);

    const count = await vote.candidatesCount();
    console.log("Candidates count:", count.toString());

    const theTitle = await vote.title();
    console.log("Title:", theTitle);
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
