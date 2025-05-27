# 1.8.4 (2025-05-27)

### Feature Improvements

* **docker:** Complete containerization with multi-platform builds (ARM64/AMD64)
* **build:** Optimized Docker builds with proper layer caching and .next directory handling
* **deployment:** Streamlined deployment with automated health checks and security improvements
* **dependencies:** Updated to latest versions of Next.js, React, and other core dependencies
* **security:** Enhanced security auditing and vulnerability management
* **performance:** Faster builds and reduced container size
* **merge:** Resolved conflicts with recent changes

# 1.8.3 (2025-05-27)

### Bug Fixes

* **permissions:** Fixed executable permissions for shell scripts and binaries
* **security:** Updated security audit script with improved messaging
* **audit:** Added SECURITY-AUDIT.md with detailed vulnerability information
* **eslint:** Fixed ESLint configuration and permissions

# 1.8.1 (2025-05-26)

### Bug Fixes

* **release:** update branch references from main/develop to master ([32e8bdb](https://github.com/jhead12/web3db-fileconnector/commit/32e8bdbfe8812d52f7439e4b93909eaf2706a9fd))
* **docs:** comprehensive README update with script documentation and NPM package usage
* **security:** address eval() removal and Helia migration improvements

### Features

* **testing:** add comprehensive pre-release validation scripts
* **docker:** enhanced Docker testing and validation


# 1.8.0 (2025-05-26)


### Bug Fixes

* **api:** missing import ([26d2148](https://github.com/jhead12/web3db-fileconnector/commit/26d21484418369cf25a724a349f116d16c09d002))
* attempt seed parsing before intializing keydid ([74f094f](https://github.com/jhead12/web3db-fileconnector/commit/74f094f9bfc946aca67701a617d5d5339c8ca046))
* **dash:data:** display bool & null ([1d5e6b3](https://github.com/jhead12/web3db-fileconnector/commit/1d5e6b3c1e7b859171fb8c92c5de883dddef767a))
* **dashboard:** timeago locale ([9dbf5cf](https://github.com/jhead12/web3db-fileconnector/commit/9dbf5cf94bfd3097f698839d331061f970e049ac))
* **dash:** missing variable initialization ([e77fd26](https://github.com/jhead12/web3db-fileconnector/commit/e77fd26977f2d15d331055fe4a8a9c174f40a989))
* **db:gql:** refresh schema if slot exists ([b7cb397](https://github.com/jhead12/web3db-fileconnector/commit/b7cb397d6658ff3b95e0c0a45e9e0b69ccbdf064))
* duplicate did parsing for client ([b9d9a7b](https://github.com/jhead12/web3db-fileconnector/commit/b9d9a7bc497b99769ce445d4d0e443c2c9b1114c))
* **editor:** add ace-builds dep, fix ace import ([84da4ba](https://github.com/jhead12/web3db-fileconnector/commit/84da4bac0769cc6449e89b94352ed0e5e6e31903))
* **env:** use cross-env for cross plat. support ([c144fdb](https://github.com/jhead12/web3db-fileconnector/commit/c144fdbd5015aa4203a4aefe32235ffdca29607d))
* **gql:vector:** support multiple vector queries, fix unused conditional ([5849c7f](https://github.com/jhead12/web3db-fileconnector/commit/5849c7fed8266e6645381a13355d39d0183e1a71))
* **gql:** invalid server var ([5b96149](https://github.com/jhead12/web3db-fileconnector/commit/5b96149a5e63d9f0bfb73494608bac76ceb491bd))
* missing function export ([f254577](https://github.com/jhead12/web3db-fileconnector/commit/f25457738a0776d77348e166e2a56f7610446a17))
* **next:** separate build process ([adff2e2](https://github.com/jhead12/web3db-fileconnector/commit/adff2e264319e17789ac1ce86be57cac57c5679d))
* **npm:** missing dependency ([4a47016](https://github.com/jhead12/web3db-fileconnector/commit/4a47016e3ae2473609765ad83335cf2077e18001))
* **pg:** redundant create extension calls ([0db9402](https://github.com/jhead12/web3db-fileconnector/commit/0db94020cd7494f31996ea76ed54dd0a65d81dc8))
* **plugin:evm:** unsubscribe error handling ([282c19b](https://github.com/jhead12/web3db-fileconnector/commit/282c19bb4b038b19e2fc9c7d8c37f22c37d6c343))
* **plugins:csv:** upload progress ([ac5c0ed](https://github.com/jhead12/web3db-fileconnector/commit/ac5c0edf3d51fedab6f272ea02d2ff4be854764b))
* **plugins:** attempt to stop ([d572294](https://github.com/jhead12/web3db-fileconnector/commit/d572294c4a478a2d65b962a84904d15a62724822))
* **plugins:** resolve paths with file:// prefix ([2ade3fb](https://github.com/jhead12/web3db-fileconnector/commit/2ade3fb4660d581ef3e15645854cf21241386ac0))
* **postgres:** detect SSL support ([a13f375](https://github.com/jhead12/web3db-fileconnector/commit/a13f375915a150d125f84ae71263530c2f043584))
* **readme:** fix npm install cli version ([78057eb](https://github.com/jhead12/web3db-fileconnector/commit/78057eb8fb84cd94f07b970b0d962985bb26010b))
* **settings:** account for global slot ([8b60298](https://github.com/jhead12/web3db-fileconnector/commit/8b60298c3bb597b9f258023114c22b351dffbab6))
* **studio:** temp show column type as custom (if UD) ([ffa2ab2](https://github.com/jhead12/web3db-fileconnector/commit/ffa2ab22f3bd408cf792eeaae32fd12160a9dc0e))
* update release scripts for master branch ([32e8bdb](https://github.com/jhead12/web3db-fileconnector/commit/32e8bdbfe8812d52f7439e4b93909eaf2706a9fd))
* using state variable _tableName to assign value to input element ([93942b4](https://github.com/jhead12/web3db-fileconnector/commit/93942b48cbf70aa0e6c6c38442959215f2a05fea))
* wait for indexing to be restarted ([8625263](https://github.com/jhead12/web3db-fileconnector/commit/8625263e56fc2ca65e9986313b3582732414de88))


### Features

* **auth:** check if node owner ([1f63e82](https://github.com/jhead12/web3db-fileconnector/commit/1f63e827cc56ce3a92f327471629ce518a4f8f0f))
* **codex:** codex plugin mvp ([8c3bbd9](https://github.com/jhead12/web3db-fileconnector/commit/8c3bbd9de735ade21339425c4c7c9817184dd1c6))
* **dash:** add crypto.subtle warning ([4a74dc7](https://github.com/jhead12/web3db-fileconnector/commit/4a74dc73253777eb769d92633ddf2e8c111be42d))
* **docker:** core docker image (docker init) ([2222703](https://github.com/jhead12/web3db-fileconnector/commit/2222703ee8d42a606a5d5a81f72ec47bd3146e36))
* **indexing:** enable index by stream id ([79fe4bb](https://github.com/jhead12/web3db-fileconnector/commit/79fe4bb6ee221ad77dfd0cdafc8f297ce2df6615))
* **logger:** add info logging and change defaults ([140b743](https://github.com/jhead12/web3db-fileconnector/commit/140b743a7ecf95017af0c43455aa4bd73903ee4d))
* **logger:** custom util.format and console output ([ac86d69](https://github.com/jhead12/web3db-fileconnector/commit/ac86d698e0bc9c5738240f4d500b4fff72050fa2))
* **logging:** add winston ([8f5ba6c](https://github.com/jhead12/web3db-fileconnector/commit/8f5ba6cf76d8f50efa4cae57e17beb179fa0d5b1))
* **logs:** add an auth logs route ([853e10b](https://github.com/jhead12/web3db-fileconnector/commit/853e10b4c66500084689fc427c049a15cd783c94))
* **logs:** import API and add logs UI ([65c1604](https://github.com/jhead12/web3db-fileconnector/commit/65c16040e3fdd2bd0d6c721f8544bb26fe952fa4))
* **logs:** migrate console.logs to winston ([cb35ace](https://github.com/jhead12/web3db-fileconnector/commit/cb35ace8a20c8a977b5aa92b52c04965cbd08b7b))
* **next:** autobuild the app in prod ([36c0bfa](https://github.com/jhead12/web3db-fileconnector/commit/36c0bfaaf6023151a2573833d853aaaea8288b4e))
* **package.json:** metadata and format command ([480e7f3](https://github.com/jhead12/web3db-fileconnector/commit/480e7f3a13c74ee9cabfffd4ae000ba92545e5df))
* **plugins:** CODEX plugin logo placeholder ([f0a739a](https://github.com/jhead12/web3db-fileconnector/commit/f0a739acb59103fc5f155369fc3df8e36f59f380))
* **plugins:** enable onInstall plugin hook ([1e3d2b0](https://github.com/jhead12/web3db-fileconnector/commit/1e3d2b021610f8df6a48204d27e16fcaf06edff2))
* **plugins:** ignore plugin data files ([5e8f79b](https://github.com/jhead12/web3db-fileconnector/commit/5e8f79b441213634fd49a768d1ac765a84d39e55))
* **query:** build and run a query using JSON ([3c35d2f](https://github.com/jhead12/web3db-fileconnector/commit/3c35d2f6fa44f1b6c9c2617a2189f33619e577ef))
* **settings:** update entire settings file ([af90dd8](https://github.com/jhead12/web3db-fileconnector/commit/af90dd820ae479a729a38fbbd3fcc4535df93d38))
* **standards:** add prettier ([c742f4a](https://github.com/jhead12/web3db-fileconnector/commit/c742f4a4c10043638e3df9ee65f20ac2f6034cd3))
* **standards:** add prettier config ([6b59b6f](https://github.com/jhead12/web3db-fileconnector/commit/6b59b6fb3b4c1fe03673111f28fa2f9bce8ee298))
* **temp:backfill:** unoptimized script to migrate old models_indexed ([f37f860](https://github.com/jhead12/web3db-fileconnector/commit/f37f860f8549c61db884f3aad6d6c603202ab7b6))



# 1.8.0 (2025-05-26)


### Bug Fixes

* **api:** missing import ([26d2148](https://github.com/jhead12/web3db-fileconnector/commit/26d21484418369cf25a724a349f116d16c09d002))
* attempt seed parsing before intializing keydid ([74f094f](https://github.com/jhead12/web3db-fileconnector/commit/74f094f9bfc946aca67701a617d5d5339c8ca046))
* **dash:data:** display bool & null ([1d5e6b3](https://github.com/jhead12/web3db-fileconnector/commit/1d5e6b3c1e7b859171fb8c92c5de883dddef767a))
* **dashboard:** timeago locale ([9dbf5cf](https://github.com/jhead12/web3db-fileconnector/commit/9dbf5cf94bfd3097f698839d331061f970e049ac))
* **dash:** missing variable initialization ([e77fd26](https://github.com/jhead12/web3db-fileconnector/commit/e77fd26977f2d15d331055fe4a8a9c174f40a989))
* **db:gql:** refresh schema if slot exists ([b7cb397](https://github.com/jhead12/web3db-fileconnector/commit/b7cb397d6658ff3b95e0c0a45e9e0b69ccbdf064))
* duplicate did parsing for client ([b9d9a7b](https://github.com/jhead12/web3db-fileconnector/commit/b9d9a7bc497b99769ce445d4d0e443c2c9b1114c))
* **editor:** add ace-builds dep, fix ace import ([84da4ba](https://github.com/jhead12/web3db-fileconnector/commit/84da4bac0769cc6449e89b94352ed0e5e6e31903))
* **env:** use cross-env for cross plat. support ([c144fdb](https://github.com/jhead12/web3db-fileconnector/commit/c144fdbd5015aa4203a4aefe32235ffdca29607d))
* **gql:vector:** support multiple vector queries, fix unused conditional ([5849c7f](https://github.com/jhead12/web3db-fileconnector/commit/5849c7fed8266e6645381a13355d39d0183e1a71))
* **gql:** invalid server var ([5b96149](https://github.com/jhead12/web3db-fileconnector/commit/5b96149a5e63d9f0bfb73494608bac76ceb491bd))
* missing function export ([f254577](https://github.com/jhead12/web3db-fileconnector/commit/f25457738a0776d77348e166e2a56f7610446a17))
* **next:** separate build process ([adff2e2](https://github.com/jhead12/web3db-fileconnector/commit/adff2e264319e17789ac1ce86be57cac57c5679d))
* **npm:** missing dependency ([4a47016](https://github.com/jhead12/web3db-fileconnector/commit/4a47016e3ae2473609765ad83335cf2077e18001))
* **pg:** redundant create extension calls ([0db9402](https://github.com/jhead12/web3db-fileconnector/commit/0db94020cd7494f31996ea76ed54dd0a65d81dc8))
* **plugin:evm:** unsubscribe error handling ([282c19b](https://github.com/jhead12/web3db-fileconnector/commit/282c19bb4b038b19e2fc9c7d8c37f22c37d6c343))
* **plugins:csv:** upload progress ([ac5c0ed](https://github.com/jhead12/web3db-fileconnector/commit/ac5c0edf3d51fedab6f272ea02d2ff4be854764b))
* **plugins:** attempt to stop ([d572294](https://github.com/jhead12/web3db-fileconnector/commit/d572294c4a478a2d65b962a84904d15a62724822))
* **plugins:** resolve paths with file:// prefix ([2ade3fb](https://github.com/jhead12/web3db-fileconnector/commit/2ade3fb4660d581ef3e15645854cf21241386ac0))
* **postgres:** detect SSL support ([a13f375](https://github.com/jhead12/web3db-fileconnector/commit/a13f375915a150d125f84ae71263530c2f043584))
* **readme:** fix npm install cli version ([78057eb](https://github.com/jhead12/web3db-fileconnector/commit/78057eb8fb84cd94f07b970b0d962985bb26010b))
* **settings:** account for global slot ([8b60298](https://github.com/jhead12/web3db-fileconnector/commit/8b60298c3bb597b9f258023114c22b351dffbab6))
* **studio:** temp show column type as custom (if UD) ([ffa2ab2](https://github.com/jhead12/web3db-fileconnector/commit/ffa2ab22f3bd408cf792eeaae32fd12160a9dc0e))
* using state variable _tableName to assign value to input element ([93942b4](https://github.com/jhead12/web3db-fileconnector/commit/93942b48cbf70aa0e6c6c38442959215f2a05fea))
* wait for indexing to be restarted ([8625263](https://github.com/jhead12/web3db-fileconnector/commit/8625263e56fc2ca65e9986313b3582732414de88))


### Features

* **auth:** check if node owner ([1f63e82](https://github.com/jhead12/web3db-fileconnector/commit/1f63e827cc56ce3a92f327471629ce518a4f8f0f))
* **codex:** codex plugin mvp ([8c3bbd9](https://github.com/jhead12/web3db-fileconnector/commit/8c3bbd9de735ade21339425c4c7c9817184dd1c6))
* **dash:** add crypto.subtle warning ([4a74dc7](https://github.com/jhead12/web3db-fileconnector/commit/4a74dc73253777eb769d92633ddf2e8c111be42d))
* **docker:** core docker image (docker init) ([2222703](https://github.com/jhead12/web3db-fileconnector/commit/2222703ee8d42a606a5d5a81f72ec47bd3146e36))
* **indexing:** enable index by stream id ([79fe4bb](https://github.com/jhead12/web3db-fileconnector/commit/79fe4bb6ee221ad77dfd0cdafc8f297ce2df6615))
* **logger:** add info logging and change defaults ([140b743](https://github.com/jhead12/web3db-fileconnector/commit/140b743a7ecf95017af0c43455aa4bd73903ee4d))
* **logger:** custom util.format and console output ([ac86d69](https://github.com/jhead12/web3db-fileconnector/commit/ac86d698e0bc9c5738240f4d500b4fff72050fa2))
* **logging:** add winston ([8f5ba6c](https://github.com/jhead12/web3db-fileconnector/commit/8f5ba6cf76d8f50efa4cae57e17beb179fa0d5b1))
* **logs:** add an auth logs route ([853e10b](https://github.com/jhead12/web3db-fileconnector/commit/853e10b4c66500084689fc427c049a15cd783c94))
* **logs:** import API and add logs UI ([65c1604](https://github.com/jhead12/web3db-fileconnector/commit/65c16040e3fdd2bd0d6c721f8544bb26fe952fa4))
* **logs:** migrate console.logs to winston ([cb35ace](https://github.com/jhead12/web3db-fileconnector/commit/cb35ace8a20c8a977b5aa92b52c04965cbd08b7b))
* **next:** autobuild the app in prod ([36c0bfa](https://github.com/jhead12/web3db-fileconnector/commit/36c0bfaaf6023151a2573833d853aaaea8288b4e))
* **package.json:** metadata and format command ([480e7f3](https://github.com/jhead12/web3db-fileconnector/commit/480e7f3a13c74ee9cabfffd4ae000ba92545e5df))
* **plugins:** CODEX plugin logo placeholder ([f0a739a](https://github.com/jhead12/web3db-fileconnector/commit/f0a739acb59103fc5f155369fc3df8e36f59f380))
* **plugins:** enable onInstall plugin hook ([1e3d2b0](https://github.com/jhead12/web3db-fileconnector/commit/1e3d2b021610f8df6a48204d27e16fcaf06edff2))
* **plugins:** ignore plugin data files ([5e8f79b](https://github.com/jhead12/web3db-fileconnector/commit/5e8f79b441213634fd49a768d1ac765a84d39e55))
* **query:** build and run a query using JSON ([3c35d2f](https://github.com/jhead12/web3db-fileconnector/commit/3c35d2f6fa44f1b6c9c2617a2189f33619e577ef))
* **settings:** update entire settings file ([af90dd8](https://github.com/jhead12/web3db-fileconnector/commit/af90dd820ae479a729a38fbbd3fcc4535df93d38))
* **standards:** add prettier ([c742f4a](https://github.com/jhead12/web3db-fileconnector/commit/c742f4a4c10043638e3df9ee65f20ac2f6034cd3))
* **standards:** add prettier config ([6b59b6f](https://github.com/jhead12/web3db-fileconnector/commit/6b59b6fb3b4c1fe03673111f28fa2f9bce8ee298))
* **temp:backfill:** unoptimized script to migrate old models_indexed ([f37f860](https://github.com/jhead12/web3db-fileconnector/commit/f37f860f8549c61db884f3aad6d6c603202ab7b6))



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
