#!/bin/bash

echo "========================================"
echo "  Pre-Demo Checklist"
echo "========================================"
echo ""

PASS=0
FAIL=0

check() {
    local label=$1
    local result=$2
    if [ "$result" = "true" ]; then
        echo "  [PASS] $label"
        PASS=$((PASS + 1))
    else
        echo "  [FAIL] $label"
        FAIL=$((FAIL + 1))
    fi
}

# Java
JAVA_OK="false"
if command -v java &> /dev/null; then
    JAVA_VER=$(java -version 2>&1 | head -1 | grep -o '"[0-9][0-9]*' | tr -d '"')
    if [ "$JAVA_VER" -ge 25 ] 2>/dev/null; then
        JAVA_OK="true"
        check "Java $JAVA_VER installed (>= 25 required)" "$JAVA_OK"
    else
        check "Java $JAVA_VER installed (>= 25 required)" "false"
    fi
else
    check "Java installed (>= 25 required)" "false"
fi

# Node.js
NODE_OK="false"
if command -v node &> /dev/null; then
    NODE_VER=$(node -v | sed 's/v\([0-9]*\).*/\1/')
    if [ "$NODE_VER" -ge 20 ] 2>/dev/null; then
        NODE_OK="true"
        check "Node.js v$NODE_VER installed (>= 20 required)" "$NODE_OK"
    else
        check "Node.js v$NODE_VER installed (>= 20 required)" "false"
    fi
else
    check "Node.js installed (>= 20 required)" "false"
fi

# OpenAI API Key
if [ -n "$OPENAI_API_KEY" ]; then
    KEY_PREVIEW="${OPENAI_API_KEY:0:8}..."
    check "OPENAI_API_KEY set ($KEY_PREVIEW)" "true"
else
    check "OPENAI_API_KEY environment variable" "false"
fi

# Container runtime (for PostgreSQL DevServices)
if command -v podman &> /dev/null && podman info &> /dev/null; then
    check "Podman running (for PostgreSQL DevServices)" "true"
elif command -v docker &> /dev/null && docker info &> /dev/null; then
    check "Docker running (for PostgreSQL DevServices)" "true"
else
    check "Podman or Docker running (for PostgreSQL DevServices)" "false"
fi

# Port availability
for port in 8080 8081 5173; do
    if ! lsof -i ":$port" &> /dev/null; then
        check "Port $port available" "true"
    else
        check "Port $port available (in use)" "false"
    fi
done

# npm dependencies
if [ -d "help-desk-agent/src/main/webui/node_modules" ]; then
    check "Frontend dependencies installed" "true"
else
    check "Frontend dependencies installed (run: cd help-desk-agent/src/main/webui && npm install)" "false"
fi

echo ""
echo "========================================"
echo "  Results: $PASS passed, $FAIL failed"
echo "========================================"

if [ "$FAIL" -gt 0 ]; then
    echo ""
    echo "  Fix the failing checks before starting the demo."
    echo "  Then run: ./start-demo.sh"
    exit 1
else
    echo ""
    echo "  All checks passed! Run: ./start-demo.sh"
fi
