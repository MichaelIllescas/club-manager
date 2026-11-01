    package com.clubmanager.configuration;

import org.springframework.beans.factory.annotation.Value;
    import lombok.RequiredArgsConstructor;
    import org.springframework.context.annotation.Bean;
    import org.springframework.http.HttpMethod;
    import org.springframework.http.HttpStatus;
    import org.springframework.security.web.authentication.HttpStatusEntryPoint;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.security.authentication.AuthenticationProvider;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.config.http.SessionCreationPolicy;
    import org.springframework.security.web.SecurityFilterChain;
    import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
    import org.springframework.web.cors.CorsConfiguration;

    import java.util.Arrays;
    @Configuration
    @EnableWebSecurity
    @RequiredArgsConstructor
    public class SecurityConfig {

        private final AuthenticationProvider authenticationProvider;
        private final JwtCookieAuthenticationFilter jwtCookieAuthenticationFilter;

        @Value("${app.cors.allowed-origins}")
        private String allowedOrigins;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            http
                    .cors(cors -> cors.configurationSource(request -> {
                        CorsConfiguration corsConfiguration = new CorsConfiguration();
                        corsConfiguration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));  // Comma-separated frontend origins
                        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                        corsConfiguration.addAllowedHeader("*");
                        corsConfiguration.setAllowCredentials(true);
                        return corsConfiguration;
                    }))
                    .csrf().disable()
                    .authorizeHttpRequests()
                    .requestMatchers("/auth/login", "/auth/logout").permitAll()
                    // Admin-only operations
                    .requestMatchers("/auth/register").hasAuthority("ADMIN")
                    .requestMatchers("/api/users/me", "/api/users/me/password").authenticated()
                    .requestMatchers("/api/users/**", "/api/revenue/**").hasAuthority("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/api/categories/**", "/api/fees/**").hasAuthority("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/fees/**").hasAuthority("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/fees/**").hasAuthority("ADMIN")
                    .anyRequest().authenticated()
                    .and()
                    .sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    .and()
                    // Without a valid session respond 401, so the frontend goes back to the login page
                    .exceptionHandling()
                    .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                    .and()
                    .authenticationProvider(authenticationProvider)
                    .addFilterBefore(jwtCookieAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

            return http.build();
        }
    }
