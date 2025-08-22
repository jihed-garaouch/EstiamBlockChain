
const hre = require("hardhat");

async function main() {

    const [owner, voter1, voter2] = await hre.ethers.getSigners();


    const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const Vote = await hre.ethers.getContractFactory("Vote");
    const vote = Vote.attach(CONTRACT_ADDRESS);

    console.log("Using contract at:", CONTRACT_ADDRESS);

    // Vérifier le titre
    const title = await vote.title();
    console.log("Election title:", title);

    // Vérifier candidats
    const count = await vote.candidatesCount();
    console.log("Number of candidates:", count.toString());

    for (let i = 0; i < count; i++) {
        const name = await vote.candidates(i);
        console.log(`Candidate ${i}: ${name}`);
    }

    // Simuler les votes
    console.log("\n--- Casting votes ---");
    await vote.connect(voter1).vote(0);
    await vote.connect(voter2).vote(1);
    console.log("Votes submitted.\n");

    // Lire les résultats
    const results = await vote.getResults();
    const names = results[0];
    const counts = results[1];

    console.log("--- Results ---");
    names.forEach((n, i) => {
        console.log(`${n}: ${counts[i].toString()} vote(s)`);
    });
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
