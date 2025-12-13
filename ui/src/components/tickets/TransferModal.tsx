import { useState } from "react";
import { X, Send, Loader2, User } from "lucide-react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

interface TransferModalProps {
  ticketId: string;
  ticketTitle: string;
  onClose: () => void;
}

export function TransferModal({ ticketId, ticketTitle, onClose }: TransferModalProps) {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [recipient, setRecipient] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTransfer = () => {
    // Basic validation
    if (!recipient.startsWith("0x") || recipient.length < 60) {
      alert("Please enter a valid Sui address (starts with 0x...)");
      return;
    }

    setIsProcessing(true);
    const tx = new Transaction();

    // --- THE TRANSFER LOGIC ---
    // In Sui, transferring an object is a native command.
    tx.transferObjects(
      [tx.object(ticketId)],     // 1. Which Object? (The Ticket)
      tx.pure.address(recipient) // 2. To Whom? (The Recipient)
    );

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => {
          console.log("Transfer success:", result);
          alert(`Success! Ticket sent to ${recipient.slice(0,6)}...`);
          setIsProcessing(false);
          onClose();
          // Optional: Reload page to show it's gone
          window.location.reload(); 
        },
        onError: (err) => {
          console.error("Transfer failed:", err);
          alert("Transfer failed. Please check the address.");
          setIsProcessing(false);
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-brand-600 p-6 flex justify-between items-center text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Send size={20} /> Send Ticket
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-6 text-center">
             <p className="text-gray-500 mb-2">You are sending:</p>
             <p className="font-bold text-gray-900 text-lg">{ticketTitle}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Recipient Address</label>
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                <User className="text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="0x..." 
                  className="bg-transparent outline-none flex-1 font-mono text-sm text-gray-900"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={handleTransfer}
              disabled={isProcessing || !recipient}
              className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" /> Sending...
                </>
              ) : (
                "Confirm Transfer"
              )}
            </button>
            
            <p className="text-xs text-center text-gray-400">
              Warning: This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
