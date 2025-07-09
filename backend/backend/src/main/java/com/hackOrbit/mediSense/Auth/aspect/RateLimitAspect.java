package com.hackOrbit.mediSense.Auth.aspect;

import com.hackOrbit.mediSense.Auth.util.RateLimit;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Aspect
@Component
@Slf4j
public class RateLimitAspect {


    private final Map<String, Deque<Long>> requestHistory = new ConcurrentHashMap<>();

    @Around("@annotation(rateLimit)")
    public Object rateLimitHandler(ProceedingJoinPoint joinPoint, RateLimit rateLimit) throws Throwable {
        String key = rateLimit.key();
        int maxRequests = rateLimit.maxRequests();
        long timeWindow = rateLimit.timeWindow(); // in milliseconds

        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
                .getRequest();
        // Use X-Forwarded-For for real client IP if present (for deployments behind proxy/load balancer)
        String clientIp = Optional.ofNullable(request.getHeader("X-Forwarded-For"))
                .map(xff -> xff.split(",")[0].trim())
                .orElse(request.getRemoteAddr());
        String mapKey = key + ":" + clientIp;

        long currentTime = Instant.now().toEpochMilli();

        requestHistory.putIfAbsent(mapKey, new ArrayDeque<>());
        Deque<Long> timestamps = requestHistory.get(mapKey);

        synchronized (timestamps) {
            // Remove timestamps older than the time window
            while (!timestamps.isEmpty() && currentTime - timestamps.peekFirst() > timeWindow) {
                timestamps.pollFirst();
            }

            if (timestamps.size() >= maxRequests) {
                log.warn("Rate limit exceeded for key: {} (IP: {})", key, clientIp);
                return ResponseEntity
                        .status(429)
                        .header("Retry-After", String.valueOf(timeWindow / 1000))
                        .body("Too many requests. Please try again later.");
            }

            // Record this request
            timestamps.addLast(currentTime);
        }

        return joinPoint.proceed();
    }
}