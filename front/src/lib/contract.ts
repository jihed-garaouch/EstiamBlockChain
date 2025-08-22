
import {createPublicClient, createWalletClient, http, custom, defineChain} from "viem";


export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const HARDHAT_31337 = defineChain({
    id: 31337,
    name: "Hardhat",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: ["http://127.0.0.1:8545"] } },
});
export const VOTE_ABI = [
    { "inputs":[{"internalType":"string","name":"_title","type":"string"},{"internalType":"string[]","name":"_candidates","type":"string[]"}],"stateMutability":"nonpayable","type":"constructor" },
    { "inputs":[{"internalType":"uint256","name":"candidateId","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function" },
    { "inputs":[],"name":"title","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function" },
    { "inputs":[],"name":"candidatesCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function" },
    { "inputs":[],"name":"getResults","outputs":[{"internalType":"string[]","name":"names","type":"string[]"},{"internalType":"uint256[]","name":"counts","type":"uint256[]"}],"stateMutability":"view","type":"function" },
    { "inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"candidates","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function" },
    { "inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"votes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function" },
    { "inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasVoted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function" },
    // Event to list who voted for whom
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "voter", "type": "address" },
            { "indexed": true, "internalType": "uint256", "name": "candidateId", "type": "uint256" }
        ],
        "name": "Voted",
        "type": "event"
    }
];

export const publicClient = createPublicClient({
    chain: HARDHAT_31337,
    transport: http("http://127.0.0.1:8545"),
});

export const walletClient = (() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
        return createWalletClient({
            chain: HARDHAT_31337,
            transport: custom((window as any).ethereum),
        });
    }
    return null;
})();
