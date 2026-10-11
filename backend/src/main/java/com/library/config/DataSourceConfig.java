package com.library.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.InetSocketAddress;
import java.net.Socket;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:jdbc:mysql://localhost:3306/library_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}")
    private String datasourceUrl;

    @Value("${spring.datasource.username:root}")
    private String username;

    @Value("${spring.datasource.password:1234}")
    private String password;

    @Value("${spring.datasource.driver-class-name:com.mysql.cj.jdbc.Driver}")
    private String driverClassName;

    @Bean
    @Primary
    public DataSource dataSource() {
        // If the URL is pointing to localhost but no local MySQL daemon is running on port 3306
        // (common when deploying to cloud containers before environment variables are configured),
        // gracefully fall back to in-memory H2 (MySQL Mode) so the container boots up successfully.
        if (datasourceUrl.contains("localhost:3306") || datasourceUrl.contains("127.0.0.1:3306")) {
            boolean isLocalMySQLAvailable = isPortOpen("127.0.0.1", 3306, 1200);
            if (!isLocalMySQLAvailable) {
                log.warn("===================================================================");
                log.warn("⚠️ Local MySQL (port 3306) is not reachable in this container.");
                log.warn("💡 Automatically falling back to in-memory database (MySQL mode) so");
                log.warn("   the service starts successfully and passes health probes.");
                log.warn("👉 To connect a cloud MySQL database (Aiven/TiDB/Railway), set");
                log.warn("   SPRING_DATASOURCE_URL in your Render Environment Variables.");
                log.warn("===================================================================");

                HikariConfig h2Config = new HikariConfig();
                h2Config.setDriverClassName("org.h2.Driver");
                h2Config.setJdbcUrl("jdbc:h2:mem:library_db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL");
                h2Config.setUsername("sa");
                h2Config.setPassword("");
                h2Config.setPoolName("FallbackH2Pool");
                return new HikariDataSource(h2Config);
            }
        }

        log.info("Connecting to target database: {}", datasourceUrl);
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(datasourceUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName(driverClassName);
        config.setPoolName("LibraryHikariPool");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(20000);
        return new HikariDataSource(config);
    }

    private boolean isPortOpen(String host, int port, int timeoutMs) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), timeoutMs);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
