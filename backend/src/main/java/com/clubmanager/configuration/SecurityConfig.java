    package com.clubmanager.configuration;

import org.springframework.beans.factory.annotation.Value;
    import lombok.RequiredArgsConstructor;
    import org.springframework.context.annotation.Bean;
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

        private final JwtAthenticationFilter jwtAthenticationFilter;
        private final AuthenticationProvider authenticationProvider;
        private final JwtCookieAuthenticationFilter jwtCookieAuthenticationFilter;

        @Value("${app.cors.allowed-origins}")
        private String allowedOrigins;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            http
                    .cors(cors -> cors.configurationSource(request -> {
                        CorsConfiguration corsConfiguration = new CorsConfiguration();
                        corsConfiguration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(","))); // Orígenes del frontend, separados por coma
                        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                        corsConfiguration.addAllowedHeader("*"); // Permitir todos los encabezados
                        corsConfiguration.setAllowCredentials(true); // Permitir credenciales (cookies)
                        return corsConfiguration;
                    }))
                    .csrf().disable()
                    .authorizeHttpRequests()
                    .requestMatchers("/auth/**").permitAll()
                    .anyRequest().authenticated()
                    .and()
                    .sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    .and()
                    .authenticationProvider(authenticationProvider)
                    .addFilterBefore(jwtCookieAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                    .addFilterBefore(jwtAthenticationFilter, UsernamePasswordAuthenticationFilter.class);

            return http.build();
        }
    }
