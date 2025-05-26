# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.0] - 2025-05-26

### Security
- **FIXED**: Removed insecure `eval()` usage from plugin system
- **FIXED**: Updated multiple vulnerable dependencies
- **FIXED**: Removed deprecated packages to improve security posture

### Added
- **NEW**: Simplified IPFS interface using Helia with fallback support
- **NEW**: Comprehensive release automation scripts
- **NEW**: Security testing in CI/CD pipeline
- **NEW**: Conventional changelog generation
- **NEW**: Enhanced npm publishing workflow

### Changed
- **MIGRATION**: Completed migration from ipfs-http-client to Helia
- **MIGRATION**: Replaced client-side IPFS with safe placeholder functions
- **UPGRADE**: Updated package version from 1.7.0 to 1.8.0
- **IMPROVEMENT**: Enhanced server-side IPFS configuration with error handling

### Removed
- **CLEANUP**: Removed deprecated `@xmtp/frames-validator` (no longer supported)
- **CLEANUP**: Removed deprecated `ipfs-http-client` package
- **SECURITY**: Removed unsafe `eval()` execution in plugin system

### Dependencies
- Added: `multiformats@^13.3.6` for CID operations
- Added: `blockstore-core@^5.0.3` for IPFS storage
- Added: `datastore-core@^10.0.3` for IPFS storage
- Added: `conventional-changelog-cli@^5.0.0` for release automation

### Technical Details
- IPFS functionality now uses Helia with simplified configuration
- Client-side IPFS replaced with placeholder functions for security
- Server-side IPFS includes fallback mechanisms for reliability
- Security vulnerabilities from Ceramic dependencies documented but cannot be directly fixed

### Notes
- Remaining security vulnerabilities are from Ceramic Network dependencies (transitive)
- All direct dependencies have been updated to secure versions
- IPFS functionality maintains backward compatibility through abstraction layer

## [Unreleased]

### Added
- Initial release preparation
- Security vulnerability scanning and fixes
