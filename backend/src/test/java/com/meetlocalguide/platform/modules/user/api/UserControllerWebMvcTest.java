package com.meetlocalguide.platform.modules.user.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.meetlocalguide.platform.common.domain.CurrencyCode;
import com.meetlocalguide.platform.common.domain.SupportedLocale;
import com.meetlocalguide.platform.config.security.AuthRateLimitFilter;
import com.meetlocalguide.platform.config.security.JwtAuthenticationFilter;
import com.meetlocalguide.platform.config.security.SecurityConfig;
import com.meetlocalguide.platform.modules.user.api.dto.UpdateUserProfileRequest;
import com.meetlocalguide.platform.modules.user.api.dto.UserProfileResponse;
import com.meetlocalguide.platform.modules.user.application.UserProfileService;
import com.meetlocalguide.platform.support.WebMvcTestSecurityConfig;
import java.time.LocalDate;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = UserController.class, excludeFilters = {
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = SecurityConfig.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = JwtAuthenticationFilter.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = AuthRateLimitFilter.class)
})
@Import(WebMvcTestSecurityConfig.class)
class UserControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserProfileService userProfileService;

    @Test
    void getMyProfileShouldReturnUnauthorizedWhenAnonymous() throws Exception {
        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "traveler@example.com", roles = { "USER" })
    void getMyProfileShouldReturnOkWhenAuthenticated() throws Exception {
        when(userProfileService.getMyProfile("traveler@example.com")).thenReturn(sampleResponse());

        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isOk());

        verify(userProfileService).getMyProfile("traveler@example.com");
    }

    @Test
    @WithMockUser(username = "traveler@example.com", roles = { "USER" })
    void updateMyProfileShouldReturnBadRequestWhenPayloadInvalid() throws Exception {
        mockMvc.perform(put("/api/v1/users/me")
                .contentType(APPLICATION_JSON)
                .content("{\"displayName\":\"a\"}"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(userProfileService);
    }

    @Test
    @WithMockUser(username = "traveler@example.com", roles = { "USER" })
    void updateMyProfileShouldReturnOkWhenPayloadValid() throws Exception {
        when(userProfileService.updateMyProfile(eq("traveler@example.com"), any(UpdateUserProfileRequest.class)))
                .thenReturn(sampleResponse());

        mockMvc.perform(put("/api/v1/users/me")
                .contentType(APPLICATION_JSON)
                .content("""
                        {
                          "displayName": "Traveler One",
                          "nationality": "USA",
                          "preferredLanguage": "EN",
                          "preferredCurrency": "USD"
                        }
                        """))
                .andExpect(status().isOk());

        verify(userProfileService).updateMyProfile(eq("traveler@example.com"), any(UpdateUserProfileRequest.class));
    }

    private UserProfileResponse sampleResponse() {
        return new UserProfileResponse(
                UUID.fromString("5f8a8f9f-6d7a-4a56-9f9f-f3fa6f67f1b6"),
                "traveler@example.com",
                "ACTIVE",
                "Traveler One",
                null,
                null,
                "USA",
                SupportedLocale.EN,
                CurrencyCode.USD,
                "UTC",
                "Profile description",
                LocalDate.of(1990, 1, 1));
    }
}