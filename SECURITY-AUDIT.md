# Security Audit Report

**Date:** 2025-05-30

## Overview

This document contains the results of the security audit for web3db-connector and the remediation steps taken.

## Fixed Vulnerabilities

The following direct dependencies were patched to secure versions:

* ws@8.17.1
* axios@0.30.0
* nanoid@5.0.9
* @babel/runtime@7.26.10
* parse-duration@2.1.3
* secp256k1@5.0.1

## Transitive Dependencies

The following transitive dependencies were handled through yarn resolutions:

* ws:8.17.1
* secp256k1:5.0.1
* parse-duration:2.1.3
* axios:0.30.0
* nanoid:5.0.9
* @babel/runtime:7.26.10

## Remaining Vulnerabilities

Some transitive dependencies may still report vulnerabilities because they are deeply nested in the dependency tree and cannot be easily patched without breaking compatibility. These are documented below:

1. Some dependencies within @composedb/devtools and @ceramicnetwork/cli packages may still report vulnerabilities.
2. The project team should consider upgrading these dependencies in a future minor release.
3. Most critical security issues have been addressed in the current version.

## Recommendation

Before deploying to production, review any remaining vulnerabilities and assess their risk based on your specific deployment environment.
