module suihackaton::charity {
    use std::string::{Self, String};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;

    const NGO_ADDRESS: address = @0x15185806a896f6b6a9d9eb1c433bdc0b9817528e520f4000988d50658a5a27c7;

    public struct DonationNFT has key, store {
        id: UID,
        amount_donated: u64, 
        tier: String,
        image_url: String,
        timestamp: u64
    }

    public struct DonationEvent has copy, drop {
        donor: address,
        amount: u64
    }

    public fun donate_for_cause(
        payment: Coin<SUI>, 
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&payment);
        let sender = tx_context::sender(ctx);

        let tier_str = if (amount >= 100_000_000_000) { 
            b"Gold Philanthropist"
        } else if (amount >= 10_000_000_000) {
            b"Silver Supporter"
        } else {
            b"Bronze Helper"
        };

        let nft = DonationNFT {
            id: object::new(ctx),
            amount_donated: amount,
            tier: string::utf8(tier_str),
            image_url: string::utf8(b"https://nfpass.app/images/thank-you.png"),
            timestamp: tx_context::epoch(ctx)
        };

        transfer::public_transfer(payment, NGO_ADDRESS);

        transfer::public_transfer(nft, sender);

        event::emit(DonationEvent {
            donor: sender,
            amount: amount
        });
    }
}
module suihackaton::volunteer {
    use std::string::{Self, String};

    public struct VolunteerBadge has key { 
        id: UID,
        volunteer_name: String,
        organization: String,
        total_hours: u64,
        events_attended: u64,
        rank: String,
    }

    public struct OrganizerCap has key, store { id: UID }

    public fun register_volunteer(
        _cap: &OrganizerCap, 
        name: vector<u8>,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let badge = VolunteerBadge {
            id: object::new(ctx),
            volunteer_name: string::utf8(name),
            organization: string::utf8(b"Green Earth NGO"),
            total_hours: 0,
            events_attended: 0,
            rank: string::utf8(b"Rookie"),
        };
        transfer::transfer(badge, recipient);
    }

    public fun log_activity(
        _cap: &OrganizerCap, 
        badge: &mut VolunteerBadge, 
        hours: u64
    ) {
        badge.total_hours = badge.total_hours + hours;
        badge.events_attended = badge.events_attended + 1;

        if (badge.total_hours >= 100) {
            badge.rank = string::utf8(b"VETERAN - Gold Tier");
        } else if (badge.total_hours >= 50) {
            badge.rank = string::utf8(b"CAPTAIN - Silver Tier");
        };
    }
}
