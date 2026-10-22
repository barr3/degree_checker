#!/bin/sh
# Download the 6CTMA program plan for each admission round into $1 (default: ./pages).
# Admission round ids are listed in COHORTS in parse.py.
out="${1:-pages}"; mkdir -p "$out"
for id in 5270 5480 5763 6051 6330; do
  curl -sSfL "https://studieinfo.liu.se/program/6CTMA/$id" -o "$out/page_$id.html" && echo "fetched $id"
done
