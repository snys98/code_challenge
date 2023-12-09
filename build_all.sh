#!/bin/bash
curDir=$(pwd)
for dir in ./apps/*/; do
    if [ -f "$dir/package.json" ]; then
        cd "$dir"
        pwsh ./build.ps1
        cd "$curDir"
    fi
done
