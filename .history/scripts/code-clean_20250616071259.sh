#!/bin/bash
# Suppress Node.js deprecation warnings for VS Code extension development
export NODE_NO_WARNINGS=1
export NODE_OPTIONS="--no-deprecation --no-warnings"
code "$@"
