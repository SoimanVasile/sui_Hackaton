import { useState, useEffect } from "react";
import { EVENTS_DATA } from "../data/eventsData"; // Import from the shared file

export function useEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(EVENTS_DATA); // Use the shared data
      setIsLoading(false);
    }, 1000);
  }, []);

  return { events, isLoading };
}
