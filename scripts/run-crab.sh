#!/usr/bin/env bash
set -euo pipefail

# Convenience wrapper for the bot:
# URL + optional flags -> run TransCrab pipeline locally.
#
# Usage:
#   ./scripts/run-crab.sh <url> [--lang zh] [--model <modelId>]
#
# If --model is omitted, TransCrab uses your OpenClaw default model.

node ./scripts/add-url.mjs "$@"
