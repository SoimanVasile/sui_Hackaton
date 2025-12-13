export const EVENTS_DATA = [
  {
    id: 1,
    title: "Sui Builder House",
    category: "Workshop",
    date: "March 15, 2024",
    loc: "Paris, France",
    price: 0.01,
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000",
  },
  {
    id: 2,
    title: "VIP Tech Summit",
    category: "Conference",
    date: "April 10, 2024",
    loc: "London, UK",
    price: 0.1,
    img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=2000",
  },
  {
    id: 3,
    title: "Global Hackathon",
    category: "Competition",
    date: "May 20, 2024",
    loc: "Online",
    price: 0.02,
    img: "https://images.unsplash.com/photo-1504384308090-c54be3855463?auto=format&fit=crop&q=80&w=2000",
  },
];

export function getRealPrice(title: string): number {
  const event = EVENTS_DATA.find(e => e.title === title);
  return event ? event.price : 10;
}
