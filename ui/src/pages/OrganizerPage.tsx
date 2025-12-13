import { useState } from "react";
import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, REGISTRY_ID, ORGANIZER_ADDRESS } from "../constants"; 
import { Loader2, ShieldAlert, Image as ImageIcon, Ticket, Heart } from "lucide-react";
import { ImageUploader } from "../components/organizer/ImageUploader";
import { CampaignForm } from "../components/organizer/CampaignForm";

export function OrganizerPage() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [activeTab, setActiveTab] = useState<'charity' | 'event'>('charity');

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  const [target, setTarget] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!account) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <ImageIcon className="text-gray-400 w-16 h-16 mb-2" />
      <h1 className="text-2xl font-bold">Organizer Dashboard</h1>
      <p className="text-gray-500">Conectează portofelul pentru acces.</p>
    </div>
  );

  if (account.address !== ORGANIZER_ADDRESS) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <ShieldAlert className="text-red-500 w-20 h-20" />
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Acces Interzis</h1>
        <p className="text-gray-500 mt-2">Doar organizatorul autorizat poate vedea această pagină.</p>
      </div>
    </div>
  );

  const handleSubmit = () => {
    setIsSubmitting(true);
    try {
        const tx = new Transaction();
        
        if (activeTab === 'charity') {
            // --- LOGIC FOR CHARITY ---
            if (!REGISTRY_ID) throw new Error("REGISTRY_ID lipsă.");
            const targetVal = parseFloat(target);
            if (isNaN(targetVal) || targetVal <= 0) throw new Error("Țintă invalidă");
            
            tx.moveCall({
              target: `${PACKAGE_ID}::charity::create_campaign`,
              arguments: [
                tx.object(REGISTRY_ID),
                tx.pure.string(name),
                tx.pure.string(desc),
                tx.pure.u64(BigInt(Math.floor(targetVal * 1_000_000_000))),
                tx.pure.string(imageUrl),
              ],
            });

        } else {
            const priceVal = parseFloat(price);
            if (isNaN(priceVal) || priceVal < 0) throw new Error("Preț invalid");

            tx.moveCall({
              target: `${PACKAGE_ID}::ticket_nft::create_event`,
              arguments: [
                tx.pure.string(name),
                tx.pure.string(desc),
                tx.pure.string(location || "Online"),
                tx.pure.u64(BigInt(Math.floor(priceVal * 1_000_000_000))),
                tx.pure.string(imageUrl),
              ],
            });
        }

        signAndExecute(
          { transaction: tx },
          {
            onSuccess: () => {
              alert(activeTab === 'charity' ? "Campanie creată!" : "Eveniment creat!");
              setName(""); setDesc(""); setImageUrl("");
              setTarget(""); setPrice(""); setLocation("");
              setIsSubmitting(false); 
            },
            onError: (err) => {
              console.error(err);
              alert("Eroare la tranzacție.");
              setIsSubmitting(false); 
            }
          }
        );
    } catch (e) {
        console.error(e);
        alert("Eroare validare.");
        setIsSubmitting(false); 
    }
  };

  const isFormValid = () => {
      if (!name || !desc || !imageUrl) return false;
      if (activeTab === 'charity') return !!target;
      if (activeTab === 'event') return !!price;
      return false;
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Dashboard Organizator</h1>
        <p className="text-gray-500">Gestionează campanii de caritate și evenimente.</p>
      </div>

      <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
        <button
            onClick={() => setActiveTab('charity')}
            className={`flex-1 py-3 px-6 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'charity' ? 'bg-white shadow text-brand-600' : 'text-gray-500 hover:text-gray-700'
            }`}
        >
            <Heart className="w-4 h-4" />
            Campanie Caritate
        </button>
        <button
            onClick={() => setActiveTab('event')}
            className={`flex-1 py-3 px-6 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'event' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
        >
            <Ticket className="w-4 h-4" />
            Eveniment (Bilete)
        </button>
      </div>

      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl space-y-8">
        <ImageUploader value={imageUrl} onChange={setImageUrl} />
        
        {activeTab === 'charity' ? (
             <CampaignForm name={name} setName={setName} target={target} setTarget={setTarget} desc={desc} setDesc={setDesc} />
        ) : (
            <>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Nume Eveniment</label>
                    <input 
                        type="text" value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium"
                        placeholder="ex. Concert Caritabil"
                    />
                    </div>
                    <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Preț Bilet (SUI)</label>
                    <input 
                        type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium"
                        placeholder="0.5"
                    />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Locație</label>
                    <input 
                        type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium"
                        placeholder="ex. Palatul Culturii / Online"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Descriere</label>
                    <textarea 
                        value={desc} onChange={(e) => setDesc(e.target.value)}
                        className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none h-32 resize-none"
                        placeholder="Detalii despre eveniment..."
                    />
                </div>
            </>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !isFormValid()}
          className={`w-full py-4 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
              activeTab === 'charity' ? 'bg-brand-600 hover:bg-brand-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : (activeTab === 'charity' ? "Lansează Campania" : "Publică Eveniment")}
        </button>
      </div>
    </div>
  );
}
