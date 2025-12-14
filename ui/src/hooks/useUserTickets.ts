import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { PACKAGE_ID } from "../constants";

export interface Item {
  id: string;
  name: string;
  description: string;
  image: string;
  type: "Ticket" | "Badge";
  campaignId?: string;
  amount?: number;
  tier?: string;
}

export function useUserTickets() {
  const account = useCurrentAccount();
  
  const { data, isLoading, error } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      options: { showContent: true, showType: true },
    },
    { enabled: !!account, refetchInterval: 5000 }
  );

  if (!data || !data.data) return { tickets: [], isLoading: false };

  const items: Item[] = data.data
    .map((obj) => {
      const type = obj.data?.type;
      const fields = obj.data?.content?.fields;

      if (!type || !fields) return null;

      if (type.includes(`${PACKAGE_ID}::ticket_nft::Ticket`)) {
        return {
          id: obj.data?.objectId || "",
          name: fields.name,
          description: fields.description,
          image: fields.url || "https://placehold.co/100",
          type: "Ticket",
        };
      }

      if (type.includes(`${PACKAGE_ID}::charity::Badge`)) {
        const amountSui = Number(fields.amount_donated) / 1_000_000_000;
        
        let tier = "Bronze Helper";
        if (amountSui >= 0.4) {
            tier = "Gold Philanthropist";
        } else if (amountSui >= 0.1) {
            tier = "Silver Supporter";
        }

        return {
          id: obj.data?.objectId || "",
          name: fields.campaign_name || "Charity Badge",
          description: `${tier} - Donated ${amountSui} SUI`,
          image: fields.image_url,
          type: "Badge",
          amount: amountSui,
          campaignId: fields.campaign_id,
          tier: tier,
        };
      }

      return null;
    })
    .filter((item): item is Item => item !== null);

  return { tickets: items, isLoading, error };
}
