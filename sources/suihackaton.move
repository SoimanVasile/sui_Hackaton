module suihackaton::charity {
    use std::string::{Self, String};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;

    const NGO_ADDRESS: address = @0x15185806a896f6b6a9d9eb1c433bdc0b9817528e520f4000988d50658a5a27c7; // <--- PUNE ADRESA TA AICI

    // NFT-ul pe care îl primește donatorul
    public struct DonationNFT has key, store {
        id: UID,
        amount_donated: u64, // Cât a donat (în MIST, unitatea mică a SUI)
        tier: String,        // "Gold", "Silver", etc.
        image_url: String,   // Poză drăguță cu cauza
        timestamp: u64       // Când a donat
    }

    // Eveniment pentru a notifica frontend-ul că s-a făcut o donație
    public struct DonationEvent has copy, drop {
        donor: address,
        amount: u64
    }

    // Funcția principală: Donează și primește NFT
    public fun donate_for_cause(
        payment: Coin<SUI>, // Utilizatorul trimite moneda SUI direct în funcție
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&payment);
        let sender = tx_context::sender(ctx);

        // 1. Determină "Rangul" donatorului în funcție de sumă
        // Notă: 1 SUI = 1.000.000.000 MIST
        let tier_str = if (amount >= 100_000_000_000) { 
            b"Gold Philanthropist" // > 100 SUI
        } else if (amount >= 10_000_000_000) {
            b"Silver Supporter"    // > 10 SUI
        } else {
            b"Bronze Helper"
        };

        // 2. Creează NFT-ul de mulțumire
        let nft = DonationNFT {
            id: object::new(ctx),
            amount_donated: amount,
            tier: string::utf8(tier_str),
            // Poți pune un URL real către o imagine IPFS sau serverul vostru
            image_url: string::utf8(b"https://nfpass.app/images/thank-you.png"),
            timestamp: tx_context::epoch(ctx)
        };

        // 3. Trimite BANII la ONG
        transfer::public_transfer(payment, NGO_ADDRESS);

        // 4. Trimite NFT-ul la DONATOR
        transfer::public_transfer(nft, sender);

        // 5. Emite evenimentul (pentru a actualiza bara de progres pe site)
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
        total_hours: u64,      // Câte ore a muncit
        events_attended: u64,  // La câte evenimente a participat
        rank: String,          // Ex: "Începător", "Activ", "Veteran"
    }

    // Capability pentru organizatori (rămâne la fel)
    public struct OrganizerCap has key, store { id: UID }

    // Funcția de înregistrare a unui voluntar nou (Minting)
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
        // Trimitem badge-ul voluntarului
        transfer::transfer(badge, recipient);
    }

    // Funcția MAGICĂ: Check-in la activitate
    // Organizatorul scanează badge-ul și adaugă ore
    public fun log_activity(
        _cap: &OrganizerCap, 
        badge: &mut VolunteerBadge, 
        hours: u64
    ) {
        // 1. Actualizăm statistica
        badge.total_hours = badge.total_hours + hours;
        badge.events_attended = badge.events_attended + 1;

        // 2. Logică de Gamification (Upgrade automat)
        if (badge.total_hours >= 100) {
            badge.rank = string::utf8(b"VETERAN - Gold Tier");
        } else if (badge.total_hours >= 50) {
            badge.rank = string::utf8(b"CAPTAIN - Silver Tier");
        };
    }
}
