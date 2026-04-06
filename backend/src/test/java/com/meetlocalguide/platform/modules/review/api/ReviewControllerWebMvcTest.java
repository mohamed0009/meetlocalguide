package com.meetlocalguide.platform.modules.review.api;

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
import com.meetlocalguide.platform.modules.review.application.ReviewService;
import com.meetlocalguide.platform.support.WebMvcTestSecurityConfig;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = ReviewController.class, excludeFilters = {
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = SecurityConfig.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = JwtAuthenticationFilter.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = AuthRateLimitFilter.class)
})
@Import(WebMvcTestSecurityConfig.class)
class ReviewControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReviewService reviewService;

    @Test
    void listTourReviewsShouldBePublic() throws Exception {
        UUID tourId = UUID.fromString("e27226ea-1eec-4902-bcf6-edf8e718de9b");
        when(reviewService.listTourReviews(eq(tourId), any())).thenReturn(Page.empty());

        mockMvc.perform(get("/api/v1/reviews/tours/{tourId}", tourId))
                .andExpect(status().isOk());

        verify(reviewService).listTourReviews(eq(tourId), any());
    }

    @Test
    void createReviewShouldReturnUnauthorizedWhenAnonymous() throws Exception {
        mockMvc.perform(post("/api/v1/reviews")
                .contentType(APPLICATION_JSON)
                .content(validCreateReviewJson()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "traveler@example.com", roles = { "USER" })
    void createReviewShouldReturnBadRequestWhenPayloadInvalid() throws Exception {
        mockMvc.perform(post("/api/v1/reviews")
                .contentType(APPLICATION_JSON)
                .content("""
                        {
                          "bookingId": "95eebdeb-b5dc-4503-8eb9-4469cfcd4cec",
                          "rating": 5,
                          "comment": ""
                        }
                        """))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(reviewService);
    }

    @Test
    @WithMockUser(username = "guide@example.com", roles = { "GUIDE" })
    void replyToReviewShouldReturnOkForGuideRole() throws Exception {
        UUID reviewId = UUID.fromString("fd3dc792-f7f5-4d77-903b-7ce8721c1e1e");
        when(reviewService.replyToReview(eq(reviewId), eq("guide@example.com"), eq(false), any()))
                .thenReturn(null);

        mockMvc.perform(patch("/api/v1/reviews/{reviewId}/reply", reviewId)
                .contentType(APPLICATION_JSON)
                .content("{\"guideReply\":\"Thank you for your feedback\"}"))
                .andExpect(status().isOk());

        verify(reviewService).replyToReview(eq(reviewId), eq("guide@example.com"), eq(false), any());
    }

    private String validCreateReviewJson() {
        return """
                {
                  "bookingId": "95eebdeb-b5dc-4503-8eb9-4469cfcd4cec",
                  "rating": 5,
                  "comment": "Amazing guide and experience"
                }
                """;
    }
}