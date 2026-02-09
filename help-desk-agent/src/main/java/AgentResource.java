import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;

@Path("/agent")
public class AgentResource {

    @Inject
    HelpdeskAgent agent;

    @GET
    @Path("/ask")
    public String ask(@QueryParam("query") String query) {
        // This call triggers the LLM -> MCP Tool Discovery -> Tool Execution -> Final Response
        return agent.chat(query);
    }
}