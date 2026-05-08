import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("/agent")
public class AgentResource {

    @Inject
    HelpdeskAgent agent;

    @GET
    @Path("/ask")
    @Produces(MediaType.TEXT_PLAIN)
    public String ask(@QueryParam("query") String query) {
        if (query == null || query.isBlank()) {
            return "Error: Please provide a query parameter";
        }
        // This call triggers the LLM -> MCP Tool Discovery -> Tool Execution -> Final Response
        return agent.chat(query);
    }
}