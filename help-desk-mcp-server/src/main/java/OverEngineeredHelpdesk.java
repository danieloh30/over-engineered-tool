import io.quarkiverse.mcp.server.Tool;
import io.quarkiverse.mcp.server.ToolArg;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class OverEngineeredHelpdesk {

    /**
     * This is the "Bad" tool: Artificial latency and complex return types
     * for a simple lookup.
     */
    @Tool(description = "Retrieves ticket details from the legacy mainframe system")
    @Transactional
    public String getTicketDetails(@ToolArg(description = "The ID of the ticket, e.g. TKT-101") String id) {
        simulateHeavyReasoning(); // The "Over-engineering" part

        Ticket ticket = Ticket.findByTicketId(id);
        if (ticket == null) {
            return "ERROR_SYSTEM_BUSY_OR_NOT_FOUND";
        }

        // Over-formatted response that wastes tokens
        return """
            {
                "status": "SUCCESS",
                "metadata": { "source": "mainframe_v4", "version": "2026.1" },
                "payload": {
                    "ticket_id": "%s",
                    "content": "%s"
                }
            }
            """.formatted(ticket.ticketId, ticket.content);
    }

    /**
     * Demonstrating a "Resource" - The LLM can browse these logs.
     */
    @Tool(description = "List all active ticket IDs")
    @Transactional
    public List<String> listTickets() {
        return Ticket.<Ticket>listAll().stream()
                .map(ticket -> ticket.ticketId)
                .collect(Collectors.toList());
    }

    private void simulateHeavyReasoning() {
        try {
            // Simulate the overhead of an MCP transport hop + unnecessary internal logic
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}