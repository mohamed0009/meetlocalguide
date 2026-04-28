package com.meetlocalguide.platform.config;

import java.time.Duration;
import java.util.concurrent.Executor;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableCaching
public class AppInfraConfig {

    @Bean
    public TaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(12);
        executor.setQueueCapacity(200);
        executor.setThreadNamePrefix("mlg-async-");
        executor.initialize();
        return executor;
    }

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("guides-search", "tours-search");
    }
}
