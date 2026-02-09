package org.acme;

import jakarta.enterprise.context.ApplicationScoped;

// Logic-first approach (The "Right" way)
@ApplicationScoped
public class HelpdeskService {
    public String findTicket(String id) {
        return "Clean logic here, no protocol awareness.";
    }
}