import { useState } from "react";
import { useSignAndExecuteTransaction, useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID } from "../constants";
import { ScanLine, CheckCircle2, XCircle, Loader2, AlertTriangle } from "lucide-react";

export function ValidatorPage() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [ticketId, setTicketId] = useState("");
  const [eventId, setEventId] = useState("");
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error' | 'used'>('idle');

  const handleValidate = async () => {
    if (!ticketId || !eventId) return;
    setStatus('scanning');

    try {
        const object = await client.getObject({
            id: ticketId,
            options: { showContent: true }
        });

        const isAlreadyUsed = object.data?.content?.fields?.is_used;

        if (isAlreadyUsed) {
            setStatus('used');
            return;
        }

        const tx = new Transaction();
        tx.moveCall({
          target: `${PACKAGE_ID}::ticket_nft::validate_ticket`,
          arguments: [
            tx.object(ticketId),
            tx.object(eventId)
          ],
        });

        signAndExecute(
          { transaction: tx },
          {
            onSuccess: () => {
              setStatus('success');
            },
            onError: (err) => {
              console.error(err);
              setStatus('error');
            }
          }
        );
    } catch (e) {
        console.error(e);
        setStatus('error');
    }
  };

  if (!account) return <div className="text-center p-20">Conectează portofelul.</div>;

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors ${
            status === 'success' ? 'bg-green-100 text-green-600' :
            status === 'error' ? 'bg-red-100 text-red-600' :
            status === 'used' ? 'bg-orange-100 text-orange-600' :
            'bg-blue-50 text-blue-600'
        }`}>
          {status === 'success' ? <CheckCircle2 size={32} /> :
           status === 'error' ? <XCircle size={32} /> :
           status === 'used' ? <AlertTriangle size={32} /> :
           <ScanLine size={32} />}
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Ticket Validator</h1>
        <p className="text-gray-500 mb-8">Introdu ID-urile pentru validare.</p>

        <div className="space-y-4 text-left">
          <div>
            <label className="text-sm font-bold text-gray-700 ml-1">Event Object ID</label>
            <input 
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
              placeholder="0x..."
              value={eventId}
              onChange={e => setEventId(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 ml-1">Ticket Object ID</label>
            <input 
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
              placeholder="0x..."
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
              status === 'used' ? 'bg-orange-500 text-white' :
              'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {status === 'scanning' ? <Loader2 className="animate-spin" /> : 
             status === 'success' ? "Bilet Validat!" : 
             status === 'used' ? "Deja Folosit!" :
             status === 'error' ? "Eroare / Invalid" : 
             "Validează Bilet"}
          </button>
        </div>
      </div>
    </div>
  );
}
