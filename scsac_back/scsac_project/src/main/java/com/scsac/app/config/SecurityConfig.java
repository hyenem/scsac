package com.scsac.app.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.scsac.app.security.JwtAuthenticaionFilter;
import com.scsac.app.security.MustUpdateAuthorizationManager;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {

	private final JwtAuthenticaionFilter jwtAuthenticationFilter;
	private final MustUpdateAuthorizationManager mustUpdateAuthorizationManager;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http
				.csrf(csrf->csrf.disable())
				.cors(cors -> cors
						.configurationSource(request -> {
							var config = new org.springframework.web.cors.CorsConfiguration();
							config.setAllowedOrigins(List.of("http://localhost:5173")); // 프론트 주소
							config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
							config.setAllowedHeaders(List.of("*"));
							config.setAllowCredentials(true);
							return config;
						})
						)
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/login").permitAll()
						.requestMatchers(HttpMethod.PUT, "/user").authenticated()
						.requestMatchers(HttpMethod.GET, "/user/me").authenticated()
						.anyRequest().access(mustUpdateAuthorizationManager)
						)
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
