import { EventCard } from "./EventCard";

interface EventGridProps {
  events: any[];
  isLoading: boolean;
  onAdd: (event: any) => void;
}

export function EventGrid({ events, isLoading, onAdd }: EventGridProps) {
  if (isLoading) {
    return <div className="text-center py-20 text-gray-400">Loading events...</div>;
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
        <p className="text-gray-400 text-lg">No events found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((evt) => (
        <EventCard 
          key={evt.id} 
          event={evt} 
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}
