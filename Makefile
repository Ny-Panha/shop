.PHONY: all dev run backend frontend test build clean stop help

# Default target
all: dev

# Run both Backend and Frontend together
dev run:
	@./dev.sh

# Run Backend Spring Boot alone
backend:
	@echo "Starting Spring Boot Backend on http://localhost:8080..."
	@cd Backend && ~/.local/bin/mvn spring-boot:run

# Run Frontend React Vite alone
frontend:
	@echo "Starting Vite Frontend on http://localhost:5173..."
	@cd Frontend && npm run dev

# Run all test suites (JUnit 5 + Node E2E)
test:
	@echo "Running Backend JUnit 5 tests..."
	@cd Backend && ~/.local/bin/mvn test
	@echo "Running End-to-End Test Suite..."
	@node tests/phase8_e2e_suite.js

# Build production artifacts (JAR and Frontend dist)
build:
	@echo "Building Backend Production JAR..."
	@cd Backend && ~/.local/bin/mvn clean package -DskipTests
	@echo "Building Frontend Production Bundle..."
	@cd Frontend && npm run build
	@echo "Build complete! Artifacts:"
	@echo "  - Backend JAR: Backend/target/shop-backend-1.0.0.jar"
	@echo "  - Frontend:    Frontend/dist"

# Stop any running processes on dev ports
stop:
	@echo "Stopping processes on ports 8080 and 5173..."
	@-fuser -k 8080/tcp 2>/dev/null || true
	@-fuser -k 5173/tcp 2>/dev/null || true
	@echo "Ports cleared."

# Clean build folders
clean:
	@echo "Cleaning build directories..."
	@cd Backend && ~/.local/bin/mvn clean
	@rm -rf Frontend/dist
	@echo "Clean completed."

# Help menu
help:
	@echo "CaseHaven Dev Automation Commands:"
	@echo "  make dev      - Start both Backend and Frontend together"
	@echo "  make backend  - Start Spring Boot Backend only (port 8080)"
	@echo "  make frontend - Start React Vite Frontend only (port 5173)"
	@echo "  make test     - Run JUnit 5 tests and Node E2E suite"
	@echo "  make build    - Compile production JAR and frontend bundle"
	@echo "  make stop     - Kill any processes running on ports 8080 and 5173"
	@echo "  make clean    - Clean target and dist folders"
