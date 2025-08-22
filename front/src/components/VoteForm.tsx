import { useEffect, useState } from "react";
import { publicClient, walletClient, VOTE_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function VoteForm() {
    const [account, setAccount] = useState<`0x${string}` | null>(null);
    const [candidates, setCandidates] = useState<string[]>([]);
    const [selected, setSelected] = useState<string>("");

    useEffect(() => {
        (async () => {
            const count = await publicClient.readContract({
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: VOTE_ABI,
                functionName: "candidatesCount",
            }) as bigint;

            const arr: string[] = [];
            for (let i = 0n; i < count; i++) {
                const name = await publicClient.readContract({
                    address: CONTRACT_ADDRESS as `0x${string}`,
                    abi: VOTE_ABI,
                    functionName: "candidates",
                    args: [i],
                }) as string;
                arr.push(name);
            }
            setCandidates(arr);
        })();
    }, []);

    async function connect() {
        if (!walletClient) return alert("Install MetaMask and connect to Localhost 8545");
        const [addr] = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        setAccount(addr);
    }

    async function handleVote() {
        if (!walletClient || !account) return alert("Connect your wallet first");
        const idx = candidates.findIndex(c => c === selected);
        if (idx < 0) return alert("Candidate not found");
        const candidateId = BigInt(idx);

        try {

            const { request } = await publicClient.simulateContract({
                account,
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: VOTE_ABI,
                functionName: "vote",
                args: [candidateId],
            });

            const txHash = await walletClient.writeContract(request);
            alert(`Vote sent! Tx: ${txHash}`);
        } catch (err: any) {
            console.error(err);

            const has = await publicClient.readContract({
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: VOTE_ABI,
                functionName: "hasVoted",
                args: [account],
            });
            const count = await publicClient.readContract({
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: VOTE_ABI,
                functionName: "candidatesCount",
            });
            alert(
                `Vote failed.\n` +
                `Reason likely: ${err?.shortMessage || err?.message}\n` +
                `hasVoted(${account})=${has}\n` +
                `candidatesCount=${count.toString()}`
            );
        }
    }


    return (
        <Card className="max-w-lg w-full">
            <CardHeader><CardTitle>Vote</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                    <Button onClick={connect}>{account ? "Connected" : "Connect MetaMask"}</Button>
                    {account && <span className="text-xs break-all">{account}</span>}
                </div>

                <div className="space-y-2">
                    <Label>Choose a candidate</Label>
                    <Select onValueChange={setSelected}>
                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent>
                            {candidates.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <Button onClick={handleVote} disabled={!selected || !account}>
                    Submit my vote
                </Button>
            </CardContent>
        </Card>
    );
}
