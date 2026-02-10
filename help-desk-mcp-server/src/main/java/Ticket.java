import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class Ticket extends PanacheEntity {

    @Column(unique = true, nullable = false)
    public String ticketId;

    @Column(nullable = false, length = 1000)
    public String content;

    // Default constructor required by JPA
    public Ticket() {
    }

    public Ticket(String ticketId, String content) {
        this.ticketId = ticketId;
        this.content = content;
    }

    // Finder method for convenience
    public static Ticket findByTicketId(String ticketId) {
        return find("ticketId", ticketId).firstResult();
    }
}

// Made with Bob
