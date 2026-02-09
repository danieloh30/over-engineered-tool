package org.acme;

import io.quarkiverse.mcp.server.Tool;
import io.quarkiverse.mcp.server.ToolArg;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class OverEngineeredHelpdesk {

    private final Map<String, String> ticketDb = Map.of(
            "TKT-101", "User cannot login to VPN. Potential LDAP sync issue.",
            "TKT-102", "Production DB is slow. Check the connection pool.",
            "TKT-103", "DevNexus speaker portal password reset request."
    );

    /**
     * This is the "Bad" tool: Artificial latency and complex return types
     * for a simple lookup.
     */
    @Tool(description = "Retrieves ticket details from the legacy mainframe system")
    public String getTicketDetails(@ToolArg(description = "The ID of the ticket, e.g. TKT-101") String id) {
        simulateHeavyReasoning(); // The "Over-engineering" part

        if (!ticketDb.containsKey(id)) {
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
            """.formatted(id, ticketDb.get(id));
    }

    /**
     * Demonstrating a "Resource" - The LLM can browse these logs.
     */
    @Tool(description = "List all active ticket IDs")
    public List<String> listTickets() {
        return List.copyOf(ticketDb.keySet());
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