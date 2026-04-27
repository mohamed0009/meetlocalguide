package com.meetlocalguide.platform.modules.tour.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.meetlocalguide.platform.config.security.AuthRateLimitFilter;
import com.meetlocalguide.platform.config.security.JwtAuthenticationFilter;
import com.meetlocalguide.platform.config.security.SecurityConfig;
import com.meetlocalguide.platform.modules.tour.application.TourService;
import com.meetlocalguide.platform.support.WebMvcTestSecurityConfig;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = TourController.class, excludeFilters = {
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = SecurityConfig.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = JwtAuthenticationFilter.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = AuthRateLimitFilter.class)
})
@Import(WebMvcTestSecurityConfig.class)
class TourControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TourService tourService;

    @Test
    void listToursShouldBePublic() throws Exception {
        when(tourService.listTours(any(), any(), any(), any(), any(), any(), any(), any())).thenReturn(Page.empty());

        mockMvc.perform(get("/api/v1/tours"))
                .andExpect(status().isOk());

        verify(tourService).listTours(any(), any(), any(), any(), any(), any(), any(), any());
    }

    @Test
    void createTourShouldReturnUnauthorizedWhenAnonymous() throws Exception {
        mockMvc.perform(post("/api/v1/tours")
                .contentType(APPLICATION_JSON)
                .content(validCreateTourJson()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "guide@example.com", roles = { "GUIDE" })
    void createTourShouldReturnCreatedWhenAuthenticated() throws Exception {
        when(tourService.createTour(eq("guide@example.com"), any())).thenReturn(null);

        mockMvc.perform(post("/api/v1/tours")
                .contentType(APPLICATION_JSON)
                .content(validCreateTourJson()))
                .andExpect(status().isCreated());

        verify(tourService).createTour(eq("guide@example.com"), any());
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = { "ADMIN" })
    void updateTourShouldPassAdminFlagWhenAdmin() throws Exception {
        UUID tourId = UUID.fromString("8ec4f16e-f68f-4361-a831-80a692bc9f63");
        when(tourService.updateTour(eq(tourId), eq("admin@example.com"), eq(true), any())).thenReturn(null);

        mockMvc.perform(put("/api/v1/tours/{tourId}", tourId)
                .contentType(APPLICATION_JSON)
                .content(validUpdateTourJson()))
                .andExpect(status().isOk());

        verify(tourService).updateTour(eq(tourId), eq("admin@example.com"), eq(true), any());
    }

    private String validCreateTourJson() {
        return """
                {
                  "slug": "marrakech-desert-tour",
                  "title": "Marrakech Desert Tour",
                  "description": "Full-day tour from Marrakech to the desert.",
                  "city": "Marrakech",
                  "country": "Morocco",
                  "durationMinutes": 480,
                  "maxGroupSize": 10,
                  "basePriceAmount": 89.99,
                  "baseCurrency": "USD"
                }
                """;
    }

    private String validUpdateTourJson() {
        return """
                {
                  "slug": "marrakech-desert-tour",
                  "title": "Marrakech Desert Tour Updated",
                  "description": "Updated tour details.",
                  "city": "Marrakech",
                  "country": "Morocco",
                  "durationMinutes": 420,
                  "maxGroupSize": 8,
                  "basePriceAmount": 79.99,
                  "baseCurrency": "USD",
                  "status": "PUBLISHED"
                }
                """;
    }
}