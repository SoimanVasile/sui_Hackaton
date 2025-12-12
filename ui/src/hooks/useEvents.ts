import { EVENTS } from "../data"; // Importing the dummy data from step 1

export function useEvents() {
  // RIGHT NOW: We return static dummy data.
  // FUTURE: We can use useSuiClientQuery here to fetch real events.
  
  return {
    events: EVENTS,
    isLoading: false,
    error: null
  };
}
