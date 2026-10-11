package com.library.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    // Forwards SPA routes to index.html while letting /api, /actuator, and static resources pass through
    @GetMapping(value = {
            "/catalog",
            "/student-dashboard",
            "/admin-dashboard",
            "/history",
            "/auth"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
