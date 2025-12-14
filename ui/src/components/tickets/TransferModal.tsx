import { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { PACKAGE_ID } from "../../constants"; // Import ID

interface TransferModalProps {
  ticketId: string;
  ticketTitle: string;
  onClose: () => void;
}

export function TransferModal({ ticketId, ticketTitle, onClose }: TransferModalProps) {
  const [recipient, setRecipient] = useState("");
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [isLoading, setIsLoading] = useState(false);

  const handleTransfer = () => {
    if (!recipient.startsWith("0x")) return alert("Invalid address");
    setIsLoading(true);

    const tx = new Transaction();

    // ✅ MODIFICARE: Folosim funcția custom 'transfer_ticket'
    tx.moveCall({
      target: `${PACKAGE_ID}::ticket_nft::transfer_ticket`,
      arguments: [
        tx.object(ticketId),
        tx.pure.address(recipient)
      ],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => {
          alert("Transfer Successful!");
          setIsLoading(false);
          onClose();
          window.location.reload(); // Refresh pentru a actualiza lista
        },
        onError: (e) => {
          console.error(e);
          alert("Transfer Failed");
          setIsLoading(false);
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full relative animate-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold mb-1">Transfer Ticket</h3>
        <p className="text-sm text-gray-500 mb-6">Send <b>{ticketTitle}</b> to a friend.</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase ml-1">Recipient Address</label>
            <input 
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none font-mono text-sm"
              placeholder="0x..."
            />
          </div>

          <button 
            onClick={handleTransfer}
            disabled={isLoading || !recipient}
            className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Ticket</>}
          </button>
        </div>
      </div>
    </div>
  );
}
