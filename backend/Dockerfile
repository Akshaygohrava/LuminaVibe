# Multi-stage Dockerfile for LuminaVibe Spring Boot Backend

# -----------------------------
# Stage 1: Build application JAR
# -----------------------------
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Cache Maven dependencies by copying pom.xml first
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code and build project
COPY src ./src
RUN mvn clean package -DskipTests

# -----------------------------
# Stage 2: Runtime image
# -----------------------------
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create upload directories for user assets
RUN mkdir -p uploads/posts uploads/stories

# Copy executable jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose backend port
EXPOSE 8080

# Run Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]

