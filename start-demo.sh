#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MCP_PID=""
AGENT_PID=""
FRONTEND_PID=""

cleanup() {
    echo ""
    echo "Shutting down demo..."
    [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null
    [ -n "$AGENT_PID" ] && kill "$AGENT_PID" 2>/dev/null
    [ -n "$MCP_PID" ] && kill "$MCP_PID" 2>/dev/null
    exit 0
}

trap cleanup EXIT INT TERM

wait_for_port() {
    local port=$1
    local name=$2
    local max_wait=60
    local waited=0
    echo "  Waiting for $name on port $port..."
    while ! curl -s "http://localhost:$port" > /dev/null 2>&1; do
        sleep 1
        waited=$((waited + 1))
        if [ "$waited" -ge "$max_wait" ]; then
            echo "  ERROR: $name did not start within ${max_wait}s"
            exit 1
        fi
    done
    echo "  $name is ready!"
}

echo "========================================"
echo "  Over-Engineered Help Desk Demo"
echo "========================================"
echo ""

# 1. Start MCP Server
echo "[1/3] Starting MCP Server (port 8081)..."
cd "$SCRIPT_DIR/help-desk-mcp-server"
./mvnw quarkus:dev -Dquarkus.console.enabled=false > /tmp/mcp-server.log 2>&1 &
MCP_PID=$!
wait_for_port 8081 "MCP Server"

# 2. Start Agent Backend
echo "[2/3] Starting Agent Backend (port 8080)..."
cd "$SCRIPT_DIR/help-desk-agent"
./mvnw quarkus:dev -Dquarkus.console.enabled=false > /tmp/agent.log 2>&1 &
AGENT_PID=$!
wait_for_port 8080 "Agent Backend"

# 3. Start Frontend
echo "[3/3] Starting Frontend (port 5173)..."
cd "$SCRIPT_DIR/help-desk-agent/src/main/webui"
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
wait_for_port 5173 "Frontend"

echo ""
echo "========================================"
echo "  Demo is ready!"
echo "  Open: http://localhost:5173"
echo "========================================"
echo ""
echo "Logs:"
echo "  MCP Server: /tmp/mcp-server.log"
echo "  Agent:      /tmp/agent.log"
echo "  Frontend:   /tmp/frontend.log"
echo ""
echo "Press Ctrl+C to stop all services."

wait
