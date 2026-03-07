#!/usr/bin/env bash
# Test auth API with curl. Run AFTER starting backend: npm run backend (from repo root)
# Usage: ./test-auth-curl.sh   or   bash test-auth-curl.sh

BASE="${1:-http://localhost:3001}"

echo "=== Testing auth API at $BASE ==="
echo ""
echo "1. GET /api/health"
curl -s -w "  [HTTP %{http_code}]\n" "$BASE/api/health"
echo ""
echo "2. GET /api/auth (auth loaded?)"
curl -s -w "  [HTTP %{http_code}]\n" "$BASE/api/auth"
echo ""
echo "3. GET /api/auth/session"
curl -s -w "  [HTTP %{http_code}]\n" "$BASE/api/auth/session"
echo ""
echo "4. POST /api/auth/logout"
curl -s -w "  [HTTP %{http_code}]\n" -X POST "$BASE/api/auth/logout" -H "Content-Type: application/json"
echo ""
echo "5. POST /api/auth/login"
curl -s -w "  [HTTP %{http_code}]\n" -X POST "$BASE/api/auth/login" -H "Content-Type: application/json" -d '{"name":"Test Seller"}'
echo ""
echo "6. GET /api/auth/session (after login)"
curl -s -w "  [HTTP %{http_code}]\n" "$BASE/api/auth/session"
echo ""
echo "Done. 404 on logout/session = old backend on 3001; stop it and run: npm run backend"
