module suihackaton::ticket_nft {
    use sui::url::{Self, Url};
    use std::string::{Self, String};
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;

    public struct Event has key, store {
        id: UID,
        organizer: address,
        name: String,
        description: String,
        location: String, 
        price: u64,
        image_url: String,
    }

    public struct Ticket has key, store {
        id: UID,
        event_id: ID,
        name: String,
        description: String,
        url: Url,
    }

    public struct EventCreated has copy, drop {
        event_id: ID,
        organizer: address,
        name: String,
    }

    public struct TicketMinted has copy, drop {
        ticket_id: ID,
        event_id: ID,
        buyer: address
    }

    public entry fun create_event(
        name: vector<u8>,
        description: vector<u8>,
        location: vector<u8>,
        price: u64,
        image_url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let id = object::new(ctx);
        let event_id = object::uid_to_inner(&id);

        let new_event = Event {
            id,
            organizer: sender,
            name: string::utf8(name),
            description: string::utf8(description),
            location: string::utf8(location),
            price, 
            image_url: string::utf8(image_url),
        };

        transfer::share_object(new_event);

        event::emit(EventCreated {
            event_id,
            organizer: sender,
            name: string::utf8(name),
        });
    }

    public entry fun buy_ticket(
        event_obj: &Event,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let price = event_obj.price;
        let value_paid = coin::value(&payment);
        
        assert!(value_paid == price, 0);

        transfer::public_transfer(payment, event_obj.organizer);

        let sender = tx_context::sender(ctx);
        
        let ticket = Ticket {
            id: object::new(ctx),
            event_id: object::id(event_obj),
            name: event_obj.name,
            description: event_obj.description,
            url: url::new_unsafe_from_bytes(*string::bytes(&event_obj.image_url)),
        };

        let ticket_id = object::uid_to_inner(&ticket.id);

        event::emit(TicketMinted {
            ticket_id,
            event_id: object::id(event_obj),
            buyer: sender,
        });

        transfer::public_transfer(ticket, sender);
    }
}
