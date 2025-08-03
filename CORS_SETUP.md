# Backend CORS Configuration Guide

## 🔧 Fix CORS Issues for Deployment

Your Spring Boot backend needs to allow requests from your deployed frontend domain.

### 1. Global CORS Configuration (Recommended)

Create a `CorsConfig.java` file in your Spring Boot project:

```java
package com.yourpackage.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(
                    "http://localhost:3000",
                    "https://*.netlify.app",
                    "https://*.vercel.app",
                    "https://your-custom-domain.com"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### 2. Controller-Level CORS (Alternative)

Add to your controllers:

```java
@RestController
@CrossOrigin(origins = {
    "http://localhost:3000",
    "https://*.netlify.app",
    "https://*.vercel.app"
})
public class YourController {
    // Your endpoints
}
```

### 3. Security Configuration

If you're using Spring Security, update your `SecurityConfig`:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().and() // Enable CORS
            .csrf().disable() // Disable CSRF for API
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/auth/**").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:3000",
            "https://*.netlify.app",
            "https://*.vercel.app"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### 4. Application Properties

Add to `application.properties`:

```properties
# CORS settings
server.port=8080
spring.web.cors.allowed-origins=http://localhost:3000,https://*.netlify.app,https://*.vercel.app
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

## 🚀 Deployment Tips

1. **Replace wildcards** with your actual domain once deployed
2. **Test CORS** using browser dev tools
3. **Check OPTIONS requests** are handled correctly
4. **Use HTTPS** in production for security

## 🔍 Testing CORS

Test your CORS setup:

```bash
curl -H "Origin: https://your-app.netlify.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://your-backend-url.com/auth/user-varification/login
```
