# syntax=docker/dockerfile:1.7
FROM maven:3.9.10-eclipse-temurin-17 AS builder
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn -q -Dmaven.test.skip=true package

FROM eclipse-temurin:17-jre-jammy AS runtime
WORKDIR /app

RUN addgroup --system spring && adduser --system --ingroup spring spring

COPY --from=builder /app/target/backend-*.jar app.jar

ENV SPRING_PROFILES_ACTIVE=prod \
    SERVER_PORT=8080

EXPOSE 8080

USER spring:spring

ENTRYPOINT ["java", "-jar", "app.jar"]
