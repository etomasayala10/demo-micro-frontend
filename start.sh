#!/bin/bash
# start.sh — Inicia ambos servidores en terminales separadas

echo "========================================"
echo "  MFE Demo — Angular Shell + Vue Remote"
echo "========================================"
echo ""
echo "Iniciando Vue Remote en :3000 ..."
cd vue-remote && npm install --silent && npm run build && npm run preview &
VUE_PID=$!

echo "Esperando que Vue Remote compile..."
sleep 8

echo ""
echo "Iniciando Angular Shell en :4200 ..."
cd ../angular-shell && npm install --silent && npm run dev &
ANG_PID=$!

echo ""
echo "========================================"
echo "  Vue Remote  → http://localhost:3000"
echo "  Angular Shell → http://localhost:4200"
echo ""
echo "  Login: admin@mfe.com / admin123"
echo "========================================"
echo ""
echo "Presiona Ctrl+C para detener ambos servidores."

trap "kill $VUE_PID $ANG_PID 2>/dev/null; exit" INT TERM
wait
