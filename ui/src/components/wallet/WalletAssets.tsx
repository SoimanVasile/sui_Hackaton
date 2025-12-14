import { Image, ExternalLink } from "lucide-react";


interface WalletAssetsProps {
  tickets: any[];
}

export function WalletAssets({ tickets }: WalletAssetsProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Image size={20} className="text-brand-500"/>
          Digital Assets (NFTs)
        </h3>
        <span className="text-sm text-gray-400">{tickets.length} Items</span>
      </div>

      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map((nft) => (
            <div key={nft.id} className="border border-gray-100 rounded-2xl p-3 flex gap-4 hover:shadow-md transition-shadow cursor-pointer group">
              
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative">
                <img 
                  src={nft.img.replace("ipfs://", "https://ipfs.io/ipfs/")} 
                  alt={nft.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => e.currentTarget.src = "https://via.placeholder.com/150"}
                />
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{nft.title}</h4>
                <p className="text-xs text-brand-600 font-bold uppercase mt-1">{nft.category}</p>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-mono border border-gray-200">
                    {nft.tokenId.slice(0, 6)}...
                  </span>
                  <ExternalLink size={14} className="text-gray-300 hover:text-brand-500 transition-colors"/>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          No NFTs found in this wallet.
        </div>
      )}
    </div>
  );
}
