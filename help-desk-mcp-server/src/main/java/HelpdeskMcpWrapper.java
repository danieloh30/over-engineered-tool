package org.acme;

import io.quarkiverse.mcp.server.Tool;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

// Thin MCP Wrapper (The "Interface" layer)
@ApplicationScoped
public class HelpdeskMcpWrapper {
    @Inject
    HelpdeskService service;

    @Tool
    public String fetchTicket(String id) {
        return service.findTicket(id);
    }
}