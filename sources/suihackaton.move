module suihackaton::tickets {
    use std::string::{Self, String};
    
    // Error codes for debugging
    const ENotOrganizer: u64 = 0;
    const EAlreadyUsed: u64 = 1;

    // The Ticket Object - owned by the attendee
    public struct Ticket has key, store {
        id: UID,
        event_name: String,
        description: String,
        date: String,
        seat_number: String,
        is_used: bool, // Tracks if the ticket has been scanned
    }

    // The Organizer Capability - limits controls to the creator
    public struct OrganizerCap has key, store {
        id: UID,
    }

    // Module Initializer: Runs once on deployment
    // Creates the OrganizerCap and sends it to the deployer
    fun init(ctx: &mut TxContext) {
        let organizer_cap = OrganizerCap {
            id: object::new(ctx)
        };
        transfer::transfer(organizer_cap, ctx.sender());
    }

    // Mint Function: Create a new ticket and send it to an attendee
    // Only the owner of OrganizerCap can call this
    public fun mint_ticket(
        _cap: &OrganizerCap, // Authorization check
        event_name: vector<u8>,
        description: vector<u8>,
        date: vector<u8>,
        seat_number: vector<u8>,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let ticket = Ticket {
            id: object::new(ctx),
            event_name: string::utf8(event_name),
            description: string::utf8(description),
            date: string::utf8(date),
            seat_number: string::utf8(seat_number),
            is_used: false, // Default state is unused
        };

        // Transfer the Ticket object directly to the attendee
        transfer::public_transfer(ticket, recipient);
    }

    // Validation Function: "Scans" the ticket at the entrance
    // Checks if used, marks as used. Requires OrganizerCap.
    public fun validate_ticket(
        _cap: &OrganizerCap, 
        ticket: &mut Ticket
    ) {
        // 1. Check if the ticket has already been used
        assert!(ticket.is_used == false, EAlreadyUsed);

        // 2. Mark the ticket as used
        ticket.is_used = true;
    }
    
    // Helper function to read ticket status (anyone can call)
    public fun is_ticket_used(ticket: &Ticket): bool {
        ticket.is_used
    }
}
