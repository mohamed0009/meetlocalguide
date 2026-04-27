package com.meetlocalguide.platform.modules.guide.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.meetlocalguide.platform.common.domain.SupportedLocale;
import com.meetlocalguide.platform.config.security.AuthRateLimitFilter;
import com.meetlocalguide.platform.config.security.JwtAuthenticationFilter;
import com.meetlocalguide.platform.config.security.SecurityConfig;
import com.meetlocalguide.platform.modules.guide.api.dto.GuideDetailResponse;
import com.meetlocalguide.platform.modules.guide.api.dto.GuideSummaryResponse;
import com.meetlocalguide.platform.modules.guide.application.GuideProfileService;
import com.meetlocalguide.platform.support.WebMvcTestSecurityConfig;
import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = GuideController.class, excludeFilters = {
                @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = SecurityConfig.class),
                @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = JwtAuthenticationFilter.class),
                @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = AuthRateLimitFilter.class)
})
@Import(WebMvcTestSecurityConfig.class)
class GuideControllerWebMvcTest {

        @Autowired
        private MockMvc mockMvc;

        @MockitoBean
        private GuideProfileService guideProfileService;

        @Test
        void listGuidesShouldBePublic() throws Exception {
                Page<GuideSummaryResponse> page = new PageImpl<>(java.util.List.of(sampleSummaryResponse()));
                when(guideProfileService.listGuides(any(), any(), any())).thenReturn(page);

                mockMvc.perform(get("/api/v1/guides"))
                                .andExpect(status().isOk());

                verify(guideProfileService).listGuides(any(), any(), any());
        }

        @Test
        void getMyGuideProfileShouldReturnForbiddenWhenAnonymous() throws Exception {
                mockMvc.perform(get("/api/v1/guides/me"))
                                .andExpect(status().isForbidden());
        }

        @Test
        @WithMockUser(username = "guide@example.com", roles = { "GUIDE" })
        void upsertMyGuideProfileShouldReturnOkWhenAuthenticated() throws Exception {
                when(guideProfileService.upsertMyGuideProfile(eq("guide@example.com"), any()))
                                .thenReturn(sampleDetailResponse());

                mockMvc.perform(put("/api/v1/guides/me")
                                .contentType(APPLICATION_JSON)
                                .content("""
                                                {
                                                  "slug": "marrakech-guide",
                                                  "bio": "Experienced local guide",
                                                  "yearsExperience": 5,
                                                  "city": "Marrakech",
                                                  "country": "Morocco",
                                                  "hourlyRateAmount": 25.50,
                                                  "languages": ["EN", "FR"]
                                                }
                                                """))
                                .andExpect(status().isOk());

                verify(guideProfileService).upsertMyGuideProfile(eq("guide@example.com"), any());
        }

        private GuideSummaryResponse sampleSummaryResponse() {
                return new GuideSummaryResponse(
                                UUID.fromString("ea95ca50-b5fe-4281-8c87-d8a1bca2fb32"),
                                "marrakech-guide",
                                "Guide One",
                                "Marrakech",
                                "Morocco",
                                "VERIFIED",
                                new BigDecimal("4.8"),
                                120,
                                Set.of(SupportedLocale.EN, SupportedLocale.FR));
        }

        private GuideDetailResponse sampleDetailResponse() {
                return new GuideDetailResponse(
                                UUID.fromString("ea95ca50-b5fe-4281-8c87-d8a1bca2fb32"),
                                UUID.fromString("9ea97d57-f25d-4f31-a41b-dd61a508ad59"),
                                "marrakech-guide",
                                "Guide One",
                                "guide@example.com",
                                "Experienced local guide",
                                5,
                                "Marrakech",
                                "Morocco",
                                "VERIFIED",
                                new BigDecimal("25.50"),
                                new BigDecimal("4.8"),
                                120,
                                Set.of(SupportedLocale.EN, SupportedLocale.FR));
        }
}