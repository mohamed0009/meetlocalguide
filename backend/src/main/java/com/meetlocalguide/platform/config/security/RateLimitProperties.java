package com.meetlocalguide.platform.config.security;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "app.security.rate-limit")
public class RateLimitProperties {

    @Min(1)
    private long authRequestsPerMinute = 30;
}