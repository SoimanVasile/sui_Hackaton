import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";

export interface TicketNFT {
  id: string;
  title: string;
  category: string;
  img: string;
  tokenId: string;
  description: string;
}

export function useUserTickets() {
  const account = useCurrentAccount();

  const { data, isPending, error } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      options: {
        showDisplay: true, // IMPORTANT: Requests the Name and Image URL
        showType: true,
        showContent: true,
      },
    },
    {
      enabled: !!account, // Only fetch if wallet is connected
    }
  );

  // Transform raw blockchain data into our nice "Ticket" format
  const tickets: TicketNFT[] = data?.data
    .filter((obj) => obj.data?.display?.data) // Keep only objects with images/display
    .map((obj) => {
      const display = obj.data?.display?.data;
      return {
        id: obj.data?.objectId || "",
        tokenId: obj.data?.objectId || "",
        title: display?.name || "Unknown NFT",
        category: "Collectible", // Default category since standard NFTs might not have this field
        img: display?.image_url || "https://via.placeholder.com/150", // Fallback image
        description: display?.description || "No description",
      };
    }) || [];

  return { tickets, isLoading: isPending, error };
}
