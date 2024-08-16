import TransactionDashboard from "@/components/TransactionDashboard/TransactionDashboard";

export default function TransactionPage({ params }) {
  return (
    <main>
      <TransactionDashboard txHash={params.txHash} />
    </main>
  );
}