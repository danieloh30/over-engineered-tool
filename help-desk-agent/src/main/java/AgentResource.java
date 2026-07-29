import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.util.Map;

@Path("/agent")
public class AgentResource {

    @Inject
    HelpdeskAgent agent;

    @GET
    @Path("/ask")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> ask(@QueryParam("query") String query) {
        if (query == null || query.isBlank()) {
            return Map.of("response", "", "durationMs", 0, "error", "Please provide a query parameter");
        }

        long start = System.nanoTime();
        try {
            String result = agent.chat(query);
            long durationMs = (System.nanoTime() - start) / 1_000_000;
            return Map.of("response", result, "durationMs", durationMs);
        } catch (Exception e) {
            long durationMs = (System.nanoTime() - start) / 1_000_000;
            return Map.of("durationMs", durationMs, "error", e.getMessage());
        }
    }
}
