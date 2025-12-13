module 0x0::ticket_nft {
    use sui::url::{Self, Url};
    use std::string::{Self, String};
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;

    public struct Ticket has key, store {
        id: UID,
        name: String,
        description: String,
        url: Url,
        price: u64,
    }

    public struct TicketMinted has copy, drop {
        id: ID,
        minted_by: address,
        price: u64,
    }

    public entry fun buy_ticket(
        payment: Coin<SUI>,
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        price: u64,
        ctx: &mut TxContext
    ) {
        let value_paid = coin::value(&payment);
        assert!(value_paid == price, 0); 

        transfer::public_transfer(payment, @0x0); 

        let sender = tx_context::sender(ctx);
        let ticket = Ticket {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url),
            price: price 
        };

        event::emit(TicketMinted {
            id: object::uid_to_inner(&ticket.id),
            minted_by: sender,
            price: price,
        });

        transfer::public_transfer(ticket, sender);
    }
}
