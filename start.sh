#!/bin/bash
PORT=${PORT:-5000}
exec next start --hostname 0.0.0.0 --port $PORT
