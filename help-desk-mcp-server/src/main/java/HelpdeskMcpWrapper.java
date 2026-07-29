import io.quarkiverse.mcp.server.Tool;
import io.quarkiverse.mcp.server.ToolArg;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;

@ApplicationScoped
public class HelpdeskMcpWrapper {
    @Inject
    HelpdeskService service;

    @Tool(description = "Get ticket details by ID")
    public String fetchTicket(@ToolArg(description = "Ticket ID, e.g. TKT-101") String id) {
        return service.findTicket(id);
    }

    @Tool(description = "List all tickets")
    public List<String> fetchAllTickets() {
        return service.listAllTickets();
    }

    @Tool(description = "Search tickets by keyword")
    public List<String> findTickets(@ToolArg(description = "Search keyword") String keyword) {
        return service.searchTickets(keyword);
    }
}