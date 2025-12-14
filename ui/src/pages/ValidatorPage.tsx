import { useState } from "react";
import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID } from "../constants";
import { ScanLine, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function ValidatorPage() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [ticketId, setTicketId] = useState("");
  const [eventId, setEventId] = useState("");
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');

  // NOTE: Ideally, you fetch the events YOU own here to populate a dropdown for 'eventId'.
  // For this simple version, we will ask the organizer to input the Event ID too.

  const handleValidate = () => {
    if (!ticketId || !eventId) return;
    setStatus('scanning');

    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::ticket_nft::validate_ticket`,
      arguments: [
        tx.object(ticketId), // The Ticket scanned from QR
        tx.object(eventId)   // The Event object ID (Organizer must know this)
      ],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => {
          setStatus('success');
          alert("TICKET VALID! Entry authorized.");
        },
        onError: (err) => {
          console.error(err);
          setStatus('error');
          alert("INVALID TICKET or WRONG EVENT.");
        }
      }
    );
  };

  if (!account) return <div className="text-center p-20">Please connect wallet.</div>;

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
          <ScanLine size={32} />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Ticket Validator</h1>
        <p className="text-gray-500 mb-8">Scan QR codes to validate entry.</p>

        <div className="space-y-4 text-left">
          <div>
            <label className="text-sm font-bold text-gray-700 ml-1">Event Object ID</label>
            <input 
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
              placeholder="0x... (The Event ID)"
              value={eventId}
              onChange={e => setEventId(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 ml-1">Ticket Object ID (Scan QR)</label>
            <input 
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
              placeholder="0x... (From User QR)"
              value={ticketId}
              onChange={e => setTicketId(e.target.value)}
            />
          </div>

          <button 
            onClick={handleValidate}
            disabled={status === 'scanning' || !ticketId || !eventId}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              status === 'success' ? 'bg-green-500 text-white' :
              status === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {status === 'scanning' ? <Loader2 className="animate-spin" /> : 
             status === 'success' ? <><CheckCircle2 /> Validated</> : 
             status === 'error' ? <><XCircle /> Failed</> : 
             "Validate Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}
