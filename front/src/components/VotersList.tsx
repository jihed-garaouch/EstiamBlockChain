import { useEffect, useMemo, useState } from "react";
import { publicClient, VOTE_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const short = (addr: string) => addr.slice(0, 6) + "…" + addr.slice(-4);

type Row = { voter: `0x${string}`; candidateId: bigint; candidateName: string };

export default function VotersList() {
    const [rows, setRows] = useState<Row[]>([]);

    const votedEvent = useMemo(() => ({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: VOTE_ABI,
        eventName: "Voted" as const
    }), []);

    useEffect(() => {
        (async () => {
            const [names] = await publicClient.readContract({
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: VOTE_ABI,
                functionName: "getResults",
            }) as [string[], bigint[]];

            const logs = await publicClient.getLogs({
                ...votedEvent,
                fromBlock: 0n,
                toBlock: "latest",
            });

            const parsed: Row[] = logs.map((l) => {
                const voter = l.args?.voter as `0x${string}`;
                const candidateId = l.args?.candidateId as bigint;
                const candidateName = names[Number(candidateId)] ?? `#${candidateId.toString()}`;
                return { voter, candidateId, candidateName };
            });

            setRows(parsed);
        })();
    }, [votedEvent]);

    return (
        <Card className="max-w-lg w-full">
            <CardHeader><CardTitle>Voters</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                {rows.length === 0 && <div className="text-sm text-muted-foreground">No votes yet.</div>}
                {rows.map((r, i) => (
                    <div key={`${r.voter}-${i}`} className="flex items-center justify-between text-sm">
                        <span className="font-mono">{short(r.voter)}</span>
                        <span className="opacity-70">→</span>
                        <span className="font-medium">{r.candidateName}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
