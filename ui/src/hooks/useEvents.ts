import { useSuiClient } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { PACKAGE_ID } from "../constants";

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  img: string;
  category: string;
  date: string;
}

export function useEvents() {
  const client = useSuiClient();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // 1. Listen for "EventCreated" events emitted by your contract
        const eventsQuery = await client.queryEvents({
            query: {
                MoveModule: { 
                    package: PACKAGE_ID, 
                    module: "ticket_nft" 
                }
            }
        });

        // 2. Filter for the specific event type
        const createdEvents = eventsQuery.data.filter(e => e.type.includes("::EventCreated"));
        
        // 3. Get the Object IDs from the events
        // @ts-ignore
        const objectIds = createdEvents.map(e => (e.parsedJson as any).event_id);

        if (objectIds.length > 0) {
            // 4. Fetch the actual Event Objects to get details (image, price, etc)
            const objects = await client.multiGetObjects({
                ids: objectIds,
                options: { showContent: true }
            });

            const parsedEvents = objects.map((obj) => {
                // @ts-ignore
                const fields = obj.data?.content?.fields;
                if (!fields) return null;

                return {
                    id: obj.data?.objectId || "",
                    title: fields.name, // The contract uses 'name'
                    description: fields.description,
                    location: fields.location,
                    price: Number(fields.price) / 1_000_000_000, // Convert MIST to SUI
                    img: fields.image_url,
                    category: "Music/Arts", // You can add a category field to your contract later if needed
                    date: "Coming Soon" 
                };
            }).filter((e): e is Event => e !== null);

            setEvents(parsedEvents);
        } else {
            setEvents([]);
        }

      } catch (e) {
        console.error("Error fetching live events:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [client]);

  return { events, isLoading };
}
