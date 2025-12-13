module suihackaton::charity {
    use std::string::{Self, String};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use sui::url::{Self, Url};
    use sui::transfer;
    use sui::object::{Self, ID, UID};
    use sui::tx_context::{Self, TxContext};

    public struct Campaign has key, store {
        id: UID,
        admin: address,
        name: String,
        description: String,
        target_amount: u64,
        current_raised: u64,
        image_url: String,
        closed: bool
    }

    public struct DonationNFT has key, store {
        id: UID,
        campaign_id: ID,
        amount_donated: u64, 
        tier: String,
        image_url: String,
    }

    public struct CampaignCreated has copy, drop {
        campaign_id: ID,
        admin: address,
        name: String
    }

    public struct DonationReceived has copy, drop {
        campaign_id: ID,
        donor: address,
        amount: u64,
        new_total: u64
    }

    public entry fun create_campaign(
        name: vector<u8>,
        description: vector<u8>,
        target: u64,
        image_url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let id = object::new(ctx);
        let campaign_id = object::uid_to_inner(&id);
        let sender = tx_context::sender(ctx);

        let campaign = Campaign {
            id,
            admin: sender,
            name: string::utf8(name),
            description: string::utf8(description),
            target_amount: target,
            current_raised: 0,
            image_url: string::utf8(image_url),
            closed: false
        };

        transfer::share_object(campaign);

        event::emit(CampaignCreated {
            campaign_id,
            admin: sender,
            name: string::utf8(name)
        });
    }

    public entry fun donate_to_campaign(
        campaign: &mut Campaign, 
        payment: Coin<SUI>, 
        ctx: &mut TxContext
    ) {
        assert!(campaign.closed == false, 0);

        let amount = coin::value(&payment);
        let sender = tx_context::sender(ctx);

        campaign.current_raised = campaign.current_raised + amount;

        let tier_str = if (amount >= 100_000_000_000) { 
            b"Gold Philanthropist"
        } else if (amount >= 10_000_000_000) {
            b"Silver Supporter"
        } else {
            b"Bronze Helper"
        };

        let nft = DonationNFT {
            id: object::new(ctx),
            campaign_id: object::uid_to_inner(&campaign.id),
            amount_donated: amount,
            tier: string::utf8(tier_str),
            image_url: campaign.image_url, // Donors get the campaign badge
        };

        let admin_addr = campaign.admin;
        transfer::public_transfer(payment, admin_addr);
        transfer::public_transfer(nft, sender);

        event::emit(DonationReceived {
            campaign_id: object::uid_to_inner(&campaign.id),
            donor: sender,
            amount,
            new_total: campaign.current_raised
        });
    }
}

module suihackaton::volunteer {
    use std::string::{Self, String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

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
