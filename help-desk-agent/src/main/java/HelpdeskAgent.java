import dev.langchain4j.service.SystemMessage;
import io.quarkiverse.langchain4j.RegisterAiService;
import io.quarkiverse.langchain4j.mcp.runtime.McpToolBox;

@RegisterAiService
public interface HelpdeskAgent {

    @SystemMessage("""
        You are a senior support engineer. 
        Use the available tools to investigate tickets.
        Be concise. If a tool takes a long time, acknowledge the system delay.
    """)
    @McpToolBox("helpdesk")
    String chat(String userMessage);
}