import { useSuiClientQuery, useSuiClient } from "@mysten/dapp-kit";
import { REGISTRY_ID } from "../constants";
import { useEffect, useState } from "react";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetAmount: number;
  currentRaised: number;
  campaignObjectId: string; 
}

export function useCampaigns() {
  const client = useSuiClient();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: registryData } = useSuiClientQuery(
    "getObject",
    {
      id: REGISTRY_ID,
      options: { showContent: true },
    },
    { refetchInterval: 5000 }
  );

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      const campaignIds = registryData?.data?.content?.fields?.campaigns as string[];

      if (!campaignIds || campaignIds.length === 0) {
        setCampaigns([]);
        setIsLoading(false);
        return;
      }

      try {
        const objects = await client.multiGetObjects({
          ids: campaignIds,
          options: { showContent: true },
        });

        const parsedCampaigns = objects.map((obj) => {
          const rawFields = obj.data?.content?.fields;
          if (!rawFields) return null;

          const targetSui = Number(BigInt(rawFields.target_amount || 0)) / 1_000_000_000;
          const raisedSui = Number(BigInt(rawFields.current_raised || 0)) / 1_000_000_000;

          return {
            id: obj.data?.objectId || "",
            title: rawFields.title, 
            description: rawFields.description,
            imageUrl: rawFields.image_url,
            targetAmount: targetSui,
            currentRaised: raisedSui,
            campaignObjectId: obj.data?.objectId || "",
          };
        }).filter((c): c is Campaign => c !== null);

        setCampaigns(parsedCampaigns);
      } catch (e) {
        console.error("Error fetching campaign details:", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (registryData) {
      fetchCampaignDetails();
    }
  }, [registryData, client]);

  return { campaigns, isLoading };
}
