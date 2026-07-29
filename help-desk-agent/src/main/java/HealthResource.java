import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.net.HttpURLConnection;
import java.net.URI;
import java.util.Map;

@Path("/health")
public class HealthResource {

    @GET
    @Path("/status")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, Object> status() {
        Map<String, Object> mcp = checkMcpServer();
        Map<String, Object> openai = checkOpenAiKey();
        Map<String, Object> agent = Map.of("connected", true, "detail", "Running");
        return Map.of("mcpServer", mcp, "openai", openai, "agent", agent);
    }

    private Map<String, Object> checkMcpServer() {
        try {
            HttpURLConnection conn = (HttpURLConnection) URI.create("http://localhost:8081/mcp/sse/").toURL().openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(2000);
            conn.setReadTimeout(2000);
            int code = conn.getResponseCode();
            conn.disconnect();
            return Map.of("connected", code < 500, "detail", "HTTP " + code);
        } catch (Exception e) {
            return Map.of("connected", false, "detail", "Unreachable");
        }
    }

    private Map<String, Object> checkOpenAiKey() {
        String key = System.getenv("OPENAI_API_KEY");
        if (key == null || key.isBlank()) {
            return Map.of("connected", false, "detail", "OPENAI_API_KEY not set");
        }
        return Map.of("connected", true, "detail", "Key configured");
    }
}
