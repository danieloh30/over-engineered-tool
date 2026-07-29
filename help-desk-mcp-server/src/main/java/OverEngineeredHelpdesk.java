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
    @Tool(description = "List all active ticket IDs from the enterprise ticket management platform via the legacy REST gateway adapter service")
    @Transactional
    public List<String> listTickets() {
        return Ticket.<Ticket>listAll().stream()
                .map(ticket -> ticket.ticketId)
                .collect(Collectors.toList());
    }

    @Tool(description = "Performs a full-text semantic keyword search across the entire enterprise ticket corpus using the legacy search indexing subsystem with fuzzy matching enabled")
    @Transactional
    public String searchTickets(@ToolArg(description = "The search keyword or phrase to match against all ticket content fields") String keyword) {
        simulateComplexSearch();

        List<Ticket> results = Ticket.<Ticket>find("lower(content) like lower(?1)", "%" + keyword + "%").list();
        if (results.isEmpty()) {
            return """
                {
                    "status": "NO_RESULTS",
                    "metadata": { "searchEngine": "legacy_solr_v2", "indexVersion": "2026.1.3" },
                    "query": { "original": "%s", "normalized": "%s", "fuzzyEnabled": true },
                    "results": [],
                    "pagination": { "page": 1, "totalPages": 0, "totalResults": 0 }
                }
                """.formatted(keyword, keyword.toLowerCase());
        }

        StringBuilder items = new StringBuilder();
        for (int i = 0; i < results.size(); i++) {
            Ticket t = results.get(i);
            if (i > 0) items.append(",\n");
            items.append("""
                        {
                            "rank": %d,
                            "relevanceScore": 0.%d,
                            "document": {
                                "ticket_id": "%s",
                                "content": "%s",
                                "source": "mainframe_index"
                            }
                        }""".formatted(i + 1, 95 - (i * 10), t.ticketId, t.content));
        }

        return """
            {
                "status": "SUCCESS",
                "metadata": { "searchEngine": "legacy_solr_v2", "indexVersion": "2026.1.3", "queryTimeMs": 3000 },
                "query": { "original": "%s", "normalized": "%s", "fuzzyEnabled": true },
                "results": [
                    %s
                ],
                "pagination": { "page": 1, "totalPages": 1, "totalResults": %d }
            }
            """.formatted(keyword, keyword.toLowerCase(), items.toString(), results.size());
    }

    @Tool(description = "Retrieves the complete audit trail and modification history log for a specific ticket from the enterprise change tracking database system")
    @Transactional
    public String getTicketHistory(@ToolArg(description = "The ID of the ticket to retrieve history for") String id) {
        simulateHistoryLookup();

        Ticket ticket = Ticket.findByTicketId(id);
        if (ticket == null) {
            return "ERROR_TICKET_NOT_FOUND_IN_AUDIT_SYSTEM";
        }

        return """
            {
                "status": "SUCCESS",
                "metadata": { "auditSystem": "enterprise_changelog_v3", "version": "2026.2" },
                "ticketId": "%s",
                "auditTrail": [
                    {
                        "timestamp": "2026-01-15T09:00:00Z",
                        "action": "CREATED",
                        "actor": { "userId": "system", "role": "AUTOMATED", "department": "IT" },
                        "changes": { "field": "content", "oldValue": null, "newValue": "%s" },
                        "metadata": { "source": "email_ingestion_pipeline", "correlationId": "abc-123" }
                    },
                    {
                        "timestamp": "2026-01-15T09:05:00Z",
                        "action": "ASSIGNED",
                        "actor": { "userId": "dispatcher_bot", "role": "AUTOMATED", "department": "IT" },
                        "changes": { "field": "assignee", "oldValue": null, "newValue": "support_team_l1" },
                        "metadata": { "routingRule": "keyword_match_v2", "confidence": 0.87 }
                    },
                    {
                        "timestamp": "2026-01-15T10:30:00Z",
                        "action": "STATUS_CHANGE",
                        "actor": { "userId": "jsmith", "role": "L1_SUPPORT", "department": "IT" },
                        "changes": { "field": "status", "oldValue": "NEW", "newValue": "IN_PROGRESS" },
                        "metadata": { "slaRemaining": "23h30m", "priority": "MEDIUM" }
                    }
                ],
                "summary": { "totalChanges": 3, "lastModified": "2026-01-15T10:30:00Z" }
            }
            """.formatted(ticket.ticketId, ticket.content);
    }

    private void simulateHeavyReasoning() {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private void simulateComplexSearch() {
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private void simulateHistoryLookup() {
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}