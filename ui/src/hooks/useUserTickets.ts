import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";

export interface TicketNFT {
  id: string;
  title: string;
  category: string;
  img: string;
  tokenId: string;
  description: string;
  price: number; // Guaranteed to be a number (0 or the real price)
}

export function useUserTickets() {
  const account = useCurrentAccount();

  const { data, isPending, error, refetch } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      options: {
        showDisplay: true,   // Try to fetch standard metadata
        showContent: true,   // Fetch raw smart contract fields (where price is stored)
      },
    },
    {
      enabled: !!account,
      refetchInterval: 5000, // Auto-refresh every 5 seconds
    }
  );

  const tickets: TicketNFT[] = data?.data
    .map((obj) => {
      const display = obj.data?.display?.data;
      const rawFields = obj.data?.content?.fields;

      if (!display && !rawFields) return null;

      let priceSui = 0;

    console.log("Ticket price (SUI):", priceSui);
      
      try {
          
    if (rawFields?.price) {
      priceSui = Number(rawFields.price) / 1_000_000_000;
    }
      } catch (e) {
          // If the price field is missing, invalid, or conversion fails, priceSui remains 0.
          console.warn("Could not read NFT price field or conversion failed:", e);
          priceSui = 0;
      }
      // --- END CRITICAL PRICE LOGIC ---


      // Extract Text Fields (Prefer Display, fallback to Raw)
      const title = display?.name || rawFields?.name || "Unknown Ticket";
      const description = display?.description || rawFields?.description || "No description";
      const img = display?.image_url || rawFields?.url || "https://via.placeholder.com/150";

      return {
        id: obj.data?.objectId || "",
        tokenId: obj.data?.objectId || "",
        title: title,
        category: "Collectible",
        img: img,
        description: description,
        price: priceSui, // Guaranteed number
      };
    })
    .filter((t): t is TicketNFT => t !== null) || [];

  return { tickets, isLoading: isPending, error, refetch };
}
