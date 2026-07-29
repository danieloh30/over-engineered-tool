import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.Map;

@Path("/agent")
public class ComparisonResource {

    @Inject
    HelpdeskAgent overEngineeredAgent;

    @Inject
    CleanHelpdeskAgent cleanAgent;

    @GET
    @Path("/compare")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> compare(@QueryParam("query") String query) {
        if (query == null || query.isBlank()) {
            Map<String, Object> err = Map.of("error", "Please provide a query parameter", "durationMs", 0);
            return Map.of("overEngineered", err, "clean", err);
        }

        Map<String, Object> overResult = runAgent(query, true);
        Map<String, Object> cleanResult = runAgent(query, false);

        Map<String, Object> response = new HashMap<>();
        response.put("overEngineered", overResult);
        response.put("clean", cleanResult);

        Object overMs = overResult.get("durationMs");
        Object cleanMs = cleanResult.get("durationMs");
        if (overMs instanceof Long oms && cleanMs instanceof Long cms && cms > 0) {
            double ratio = (double) oms / cms;
            response.put("speedup", String.format("%.1fx faster", ratio));
        }

        return response;
    }

    private Map<String, Object> runAgent(String query, boolean overEngineered) {
        long start = System.nanoTime();
        try {
            String result = overEngineered
                    ? overEngineeredAgent.chat(query)
                    : cleanAgent.chat(query);
            long durationMs = (System.nanoTime() - start) / 1_000_000;
            return Map.of("response", result, "durationMs", durationMs);
        } catch (Exception e) {
            long durationMs = (System.nanoTime() - start) / 1_000_000;
            return Map.of("durationMs", durationMs, "error", e.getMessage());
        }
    }
}
