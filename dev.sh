#!/usr/bin/env bash

# ==============================================================================
# CaseHaven E-Commerce Platform - One-Click Full-Stack Dev Runner
# Runs both Spring Boot Backend (port 8080) and Vite React Frontend (port 5173)
# ==============================================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/Backend"
FRONTEND_DIR="$PROJECT_ROOT/Frontend"
ADMIN_DIR="$PROJECT_ROOT/Frontend-admin"

# Color Codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${GREEN}  Zando Store & POS - Dev Environment  ${NC}"
echo -e "${BLUE}======================================================${NC}"

# Cleanup background processes on Ctrl+C or EXIT
cleanup() {
    echo -e "\n${YELLOW}[SHUTDOWN] Stopping Backend, Frontend, and Admin services...${NC}"
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null
    fi
    if [ -n "$ADMIN_PID" ]; then
        kill "$ADMIN_PID" 2>/dev/null
    fi
    wait 2>/dev/null
    echo -e "${GREEN}[SHUTDOWN] All services stopped successfully.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# 1. Kill any stale processes on 8080, 5173, or 5174
echo -e "${YELLOW}[1/4] Checking ports 8080, 5173, and 5174...${NC}"
fuser -k 8080/tcp 2>/dev/null
fuser -k 5173/tcp 2>/dev/null
fuser -k 5174/tcp 2>/dev/null

# Memory limits to prevent Out of Memory (OOM Exit 137) on low RAM systems
export MAVEN_OPTS="-Xms64m -Xmx256m"
export NODE_OPTIONS="--max-old-space-size=256"

# 2. Start Spring Boot Backend
echo -e "${GREEN}[2/4] Launching Spring Boot Backend on http://localhost:8080 ...${NC}"
cd "$BACKEND_DIR" || exit 1
~/.local/bin/mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xms128m -Xmx384m -XX:+TieredCompilation -XX:TieredStopAtLevel=1" &
BACKEND_PID=$!

# Wait briefly for Backend to initialize
sleep 3

# 3. Start Vite React Frontend Storefront
echo -e "${GREEN}[3/4] Launching Customer Storefront on http://localhost:5173 ...${NC}"
cd "$FRONTEND_DIR" || exit 1
npm run dev &
FRONTEND_PID=$!

# 4. Start Vite React Frontend Admin
echo -e "${GREEN}[4/4] Launching Admin Dashboard on http://localhost:5174 ...${NC}"
cd "$ADMIN_DIR" || exit 1
npm run dev &
ADMIN_PID=$!

echo -e "\n${BLUE}======================================================${NC}"
echo -e "${GREEN}🚀 Application is running!${NC}"
echo -e "   - Customer Storefront: ${BLUE}http://localhost:5173${NC}"
echo -e "   - POS Admin Dashboard: ${BLUE}http://localhost:5174${NC}"
echo -e "   - Backend API:         ${BLUE}http://localhost:8080/api${NC}"
echo -e "   - H2 Console:          ${BLUE}http://localhost:8080/h2-console${NC}"
echo -e "${YELLOW}Press Ctrl + C to stop all services.${NC}"
echo -e "${BLUE}======================================================${NC}\n"

# Wait for both background processes
wait
