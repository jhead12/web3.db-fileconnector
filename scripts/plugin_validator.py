#!/usr/bin/env python3
"""
Web3DB Connector Plugin Validator

This script validates plugins for security issues, code quality, and compatibility.
It can be run as a standalone tool or as part of a CI/CD pipeline.

Usage:
    python plugin_validator.py --id my-plugin
    python plugin_validator.py --path /path/to/plugin
    python plugin_validator.py --all

Author: web3db-connector Team
Date: May 30, 2025
"""

import os
import sys
import json
import argparse
import subprocess
import re
import logging
import tempfile
import shutil
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("plugin_validator")

# Path constants
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
PLUGINS_DIR = os.path.join(PROJECT_ROOT, "server", "plugins")

# Security check patterns
SECURITY_PATTERNS = {
    "arbitrary_code_execution": [
        r"eval\s*\(",
        r"new\s+Function\s*\(",
        r"setTimeout\s*\(\s*['\"](.*?)['\"]",
        r"setInterval\s*\(\s*['\"](.*?)['\"]"
    ],
    "command_execution": [
        r"exec\s*\(",
        r"execSync\s*\(",
        r"spawn\s*\(",
        r"spawnSync\s*\(",
        r"child_process",
        r"execFile\s*\("
    ],
    "file_system_access": [
        r"fs\.(write|append|create|unlink|rm|mkdir|rmdir|chmod|chown)",
        r"fs\.(read|readFile)(?!.*['\"]package\.json['\"])",
        r"path\.resolve\s*\([^)]*\.\.[^)]*\)"
    ],
    "network_access": [
        r"http\.(request|get)\s*\(",
        r"https\.(request|get)\s*\(",
        r"net\.(connect|createConnection|createServer)",
        r"axios\.(get|post|put|delete|patch)"
    ]
}

# Safe module patterns (these are allowed even if they match security patterns)
SAFE_PATTERNS = [
    r"logger\.(info|debug|warn|error)",
    r"console\.(log|info|warn|error)"
]

class PluginValidator:
    """Main class for validating web3db-connector plugins"""
    
    def __init__(self):
        """Initialize plugin validator"""
        self.issues = []
        self.warnings = []
        self.plugin_id = ""
        self.plugin_path = ""
    
    def validate_plugin(self, plugin_id: str = None, plugin_path: str = None) -> bool:
        """Validate a single plugin by ID or path"""
        if plugin_id:
            self.plugin_id = plugin_id
            self.plugin_path = os.path.join(PLUGINS_DIR, plugin_id)
        elif plugin_path:
            self.plugin_path = plugin_path
            self.plugin_id = os.path.basename(plugin_path)
        else:
            logger.error("Either plugin ID or plugin path must be provided")
            return False
        
        if not os.path.exists(self.plugin_path):
            logger.error(f"Plugin not found at path: {self.plugin_path}")
            return False
        
        logger.info(f"Validating plugin: {self.plugin_id}")
        
        # Reset issues and warnings
        self.issues = []
        self.warnings = []
        
        # Run all validation checks
        self._validate_structure()
        self._validate_settings()
        self._validate_security()
        self._validate_code_quality()
        self._validate_dependencies()
        
        # Print validation results
        self._print_validation_results()
        
        # Return True if no issues were found
        return len(self.issues) == 0
    
    def validate_all_plugins(self) -> Dict[str, bool]:
        """Validate all plugins in the plugins directory"""
        results = {}
        
        # List all subdirectories in the plugins directory
        for item in os.listdir(PLUGINS_DIR):
            item_path = os.path.join(PLUGINS_DIR, item)
            
            # Skip non-directories and special directories starting with _ or .
            if not os.path.isdir(item_path) or item.startswith(('_', '.')):
                continue
            
            # Validate the plugin
            result = self.validate_plugin(plugin_id=item)
            results[item] = result
        
        return results
    
    def _validate_structure(self) -> None:
        """Validate the plugin directory structure"""
        logger.info("Validating plugin structure...")
        
        # Check for required files
        required_files = ["settings.json", "index.js"]
        for file in required_files:
            file_path = os.path.join(self.plugin_path, file)
            if not os.path.exists(file_path):
                self.issues.append(f"Missing required file: {file}")
        
        # Check for recommended files
        recommended_files = ["README.md"]
        for file in recommended_files:
            file_path = os.path.join(self.plugin_path, file)
            if not os.path.exists(file_path):
                self.warnings.append(f"Missing recommended file: {file}")
        
        # Check for routes.js if routes are defined in settings.json
        settings_path = os.path.join(self.plugin_path, "settings.json")
        if os.path.exists(settings_path):
            try:
                with open(settings_path, 'r') as f:
                    settings = json.load(f)
                
                if "routes" in settings and settings["routes"] and not os.path.exists(os.path.join(self.plugin_path, "routes.js")):
                    self.issues.append("Plugin defines routes but routes.js is missing")
            except Exception as e:
                self.issues.append(f"Failed to parse settings.json: {e}")
    
    def _validate_settings(self) -> None:
        """Validate the plugin settings.json file"""
        logger.info("Validating plugin settings...")
        
        settings_path = os.path.join(self.plugin_path, "settings.json")
        if not os.path.exists(settings_path):
            # Already reported in _validate_structure
            return
        
        try:
            with open(settings_path, 'r') as f:
                settings = json.load(f)
            
            # Check for required fields
            required_fields = ["id", "name", "description", "hooks"]
            for field in required_fields:
                if field not in settings:
                    self.issues.append(f"Missing required field in settings.json: {field}")
            
            # Check if ID matches directory name
            if "id" in settings and settings["id"] != self.plugin_id:
                self.warnings.append(f"Plugin ID in settings.json ({settings['id']}) doesn't match directory name ({self.plugin_id})")
            
            # Check hooks
            if "hooks" in settings:
                if not isinstance(settings["hooks"], list):
                    self.issues.append("Field 'hooks' must be an array in settings.json")
            
            # Check variables
            if "variables" in settings:
                if not isinstance(settings["variables"], list):
                    self.issues.append("Field 'variables' must be an array in settings.json")
                else:
                    for i, variable in enumerate(settings["variables"]):
                        if "name" not in variable:
                            self.issues.append(f"Missing 'name' in variable at index {i}")
                        if "id" not in variable:
                            self.issues.append(f"Missing 'id' in variable at index {i}")
            
            # Check routes
            if "routes" in settings and not isinstance(settings["routes"], list):
                self.issues.append("Field 'routes' must be an array in settings.json")
            
            # Check actions
            if "actions" in settings:
                if not isinstance(settings["actions"], list):
                    self.issues.append("Field 'actions' must be an array in settings.json")
                else:
                    for i, action in enumerate(settings["actions"]):
                        if "label" not in action:
                            self.issues.append(f"Missing 'label' in action at index {i}")
                        if "type" not in action:
                            self.issues.append(f"Missing 'type' in action at index {i}")
                        if action.get("type") in ["popup", "redirect"] and "route" not in action:
                            self.issues.append(f"Action of type {action.get('type')} at index {i} missing 'route'")
        
        except json.JSONDecodeError as e:
            self.issues.append(f"Invalid JSON in settings.json: {e}")
        except Exception as e:
            self.issues.append(f"Failed to validate settings.json: {e}")
    
    def _validate_security(self) -> None:
        """Validate plugin files for security issues"""
        logger.info("Validating plugin security...")
        
        # List all Javascript/TypeScript files in the plugin directory
        js_files = []
        for root, _, files in os.walk(self.plugin_path):
            for file in files:
                if file.endswith((".js", ".ts", ".jsx", ".tsx")):
                    js_files.append(os.path.join(root, file))
        
        # Check each file for security patterns
        for file_path in js_files:
            relative_path = os.path.relpath(file_path, self.plugin_path)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Look for security patterns
                for category, patterns in SECURITY_PATTERNS.items():
                    for pattern in patterns:
                        matches = re.findall(pattern, content)
                        if matches:
                            # Check if the match is in a safe context
                            safe = False
                            for safe_pattern in SAFE_PATTERNS:
                                for match in matches:
                                    if re.search(safe_pattern, match if isinstance(match, str) else ""):
                                        safe = True
                                        break
                            
                            if not safe:
                                self.issues.append(f"Security issue: {category} detected in {relative_path}")
                                break
            
            except Exception as e:
                self.warnings.append(f"Failed to scan {relative_path} for security issues: {e}")
        
        # Check for suspicious dependencies
        # This could be expanded based on the web3db-connector security requirements
        package_path = os.path.join(self.plugin_path, "package.json")
        if os.path.exists(package_path):
            try:
                with open(package_path, 'r') as f:
                    package_data = json.load(f)
                
                suspicious_deps = []
                
                all_deps = {}
                if "dependencies" in package_data:
                    all_deps.update(package_data["dependencies"])
                if "devDependencies" in package_data:
                    all_deps.update(package_data["devDependencies"])
                
                # List of potentially dangerous packages
                dangerous_packages = ["shelljs", "vm2", "node-gyp"]
                
                for dep in all_deps:
                    if dep in dangerous_packages:
                        suspicious_deps.append(dep)
                
                if suspicious_deps:
                    self.issues.append(f"Suspicious dependencies found: {', '.join(suspicious_deps)}")
            
            except json.JSONDecodeError:
                self.issues.append("Invalid JSON in package.json")
            except Exception as e:
                self.warnings.append(f"Failed to check package.json: {e}")
    
    def _validate_code_quality(self) -> None:
        """Validate plugin code quality"""
        logger.info("Validating code quality...")
        
        # Check for index.js
        index_path = os.path.join(self.plugin_path, "index.js")
        if not os.path.exists(index_path):
            # Already reported in _validate_structure
            return
        
        try:
            with open(index_path, 'r') as f:
                content = f.read()
            
            # Check if the file exports a class
            if not re.search(r"export\s+default\s+class", content):
                self.issues.append("index.js must export a default class")
            
            # Check if the class has an init method
            if not re.search(r"async\s+init\s*\(\s*\)", content) and not re.search(r"init\s*\(\s*\)", content):
                self.issues.append("Plugin class must have an init method")
            
            # Check if init returns HOOKS
            if not re.search(r"return\s*{\s*HOOKS\s*:", content):
                self.issues.append("init method must return an object with HOOKS")
            
            # Check if hooks match settings.json
            settings_path = os.path.join(self.plugin_path, "settings.json")
            if os.path.exists(settings_path):
                try:
                    with open(settings_path, 'r') as f:
                        settings = json.load(f)
                    
                    if "hooks" in settings:
                        for hook in settings["hooks"]:
                            if not re.search(r"{}:".format(hook), content):
                                self.issues.append(f"Hook '{hook}' declared in settings.json but not implemented in index.js")
                
                except Exception:
                    # Already reported in _validate_settings
                    pass
        
        except Exception as e:
            self.warnings.append(f"Failed to validate index.js: {e}")
    
    def _validate_dependencies(self) -> None:
        """Validate plugin dependencies"""
        logger.info("Validating plugin dependencies...")
        
        # Check for package.json
        package_path = os.path.join(self.plugin_path, "package.json")
        if os.path.exists(package_path):
            try:
                with open(package_path, 'r') as f:
                    package_data = json.load(f)
                
                # Check for direct dependencies on core libraries that should be imported from parent
                core_deps = ["@ceramicnetwork", "ceramic-http-client", "@composedb", "@glaze", "@didtools", "dids"]
                direct_deps = package_data.get("dependencies", {})
                
                for core_dep_prefix in core_deps:
                    for dep in direct_deps:
                        if dep.startswith(core_dep_prefix):
                            self.warnings.append(f"Plugin should use {dep} from the parent project, not as a direct dependency")
            
            except json.JSONDecodeError:
                self.issues.append("Invalid JSON in package.json")
            except Exception as e:
                self.warnings.append(f"Failed to check package.json: {e}")
    
    def _print_validation_results(self) -> None:
        """Print validation results in a structured format"""
        print("\n=== Plugin Validation Results ===")
        print(f"Plugin ID: {self.plugin_id}")
        print(f"Plugin Path: {self.plugin_path}")
        
        if not self.issues and not self.warnings:
            print("\n✅ Plugin passed all validation checks!")
            return
        
        if self.issues:
            print("\n❌ Issues Found:")
            for i, issue in enumerate(self.issues, 1):
                print(f"  {i}. {issue}")
        
        if self.warnings:
            print("\n⚠️ Warnings:")
            for i, warning in enumerate(self.warnings, 1):
                print(f"  {i}. {warning}")
        
        print(f"\nResult: {'FAILED' if self.issues else 'PASSED WITH WARNINGS'}")


def add_to_plugin_registry(plugin_id: str, metadata: Optional[Dict] = None) -> None:
    """Add a validated plugin to the registry"""
    registry_path = os.path.join(PROJECT_ROOT, "server", "plugins", "registry.json")
    
    # Create registry if it doesn't exist
    if not os.path.exists(registry_path):
        with open(registry_path, 'w') as f:
            json.dump({"plugins": {}}, f, indent=2)
    
    # Read current registry
    try:
        with open(registry_path, 'r') as f:
            registry = json.load(f)
    except Exception as e:
        logger.error(f"Failed to read plugin registry: {e}")
        registry = {"plugins": {}}
    
    # Add plugin to registry
    if not metadata:
        # Read metadata from settings.json
        settings_path = os.path.join(PLUGINS_DIR, plugin_id, "settings.json")
        try:
            with open(settings_path, 'r') as f:
                metadata = json.load(f)
        except Exception as e:
            logger.error(f"Failed to read plugin settings: {e}")
            metadata = {
                "id": plugin_id,
                "name": plugin_id,
                "description": "No description available"
            }
    
    # Add validation date and status
    metadata["validated"] = True
    metadata["validation_date"] = datetime.datetime.now().isoformat()
    
    # Update registry
    registry["plugins"][plugin_id] = metadata
    
    # Write registry
    try:
        with open(registry_path, 'w') as f:
            json.dump(registry, f, indent=2)
        logger.info(f"Plugin {plugin_id} added to registry")
    except Exception as e:
        logger.error(f"Failed to write plugin registry: {e}")


def main():
    """Main entry point for the plugin validator script"""
    parser = argparse.ArgumentParser(description="Web3DB Connector Plugin Validator")
    
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--id", help="Plugin ID to validate")
    group.add_argument("--path", help="Path to plugin directory")
    group.add_argument("--all", action="store_true", help="Validate all plugins")
    
    parser.add_argument("--register", action="store_true", 
                        help="Add validated plugins to the registry")
    
    args = parser.parse_args()
    
    validator = PluginValidator()
    
    if args.all:
        results = validator.validate_all_plugins()
        
        # Print summary
        print("\n=== Validation Summary ===")
        passed = sum(1 for result in results.values() if result)
        failed = len(results) - passed
        print(f"Total plugins: {len(results)}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        
        if args.register:
            for plugin_id, result in results.items():
                if result:
                    add_to_plugin_registry(plugin_id)
        
        # Exit with status code based on results
        sys.exit(0 if failed == 0 else 1)
    else:
        result = validator.validate_plugin(plugin_id=args.id, plugin_path=args.path)
        
        if result and args.register:
            add_to_plugin_registry(args.id if args.id else os.path.basename(args.path))
        
        # Exit with status code based on result
        sys.exit(0 if result else 1)


if __name__ == "__main__":
    main()
