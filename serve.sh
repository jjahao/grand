#!/bin/bash
cd /Volumes/AI_HQ/grand_store
exec python3 -m http.server ${PORT:-8899}
