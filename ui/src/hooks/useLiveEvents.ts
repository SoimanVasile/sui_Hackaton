import { useSuiClient } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { PACKAGE_ID, MODULE_NAME } from "../constants";

export interface LiveEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  img: string;
  category: string;
  date: string;
}

export function useLiveEvents() {
  const client = useSuiClient();
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        
        const eventsQuery = await client.queryEvents({
            query: {
                MoveModule: { 
                    package: PACKAGE_ID, 
                    module: "ticket_nft" 
                }
            }
        });

        const createdEvents = eventsQuery.data.filter(e => e.type.includes("::EventCreated"));
        
        const objectIds = createdEvents.map(e => (e.parsedJson as any).event_id);

        if (objectIds.length > 0) {
            const objects = await client.multiGetObjects({
                ids: objectIds,
                options: { showContent: true }
            });

            const parsedEvents = objects.map((obj) => {
                const fields = (obj.data?.content as any)?.fields;
                if (!fields) return null;

                return {
                    id: obj.data?.objectId || "",
                    title: fields.name,
                    description: fields.description,
                    location: fields.location,
                    price: Number(fields.price) / 1_000_000_000,
                    img: fields.image_url,
                    category: "Music/Arts",
                    date: "Coming Soon"
                };
            }).filter((e): e is LiveEvent => e !== null);

            setLiveEvents(parsedEvents);
        }

      } catch (e) {
        console.error("Error fetching live events:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [client]);

  return { liveEvents, isLoading };
}
