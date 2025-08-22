import VoteForm from "@/components/VoteForm";
import Results from "@/components/Result";
import VotersList from "@/components/VotersList";

export default function App() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6">
            <h1 className="text-2xl font-bold">Voting DApp (Local)</h1>
            <VoteForm />
            <Results />
            <VotersList />
            <p className="text-xs text-muted-foreground">
                One vote per address. Switch MetaMask account to simulate voters.
            </p>
        </div>
    );
}
