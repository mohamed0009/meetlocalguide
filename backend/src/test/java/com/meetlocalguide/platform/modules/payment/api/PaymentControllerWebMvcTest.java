package com.meetlocalguide.platform.modules.payment.api;

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
import com.meetlocalguide.platform.modules.payment.application.PaymentService;
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

@WebMvcTest(controllers = PaymentController.class, excludeFilters = {
                @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = SecurityConfig.class),
                @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = JwtAuthenticationFilter.class),
                @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = AuthRateLimitFilter.class)
})
@Import(WebMvcTestSecurityConfig.class)
class PaymentControllerWebMvcTest {

        @Autowired
        private MockMvc mockMvc;

        @MockitoBean
        private PaymentService paymentService;

        @Test
        void createPaymentShouldReturnUnauthorizedWhenAnonymous() throws Exception {
                mockMvc.perform(post("/api/v1/payments")
                                .contentType(APPLICATION_JSON)
                                .content(validCreatePaymentJson()))
                                .andExpect(status().isUnauthorized());
        }

        @Test
        @WithMockUser(username = "traveler@example.com", roles = { "USER" })
        void listMyPaymentsShouldReturnOkWhenAuthenticated() throws Exception {
                when(paymentService.listMyPayments(eq("traveler@example.com"), any())).thenReturn(Page.empty());

                mockMvc.perform(get("/api/v1/payments/me"))
                                .andExpect(status().isOk());

                verify(paymentService).listMyPayments(eq("traveler@example.com"), any());
        }

        @Test
        @WithMockUser(username = "guide@example.com", roles = { "GUIDE" })
        void getPaymentShouldReturnOkForGuideRole() throws Exception {
                UUID paymentId = UUID.fromString("cf7f8993-e4b3-4ecc-b4a0-86a85e935f9e");
                when(paymentService.getPayment(eq(paymentId), eq("guide@example.com"), eq(false), eq(true)))
                                .thenReturn(null);

                mockMvc.perform(get("/api/v1/payments/{paymentId}", paymentId))
                                .andExpect(status().isOk());

                verify(paymentService).getPayment(eq(paymentId), eq("guide@example.com"), eq(false), eq(true));
        }

        @Test
        @WithMockUser(username = "traveler@example.com", roles = { "USER" })
        void updatePaymentStatusShouldReturnForbiddenForTravelerRole() throws Exception {
                UUID paymentId = UUID.fromString("cf7f8993-e4b3-4ecc-b4a0-86a85e935f9e");

                mockMvc.perform(patch("/api/v1/payments/{paymentId}/status", paymentId)
                                .contentType(APPLICATION_JSON)
                                .content("{\"status\":\"SUCCEEDED\"}"))
                                .andExpect(status().isForbidden());

                verifyNoInteractions(paymentService);
        }

        @Test
        @WithMockUser(username = "admin@example.com", roles = { "ADMIN" })
        void updatePaymentStatusShouldReturnOkForAdminRole() throws Exception {
                UUID paymentId = UUID.fromString("cf7f8993-e4b3-4ecc-b4a0-86a85e935f9e");
                when(paymentService.updatePaymentStatus(eq(paymentId), eq("admin@example.com"), eq(true), any()))
                                .thenReturn(null);

                mockMvc.perform(patch("/api/v1/payments/{paymentId}/status", paymentId)
                                .contentType(APPLICATION_JSON)
                                .content("{\"status\":\"SUCCEEDED\"}"))
                                .andExpect(status().isOk());

                verify(paymentService).updatePaymentStatus(eq(paymentId), eq("admin@example.com"), eq(true), any());
        }

        private String validCreatePaymentJson() {
                return """
                                {
                                  "bookingId": "5bccb86f-0b36-4bc0-90b4-8fe6cdb8fb36",
                                  "provider": "STRIPE",
                                  "providerPaymentIntentId": "pi_3Qw9yE9f7Wm4QhXk0Q"
                                }
                                """;
        }
}
