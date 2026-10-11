# ===================================================================
# Stage 1: Build Spring Boot Application
# ===================================================================
FROM maven:3.9-eclipse-temurin-17-alpine AS build

WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy application source code
COPY src ./src

# Package production executable JAR
RUN mvn clean package -DskipTests

# ===================================================================
# Stage 2: Production JRE Runtime
# ===================================================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create unprivileged system user for security
RUN addgroup -S spring && adduser -S spring -G spring

# Copy packaged jar from build stage
COPY --from=build /app/target/library-management-system-*.jar /app/app.jar

# JVM options optimized for containers (RAM percentage, entropy source)
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"
ENV PORT=8080

EXPOSE 8080

# Switch to non-root user
USER spring:spring

# Actuator Health Check
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT:-8080}/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar /app/app.jar"]
