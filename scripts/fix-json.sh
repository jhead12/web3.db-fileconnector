#!/bin/bash
jq '.' package.json > package.json.tmp && mv package.json.tmp package.json
