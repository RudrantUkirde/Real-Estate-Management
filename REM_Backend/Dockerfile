# ------------ Stage 1: Build ------------
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Set the working directory
WORKDIR /app

#Copy pom.xml and install dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

#Copy source code and build application
COPY src ./src
RUN mvn clean package -DskipTests


# ------------ Stage 2: Run ------------
FROM eclipse-temurin:21-jdk

# Set the working directory for the runtime container
WORKDIR /app

# Copy the built jar from the builder stage
COPY --from=builder /app/target/REM_Backend-0.0.1-SNAPSHOT.jar .

# Expose the port Spring Boot uses
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "/app/REM_Backend-0.0.1-SNAPSHOT.jar"]
