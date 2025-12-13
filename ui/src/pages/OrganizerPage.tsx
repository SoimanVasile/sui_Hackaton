import { useState } from "react";
import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID } from "../constants";

export function OrganizerPage() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [target, setTarget] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateCampaign = () => {
    if (!account) return alert("Connect Wallet first");

    setIsSubmitting(true);
    const tx = new Transaction();

    const targetInMist = BigInt(parseFloat(target) * 1_000_000_000);

    tx.moveCall({
      target: `${PACKAGE_ID}::charity::create_campaign`,
      arguments: [
        tx.pure.string(name),
        tx.pure.string(desc),
        tx.pure.u64(targetInMist),
        tx.pure.string(imageUrl),
      ],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => {
          alert("Campaign Created Successfully!");
          setIsSubmitting(false);
          // Clear form
          setName(""); setDesc(""); setTarget("");
        },
        onError: (err) => {
          console.error(err);
          alert("Failed to create campaign.");
          setIsSubmitting(false);
        }
      }
    );
  };

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Organizer Dashboard</h1>
          <p className="text-gray-500">Please connect your wallet to manage campaigns.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Charity Campaign</h1>
        <p className="text-lg text-gray-500">
          Launch a new fundraising campaign. Donors will receive the NFT image you provide below.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
        <div className="grid gap-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all outline-none"
              placeholder="e.g. Save the Rainforest"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Fundraising Goal (SUI)</label>
            <input 
              type="number" 
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all outline-none"
              placeholder="e.g. 1000"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all outline-none h-32"
              placeholder="Tell donors what this money will do..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">NFT Badge Image URL</label>
            <input 
              type="text" 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all outline-none"
              placeholder="https://..."
            />
            {imageUrl && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl flex items-center gap-4">
                <img src={imageUrl} alt="Preview" className="w-16 h-16 rounded-lg object-cover bg-gray-200" />
                <span className="text-sm text-gray-500">This is the badge donors will receive.</span>
              </div>
            )}
          </div>

          <button
            onClick={handleCreateCampaign}
            disabled={isSubmitting || !name || !target}
            className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isSubmitting ? "Creating Campaign..." : "Launch Campaign"}
          </button>

        </div>
      </div>
    </div>
  );
}
