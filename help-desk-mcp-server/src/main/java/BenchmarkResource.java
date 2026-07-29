import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.Map;

@Path("/api")
public class BenchmarkResource {

    @Inject
    OverEngineeredHelpdesk overEngineered;

    @Inject
    HelpdeskService clean;

    @GET
    @Path("/compare")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> compare(
            @QueryParam("action") String action,
            @QueryParam("id") String id,
            @QueryParam("keyword") String keyword) {

        if (action == null) action = "list";

        Map<String, Object> overResult = runOverEngineered(action, id, keyword);
        Map<String, Object> cleanResult = runClean(action, id, keyword);

        Map<String, Object> response = new HashMap<>();
        response.put("overEngineered", overResult);
        response.put("clean", cleanResult);

        long overMs = (long) overResult.get("durationMs");
        long cleanMs = (long) cleanResult.get("durationMs");
        if (cleanMs > 0) {
            double ratio = (double) overMs / cleanMs;
            response.put("speedup", String.format("%.0fx faster", ratio));
        }

        return response;
    }

    private Map<String, Object> runOverEngineered(String action, String id, String keyword) {
        long start = System.nanoTime();
        Object result = switch (action) {
            case "get" -> overEngineered.getTicketDetails(id != null ? id : "TKT-101");
            case "search" -> overEngineered.searchTickets(keyword != null ? keyword : "");
            case "history" -> overEngineered.getTicketHistory(id != null ? id : "TKT-101");
            default -> overEngineered.listTickets();
        };
        long durationMs = (System.nanoTime() - start) / 1_000_000;
        return Map.of("response", result.toString(), "durationMs", durationMs);
    }

    private Map<String, Object> runClean(String action, String id, String keyword) {
        long start = System.nanoTime();
        Object result = switch (action) {
            case "get", "history" -> clean.findTicket(id != null ? id : "TKT-101");
            case "search" -> clean.searchTickets(keyword != null ? keyword : "");
            default -> clean.listAllTickets();
        };
        long durationMs = (System.nanoTime() - start) / 1_000_000;
        return Map.of("response", result.toString(), "durationMs", durationMs);
    }
}
