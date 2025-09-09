# Stage 1: Build the uberjar
FROM clojure:lein-alpine AS builder

WORKDIR /usr/src/app

COPY project.clj .
COPY src ./src

# Download dependencies and build the uberjar
RUN lein uberjar

# Stage 2: Create the final, smaller image
FROM openjdk:11-jre-slim

WORKDIR /usr/src/app

# Copy the uberjar from the builder stage
COPY --from=builder /usr/src/app/target/uberjar/temperature-api.jar .

# Expose the port the app runs on
EXPOSE 8081

# Set the entrypoint to run the uberjar
CMD ["java", "-jar", "temperature-api.jar"]
