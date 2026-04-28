package com.meetlocalguide.platform.common.security;

import org.springframework.stereotype.Component;
import org.springframework.web.util.HtmlUtils;

@Component
public class InputSanitizer {

    public String clean(String value) {
        if (value == null) {
            return null;
        }
        return HtmlUtils.htmlEscape(value.trim());
    }
}
