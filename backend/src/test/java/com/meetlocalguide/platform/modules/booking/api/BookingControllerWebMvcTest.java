package com.meetlocalguide.platform.modules.booking.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.meetlocalguide.platform.config.security.AuthRateLimitFilter;
import com.meetlocalguide.platform.config.security.JwtAuthenticationFilter;
import com.meetlocalguide.platform.config.security.SecurityConfig;
import com.meetlocalguide.platform.modules.booking.application.BookingService;
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

@WebMvcTest(controllers = BookingController.class, excludeFilters = {
                @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = SecurityConfig.class),
                @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = JwtAuthenticationFilter.class),
                @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = AuthRateLimitFilter.class)
})
@Import(WebMvcTestSecurityConfig.class)
class BookingControllerWebMvcTest {

        @Autowired
        private MockMvc mockMvc;

        @MockitoBean
        private BookingService bookingService;

        @Test
        void createBookingShouldReturnUnauthorizedWhenAnonymous() throws Exception {
                mockMvc.perform(post("/api/v1/bookings")
                                .contentType(APPLICATION_JSON)
                                .content(validCreateBookingJson()))
                                .andExpect(status().isUnauthorized());
        }

        @Test
        @WithMockUser(username = "traveler@example.com", roles = { "USER" })
        void listMyBookingsShouldReturnOkWhenAuthenticated() throws Exception {
                when(bookingService.listMyBookings(eq("traveler@example.com"), any())).thenReturn(Page.empty());

                mockMvc.perform(get("/api/v1/bookings/me"))
                                .andExpect(status().isOk());

                verify(bookingService).listMyBookings(eq("traveler@example.com"), any());
        }

        @Test
        @WithMockUser(username = "traveler@example.com", roles = { "USER" })
        void updateBookingStatusShouldReturnForbiddenForTravelerRole() throws Exception {
                UUID bookingId = UUID.fromString("28e8f931-4d9b-4f2b-95b8-f93eb6a589e4");

                mockMvc.perform(patch("/api/v1/bookings/{bookingId}/status", bookingId)
                                .contentType(APPLICATION_JSON)
                                .content("{\"status\":\"CONFIRMED\"}"))
                                .andExpect(status().isForbidden());

                verifyNoInteractions(bookingService);
        }

        @Test
        @WithMockUser(username = "guide@example.com", roles = { "GUIDE" })
        void updateBookingStatusShouldReturnOkForGuideRole() throws Exception {
                UUID bookingId = UUID.fromString("28e8f931-4d9b-4f2b-95b8-f93eb6a589e4");
                when(bookingService.updateBookingStatus(eq(bookingId), eq("guide@example.com"), eq(false), any()))
                                .thenReturn(null);

                mockMvc.perform(patch("/api/v1/bookings/{bookingId}/status", bookingId)
                                .contentType(APPLICATION_JSON)
                                .content("{\"status\":\"CONFIRMED\"}"))
                                .andExpect(status().isOk());

                verify(bookingService).updateBookingStatus(eq(bookingId), eq("guide@example.com"), eq(false), any());
        }

        private String validCreateBookingJson() {
                return """
                                {
                                  "tourId": "5bccb86f-0b36-4bc0-90b4-8fe6cdb8fb36",
                                  "startAt": "2030-01-10T09:00:00Z",
                                  "endAt": "2030-01-10T17:00:00Z",
                                  "participantCount": 2,
                                  "currency": "USD",
                                  "specialRequests": "Vegetarian lunch"
                                }
                                """;
        }
}