import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class HelpdeskService {

    @Transactional
    public String findTicket(String id) {
        Ticket ticket = Ticket.findByTicketId(id);
        if (ticket == null) {
            return "Ticket not found: " + id;
        }
        return ticket.ticketId + ": " + ticket.content;
    }

    @Transactional
    public List<String> listAllTickets() {
        return Ticket.<Ticket>listAll().stream()
                .map(t -> t.ticketId + ": " + t.content)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<String> searchTickets(String keyword) {
        return Ticket.<Ticket>find("lower(content) like lower(?1)", "%" + keyword + "%")
                .stream()
                .map(t -> t.ticketId + ": " + t.content)
                .collect(Collectors.toList());
    }
}