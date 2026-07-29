import dev.langchain4j.service.SystemMessage;
import io.quarkiverse.langchain4j.RegisterAiService;
import io.quarkiverse.langchain4j.mcp.runtime.McpToolBox;

@RegisterAiService
public interface CleanHelpdeskAgent {

    @SystemMessage("""
        You are a senior support engineer.
        Use the available tools to investigate tickets.
        Be concise.
        IMPORTANT: Only use these tools: fetchTicket, fetchAllTickets, findTickets.
        Do NOT use getTicketDetails, listTickets, searchTickets, or getTicketHistory.
    """)
    @McpToolBox("helpdesk")
    String chat(String userMessage);
}
