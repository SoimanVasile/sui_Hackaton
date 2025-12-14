module suihackaton::charity {
    use std::string::{Self, String};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use sui::transfer;
    use sui::object::{Self, ID, UID};
    use sui::tx_context::{Self, TxContext};
    use std::vector;

    public struct CampaignRegistry has key {
        id: UID,
        campaigns: vector<ID>
    }

    public struct Campaign has key, store {
        id: UID,
        organizer: address,
        title: String,
        description: String,
        target_amount: u64,
        current_raised: u64,
        image_url: String,
        closed: bool
    }

    public struct Badge has key, store {
        id: UID,
        campaign_id: ID,
        campaign_name: String,
        amount_donated: u64,
        image_url: String,
    }

    public struct CampaignCreated has copy, drop {
        campaign_id: ID,
        title: String
    }

    public struct DonationReceived has copy, drop {
        campaign_id: ID,
        donor: address,
        amount: u64,
        new_total_raised: u64
    }

    fun init(ctx: &mut TxContext) {
        transfer::share_object(CampaignRegistry {
            id: object::new(ctx),
            campaigns: vector::empty(),
        });
    }

    public entry fun create_campaign(
        registry: &mut CampaignRegistry, 
        title: vector<u8>,
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
            organizer: sender,
            title: string::utf8(title),
            description: string::utf8(description),
            target_amount: target,
            current_raised: 0,
            image_url: string::utf8(image_url),
            closed: false
        };

        vector::push_back(&mut registry.campaigns, campaign_id);

        transfer::share_object(campaign);

        event::emit(CampaignCreated {
            campaign_id,
            title: string::utf8(title)
        });
    }

    public entry fun donate(
        campaign: &mut Campaign, 
        payment: Coin<SUI>, 
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&payment);
        let sender = tx_context::sender(ctx);
        campaign.current_raised = campaign.current_raised + amount;
        
        transfer::public_transfer(payment, campaign.organizer);

        let badge = Badge {
            id: object::new(ctx),
            campaign_id: object::id(campaign),
            campaign_name: campaign.title,
            amount_donated: amount,
            image_url: campaign.image_url,
        };

        transfer::public_transfer(badge, sender);

        event::emit(DonationReceived {
            campaign_id: object::id(campaign),
            donor: sender,
            amount,
            new_total_raised: campaign.current_raised,
        });
    }

    public entry fun donate_update(
        campaign: &mut Campaign, 
        existing_badge: &mut Badge,
        payment: Coin<SUI>, 
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&payment);
        let sender = tx_context::sender(ctx);

        assert!(existing_badge.campaign_id == object::id(campaign), 0);

        campaign.current_raised = campaign.current_raised + amount;

        existing_badge.amount_donated = existing_badge.amount_donated + amount;

        transfer::public_transfer(payment, campaign.organizer);

        event::emit(DonationReceived {
            campaign_id: object::id(campaign),
            donor: sender,
            amount,
            new_total_raised: campaign.current_raised,
        });
    }
}
