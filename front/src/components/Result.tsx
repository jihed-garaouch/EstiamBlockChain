import { useEffect, useState } from "react";
import { publicClient, VOTE_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Result = { name: string; count: bigint };

export default function Results() {
    const [title, setTitle] = useState("");
    const [data, setData] = useState<Result[]>([]);

    useEffect(() => {
        (async () => {
            const t = await publicClient.readContract({
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: VOTE_ABI,
                functionName: "title",
            }) as string;
            setTitle(t);

            const [names, counts] = await publicClient.readContract({
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: VOTE_ABI,
                functionName: "getResults",
            }) as [string[], bigint[]];

            setData(names.map((n, i) => ({ name: n, count: counts[i] })));
        })();
    }, []);

    const total = data.reduce((s, r) => s + Number(r.count), 0);

    return (
        <Card className="max-w-lg w-full">
            <CardHeader><CardTitle>Results — {title}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                {data.map(r => (
                    <div key={r.name}>
                        <div className="flex justify-between text-sm">
                            <span>{r.name}</span>
                            <span>{r.count.toString()}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded">
                            <div className="h-2 bg-gray-800 rounded" style={{ width: total ? `${(Number(r.count)/total)*100}%` : "0%" }} />
                        </div>
                        <Separator className="my-2" />
                    </div>
                ))}
                <div className="text-xs text-muted-foreground">Total votes: {total}</div>
            </CardContent>
        </Card>
    );
}
