import { useCurrentAccount, useSuiClientQuery, useSuiClient } from "@mysten/dapp-kit";
import { PACKAGE_ID } from "../constants";
import { useEffect, useState } from "react";

export interface Item {
  id: string;
  name: string;
  description: string;
  image: string;
  type: "Ticket" | "Badge";
  campaignId?: string;
  amount?: number;
  tier?: string;
  isUsed?: boolean;
}

export function useUserTickets() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [tickets, setTickets] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Luăm Badge-urile (Acestea au rămas Owned Objects în charity module)
  const { data: ownedData, isLoading: isOwnedLoading } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      options: { showContent: true, showType: true },
      filter: { StructType: `${PACKAGE_ID}::charity::Badge` }
    },
    { enabled: !!account }
  );

  // 2. Luăm Biletele (Shared Objects)
  useEffect(() => {
    const fetchSharedTickets = async () => {
      if (!account) return;
      setIsLoading(true);

      try {
        // A. Căutăm toate biletele create vreodată (TicketMinted)
        // Într-o aplicație reală, ai folosi un Indexer API, dar pentru hackathon merge queryEvents
        const events = await client.queryEvents({
            query: { MoveModule: { package: PACKAGE_ID, module: "ticket_nft" } },
            limit: 50, // Poți mări limita
            order: "descending"
        });

        const ticketIds = new Set<string>();

        // Filtrăm evenimentele relevante
        events.data.forEach((e) => {
             // @ts-ignore
             if (e.type.includes("TicketMinted")) ticketIds.add(e.parsedJson.ticket_id);
        });

        if (ticketIds.size === 0) {
            setTickets([]);
            setIsLoading(false);
            return;
        }

        // B. Luăm detaliile obiectelor
        const objects = await client.multiGetObjects({
            ids: Array.from(ticketIds),
            options: { showContent: true }
        });

        // C. Filtrăm doar biletele unde 'owner' == account.address
        const mySharedTickets = objects
            .map(obj => {
                // @ts-ignore
                const fields = obj.data?.content?.fields;
                if (!fields) return null;
                
                // Verificăm dacă eu sunt proprietarul din câmpul 'owner'
                if (fields.owner !== account.address) return null;

                return {
                    id: obj.data?.objectId || "",
                    name: fields.name,
                    description: fields.description,
                    image: fields.url || "https://placehold.co/100",
                    type: "Ticket" as const,
                    isUsed: fields.is_used
                };
            })
            .filter((t): t is Item => t !== null);

        setTickets(mySharedTickets);

      } catch (err) {
        console.error("Failed to fetch tickets", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedTickets();
  }, [account, client]);

  // 3. Combinăm Badge-urile (Owned) cu Biletele (Shared)
  const badges: Item[] = ownedData?.data?.map(obj => {
      // @ts-ignore
      const fields = obj.data?.content?.fields;
      const amountSui = Number(fields.amount_donated) / 1_000_000_000;
      let tier = "Bronze Helper";
      if (amountSui >= 0.4) tier = "Gold Philanthropist";
      else if (amountSui >= 0.1) tier = "Silver Supporter";

      return {
          id: obj.data?.objectId || "",
          name: fields.campaign_name,
          description: `${tier} - Donated ${amountSui} SUI`,
          image: fields.image_url,
          type: "Badge",
          amount: amountSui,
          campaignId: fields.campaign_id,
          tier: tier
      };
  }) || [];

  return { 
      tickets: [...badges, ...tickets], 
      isLoading: isLoading || isOwnedLoading 
  };
}
