#!/usr/bin/env python3
"""
Web3DB Connector Plugin Creator

This tool helps developers create and validate plugins for the web3db-connector.
It supports both interactive mode and command-line arguments.

Usage:
    python plugin_creator.py --interactive
    python plugin_creator.py --name "My Plugin" --description "Plugin description" --hooks connect,query
    python plugin_creator.py --template database --name "Custom Database" --description "Custom database connector"

Author: web3db-connector Team
Date: May 30, 2025
"""

import os
import sys
import json
import argparse
import re
import shutil
import subprocess
import hashlib
import logging
import zipfile
import requests
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple, Union

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("plugin_creator")

# Path constants
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
PLUGIN_TEMPLATE_DIR = os.path.join(PROJECT_ROOT, "server", "plugins", "_template")
PLUGINS_DIR = os.path.join(PROJECT_ROOT, "server", "plugins")
CLIENT_PLUGINS_DIR = os.path.join(PROJECT_ROOT, "client", "sdk", "datasource")

# Plugin hooks available in the system
AVAILABLE_HOOKS = [
    "connect", "query", "generate", "process", "auth", "storage",
    "notification", "trigger", "schedule", "transform"
]

# Plugin templates available in the system
PLUGIN_TEMPLATES = {
    "basic": {
        "description": "Basic plugin with minimal functionality",
        "hooks": ["generate", "process"],
        "variables": [
            {
                "name": "Example Variable",
                "id": "example_var",
                "description": "An example variable for demonstration",
                "type": "string",
                "per_context": True
            }
        ]
    },
    "database": {
        "description": "Database connector plugin",
        "hooks": ["connect", "query"],
        "variables": [
            {
                "name": "Connection String",
                "id": "connection_string",
                "description": "The database connection string",
                "type": "string",
                "per_context": True
            },
            {
                "name": "Max Pool Size",
                "id": "max_pool_size",
                "description": "Maximum number of clients the pool should contain",
                "type": "number",
                "default": 10,
                "per_context": True
            }
        ]
    },
    "authentication": {
        "description": "Authentication provider plugin",
        "hooks": ["auth", "validate"],
        "variables": [
            {
                "name": "API Key",
                "id": "api_key",
                "description": "API key for the authentication service",
                "type": "string",
                "per_context": True,
                "secret": True
            }
        ]
    },
    "integration": {
        "description": "Third-party service integration plugin",
        "hooks": ["connect", "process", "trigger"],
        "variables": [
            {
                "name": "API URL",
                "id": "api_url",
                "description": "The URL endpoint of the service API",
                "type": "string",
                "per_context": True
            },
            {
                "name": "API Key",
                "id": "api_key",
                "description": "API key for the service",
                "type": "string",
                "per_context": True,
                "secret": True
            }
        ]
    }
}

# Template variables that will be replaced in the plugin files
TEMPLATE_VARS = {
    "PLUGIN_ID": "",
    "PLUGIN_NAME": "",
    "PLUGIN_DESCRIPTION": "",
    "PLUGIN_CLASS_NAME": "",
    "PLUGIN_FULL_DESCRIPTION": "",
    "PLUGIN_AUTHOR": "",
    "PLUGIN_AUTHOR_EMAIL": "",
    "PLUGIN_LICENSE": "MIT",
    "PLUGIN_DATE_CREATED": datetime.now().strftime("%Y-%m-%d"),
    "PLUGIN_VERSION": "0.1.0",
}

class PluginCreator:
    """Main class for creating and validating web3db-connector plugins"""
    
    def __init__(self):
        """Initialize plugin creator with default values"""
        self.plugin_id = ""
        self.plugin_name = ""
        self.plugin_description = ""
        self.plugin_class_name = ""
        self.plugin_full_description = ""
        self.plugin_author = ""
        self.plugin_author_email = ""
        self.plugin_template = None
        self.plugin_hooks = []
        self.plugin_variables = []
        self.plugin_routes = []
        self.plugin_actions = []
        self.security_level = "standard"  # standard, high, critical
        self.plugin_hooks = []
        self.plugin_variables = []
        self.plugin_routes = []
        self.plugin_actions = []
        self.plugin_dynamic_variables = []
        self.created_files = []
        self.security_warnings = []

    def interactive_mode(self) -> None:
        """Run the plugin creator in interactive mode"""
        print("\n=== Web3DB Connector Plugin Creator ===\n")
        print("This tool will guide you through creating a new plugin.")
        print("Follow the prompts to configure your plugin.\n")
        
        # Basic plugin information
        self.plugin_name = input("Plugin Name: ").strip()
        while not self.plugin_name:
            print("Plugin name cannot be empty.")
            self.plugin_name = input("Plugin Name: ").strip()
        
        # Generate plugin ID from name
        self.plugin_id = self._generate_plugin_id(self.plugin_name)
        print(f"Plugin ID (generated): {self.plugin_id}")
        
        # Generate class name from plugin name
        self.plugin_class_name = self._generate_class_name(self.plugin_name)
        print(f"Plugin Class Name (generated): {self.plugin_class_name}")
        
        # Get other plugin information
        self.plugin_description = input("Short Description: ").strip()
        self.plugin_full_description = input("Full Description: ").strip()
        
        self.plugin_author = input("Author Name: ").strip()
        self.plugin_author_email = input("Author Email: ").strip()
        
        # Select hooks
        print("\nAvailable Hooks (separated by comma):")
        for i, hook in enumerate(AVAILABLE_HOOKS, 1):
            print(f"{i}. {hook}")
        
        hooks_input = input("\nSelect Hooks (e.g., connect,query): ").strip()
        self.plugin_hooks = [h.strip() for h in hooks_input.split(",") if h.strip() in AVAILABLE_HOOKS]
        
        # Plugin variables
        self._collect_variables()
        
        # Routes
        routes_input = input("\nPlugin Routes (comma-separated, e.g., status,data): ").strip()
        if routes_input:
            self.plugin_routes = [r.strip() for r in routes_input.split(",") if r.strip()]
        
        # Actions
        self._collect_actions()
        
        # Dynamic variables
        self._collect_dynamic_variables()
        
        # Summary
        self._print_summary()
        
        # Create the plugin
        confirmation = input("\nCreate this plugin? (y/n): ").lower()
        if confirmation == 'y':
            self.create_plugin()
        else:
            print("Plugin creation cancelled.")

    def create_plugin_from_args(self, args: argparse.Namespace) -> None:
        """Create a plugin from command-line arguments"""
        self.plugin_name = args.name
        self.plugin_id = args.id if args.id else self._generate_plugin_id(self.plugin_name)
        self.plugin_class_name = args.class_name if args.class_name else self._generate_class_name(self.plugin_name)
        self.plugin_description = args.description
        self.plugin_full_description = args.full_description if args.full_description else args.description
        self.plugin_author = args.author
        self.plugin_author_email = args.email
        
        # Parse hooks
        if args.hooks:
            self.plugin_hooks = [h.strip() for h in args.hooks.split(",") if h.strip() in AVAILABLE_HOOKS]
        
        # Parse routes
        if args.routes:
            self.plugin_routes = [r.strip() for r in args.routes.split(",") if r.strip()]
        
        # Parse variables from JSON file if provided
        if args.variables_file:
            try:
                with open(args.variables_file, 'r') as f:
                    self.plugin_variables = json.load(f)
            except Exception as e:
                logger.error(f"Error loading variables file: {e}")
                sys.exit(1)
        
        # Parse actions from JSON file if provided
        if args.actions_file:
            try:
                with open(args.actions_file, 'r') as f:
                    self.plugin_actions = json.load(f)
            except Exception as e:
                logger.error(f"Error loading actions file: {e}")
                sys.exit(1)
        
        # Parse dynamic variables from JSON file if provided
        if args.dynamic_variables_file:
            try:
                with open(args.dynamic_variables_file, 'r') as f:
                    self.plugin_dynamic_variables = json.load(f)
            except Exception as e:
                logger.error(f"Error loading dynamic variables file: {e}")
                sys.exit(1)
        
        # Create the plugin
        self.create_plugin()

    def create_plugin(self) -> None:
        """Create the plugin files based on collected information"""
        logger.info(f"Creating plugin: {self.plugin_name} ({self.plugin_id})")
        
        # Check if the plugin directory already exists
        plugin_dir = os.path.join(PLUGINS_DIR, self.plugin_id)
        if os.path.exists(plugin_dir):
            logger.error(f"Plugin directory already exists: {plugin_dir}")
            sys.exit(1)
        
        # Create plugin directory
        os.makedirs(plugin_dir, exist_ok=True)
        logger.info(f"Created plugin directory: {plugin_dir}")
        
        # Create settings.json
        settings = self._generate_settings_json()
        settings_path = os.path.join(plugin_dir, "settings.json")
        with open(settings_path, 'w') as f:
            json.dump(settings, f, indent=2)
        self.created_files.append(settings_path)
        logger.info(f"Created settings.json: {settings_path}")
        
        # Create index.js
        index_content = self._generate_index_js()
        index_path = os.path.join(plugin_dir, "index.js")
        with open(index_path, 'w') as f:
            f.write(index_content)
        self.created_files.append(index_path)
        logger.info(f"Created index.js: {index_path}")
        
        # Create routes.js if routes are defined
        if self.plugin_routes:
            routes_content = self._generate_routes_js()
            routes_path = os.path.join(plugin_dir, "routes.js")
            with open(routes_path, 'w') as f:
                f.write(routes_content)
            self.created_files.append(routes_path)
            logger.info(f"Created routes.js: {routes_path}")
        
        # Create README.md
        readme_content = self._generate_readme_md()
        readme_path = os.path.join(plugin_dir, "README.md")
        with open(readme_path, 'w') as f:
            f.write(readme_content)
        self.created_files.append(readme_path)
        logger.info(f"Created README.md: {readme_path}")
        
        # Create client-side adapter if this is a data source plugin
        if "connect" in self.plugin_hooks or "query" in self.plugin_hooks:
            client_adapter = self._generate_client_adapter()
            adapter_name = f"{self.plugin_id}DataSource.ts"
            adapter_path = os.path.join(CLIENT_PLUGINS_DIR, adapter_name)
            with open(adapter_path, 'w') as f:
                f.write(client_adapter)
            self.created_files.append(adapter_path)
            logger.info(f"Created client adapter: {adapter_path}")
        
        # Run security check
        self.run_security_check()
        
        logger.info(f"Plugin creation completed: {self.plugin_id}")
        print("\n===== Plugin Created Successfully =====")
        print(f"Plugin location: {plugin_dir}")
        print(f"Plugin ID: {self.plugin_id}")
        
        if self.security_warnings:
            print("\n⚠️ Security Warnings:")
            for warning in self.security_warnings:
                print(f"- {warning}")
        
        print("\nNext Steps:")
        print("1. Review the generated files and customize as needed")
        print("2. Test your plugin: yarn run plugin:test --id", self.plugin_id)
        print("3. Add any custom behavior in index.js")
        print("4. Document your plugin in README.md")

    def run_security_check(self) -> None:
        """Run security checks on the created plugin files"""
        logger.info("Running security checks on plugin files...")
        
        # Check for common security issues in the code
        for file_path in self.created_files:
            with open(file_path, 'r') as f:
                content = f.read()
                
                # Check for potential eval() usage
                if 'eval(' in content:
                    self.security_warnings.append(f"Potential eval() usage found in {os.path.basename(file_path)}")
                
                # Check for potential Function constructor usage
                if 'new Function(' in content:
                    self.security_warnings.append(f"Potential Function constructor usage found in {os.path.basename(file_path)}")
                
                # Check for potential command injection vectors
                if 'exec(' in content or 'spawn(' in content or 'execSync(' in content:
                    self.security_warnings.append(f"Potential command execution found in {os.path.basename(file_path)}")
        
        # Additional checks can be added here
        
        logger.info(f"Security check completed with {len(self.security_warnings)} warnings")

    def _collect_variables(self) -> None:
        """Collect plugin variables in interactive mode"""
        print("\nPlugin Variables (press Enter with empty name to finish):")
        while True:
            var_name = input("  Variable Name (or Enter to finish): ").strip()
            if not var_name:
                break
                
            var_id = self._generate_variable_id(var_name)
            var_description = input("  Description: ").strip()
            var_type = input("  Type (string, number, select, boolean, model, object) [string]: ").strip() or "string"
            var_default = input("  Default Value (optional): ").strip()
            var_per_context = input("  Per Context (y/n) [y]: ").strip().lower() != 'n'
            
            variable = {
                "name": var_name,
                "description": var_description,
                "id": var_id,
                "type": var_type,
                "per_context": var_per_context
            }
            
            if var_default:
                variable["default"] = var_default
                
            # For select type, collect options
            if var_type == "select":
                options_input = input("  Options (comma-separated): ").strip()
                if options_input:
                    variable["options"] = [o.strip() for o in options_input.split(",") if o.strip()]
            
            self.plugin_variables.append(variable)
            print(f"  Added variable: {var_name}")

    def _collect_actions(self) -> None:
        """Collect plugin actions in interactive mode"""
        print("\nPlugin Actions (press Enter with empty label to finish):")
        while True:
            action_label = input("  Action Label (or Enter to finish): ").strip()
            if not action_label:
                break
                
            action_type = input("  Type (popup, redirect, function) [popup]: ").strip() or "popup"
            action_route = ""
            
            if action_type in ["popup", "redirect"]:
                action_route = input("  Route: ").strip()
            
            action = {
                "label": action_label,
                "type": action_type
            }
            
            if action_route:
                action["route"] = action_route
                
            self.plugin_actions.append(action)
            print(f"  Added action: {action_label}")

    def _collect_dynamic_variables(self) -> None:
        """Collect dynamic variables in interactive mode"""
        print("\nDynamic Variables (press Enter with empty name to finish):")
        while True:
            var_name = input("  Variable Name (or Enter to finish): ").strip()
            if not var_name:
                break
                
            var_id = self._generate_variable_id(var_name)
            var_type = input("  Type (string, badge, slider, logs) [string]: ").strip() or "string"
            
            dynamic_var = {
                "name": var_name,
                "id": var_id,
                "type": var_type
            }
            
            self.plugin_dynamic_variables.append(dynamic_var)
            print(f"  Added dynamic variable: {var_name}")

    def _print_summary(self) -> None:
        """Print a summary of the plugin configuration"""
        print("\n=== Plugin Summary ===")
        print(f"Name: {self.plugin_name}")
        print(f"ID: {self.plugin_id}")
        print(f"Class Name: {self.plugin_class_name}")
        print(f"Description: {self.plugin_description}")
        print(f"Author: {self.plugin_author} <{self.plugin_author_email}>")
        print(f"Hooks: {', '.join(self.plugin_hooks)}")
        
        if self.plugin_variables:
            print("\nVariables:")
            for var in self.plugin_variables:
                print(f"  - {var['name']} ({var['id']})")
        
        if self.plugin_routes:
            print("\nRoutes:")
            for route in self.plugin_routes:
                print(f"  - {route}")
        
        if self.plugin_actions:
            print("\nActions:")
            for action in self.plugin_actions:
                print(f"  - {action['label']} ({action['type']})")
        
        if self.plugin_dynamic_variables:
            print("\nDynamic Variables:")
            for var in self.plugin_dynamic_variables:
                print(f"  - {var['name']} ({var['type']})")

    def _generate_plugin_id(self, name: str) -> str:
        """Generate a plugin ID from the plugin name"""
        # Convert to lowercase, replace spaces with dashes, remove special chars
        plugin_id = re.sub(r'[^a-z0-9-]', '', name.lower().replace(' ', '-'))
        return plugin_id

    def _generate_class_name(self, name: str) -> str:
        """Generate a class name from the plugin name"""
        # Convert to PascalCase
        words = re.findall(r'[A-Za-z0-9]+', name)
        class_name = ''.join(word.capitalize() for word in words) + 'Plugin'
        return class_name

    def _generate_variable_id(self, name: str) -> str:
        """Generate a variable ID from the variable name"""
        # Convert to snake_case
        return re.sub(r'[^a-z0-9_]', '', name.lower().replace(' ', '_'))

    def _generate_settings_json(self) -> Dict[str, Any]:
        """Generate the settings.json content"""
        settings = {
            "id": self.plugin_id,
            "name": self.plugin_name,
            "logo": f"/img/{self.plugin_id}-logo.png",
            "description": self.plugin_description,
            "full_description": self.plugin_full_description,
            "hooks": self.plugin_hooks,
            "variables": self.plugin_variables
        }
        
        if self.plugin_routes:
            settings["routes"] = self.plugin_routes
        
        if self.plugin_actions:
            settings["actions"] = self.plugin_actions
        
        if self.plugin_dynamic_variables:
            settings["dynamic_variables"] = self.plugin_dynamic_variables
        
        return settings

    def _generate_index_js(self) -> str:
        """Generate the index.js content"""
        hooks_init = []
        hooks_methods = []
        
        for hook in self.plugin_hooks:
            hooks_init.append(f'        {hook}: (params) => this.{hook}(params)')
            
            # Generate method template based on hook type
            if hook == "connect":
                hooks_methods.append(f'''
  /**
   * Connect to external service or database
   * @returns {{Promise<boolean>}} Success status
   */
  async connect() {{
    try {{
      logger.info("Connecting to service...");
      // TODO: Implement connection logic
      return true;
    }} catch (error) {{
      logger.error("Connection error:", error);
      return false;
    }}
  }}''')
            elif hook == "query":
                hooks_methods.append(f'''
  /**
   * Execute a query against the service
   * @param {{Object}} params - Query parameters
   * @returns {{Promise<Object>}} Query results
   */
  async query(params) {{
    try {{
      logger.info("Executing query:", params);
      // TODO: Implement query logic
      return {{ success: true, data: [] }};
    }} catch (error) {{
      logger.error("Query error:", error);
      return {{ success: false, error: error.message }};
    }}
  }}''')
            elif hook == "generate":
                hooks_methods.append(f'''
  /**
   * Generate content or data
   * @returns {{Promise<Object>}} Generated content
   */
  async generate() {{
    try {{
      logger.info("Generating content...");
      // TODO: Implement generation logic
      return {{ success: true, data: {{ generated: new Date().toISOString() }} }};
    }} catch (error) {{
      logger.error("Generation error:", error);
      return {{ success: false, error: error.message }};
    }}
  }}''')
            elif hook == "process":
                hooks_methods.append(f'''
  /**
   * Process data
   * @param {{Object}} params - Data processing parameters
   * @returns {{Promise<Object>}} Processing results
   */
  async process(params) {{
    try {{
      logger.info("Processing data:", params);
      // TODO: Implement processing logic
      return {{ success: true }};
    }} catch (error) {{
      logger.error("Processing error:", error);
      return {{ success: false, error: error.message }};
    }}
  }}''')
            else:
                hooks_methods.append(f'''
  /**
   * {hook.capitalize()} handler
   * @param {{Object}} params - Hook parameters
   * @returns {{Promise<Object>}} Result
   */
  async {hook}(params) {{
    try {{
      logger.info("{hook.capitalize()} hook called with:", params);
      // TODO: Implement {hook} logic
      return {{ success: true }};
    }} catch (error) {{
      logger.error("{hook.capitalize()} hook error:", error);
      return {{ success: false, error: error.message }};
    }}
  }}''')
        
        dynamic_vars_update = ""
        if self.plugin_dynamic_variables:
            dynamic_vars_update = f'''
  /**
   * Update dynamic variables
   */
  updateDynamicVariables() {{
    // Example of updating dynamic variables
    if (global.connectionEvents && global.connectionEvents.PLUGIN_DYNAMIC_VARIABLES) {{
      global.connectionEvents.PLUGIN_DYNAMIC_VARIABLES.emit({{
        plugin_id: "{self.plugin_id}",
        uuid: this.uuid,
        dynamic_variables: [
          // Add your dynamic variables updates here
          {{
            name: "Status",
            type: "badge",
            value: "Active",
            className: "bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full"
          }}
        ]
      }});
    }}
  }}'''
        
        # Combine all parts to create the index.js file
        index_content = f'''// {self.plugin_name} Plugin
// Author: {self.plugin_author} <{self.plugin_author_email}>
// Created: {datetime.now().strftime("%Y-%m-%d")}

import logger from "../../logger/index.js";

export default class {self.plugin_class_name} {{
  constructor() {{
    // Initialize any required properties
  }}

  /**
   * Initialize plugin hooks
   * @returns {{Promise<Object>}} Initialized hooks
   */
  async init() {{
    return {{
      HOOKS: {{
{", ".join(hooks_init)}
      }}
    }};
  }}
{("".join(hooks_methods))}
{dynamic_vars_update}

  /**
   * Clean up when plugin is stopped
   */
  async stop() {{
    logger.debug("Stopping {self.plugin_id} plugin:", this.uuid);
    // TODO: Clean up any resources, close connections, etc.
  }}
}}
'''
        return index_content

    def _generate_routes_js(self) -> str:
        """Generate the routes.js content"""
        route_handlers = []
        
        for route in self.plugin_routes:
            route_path = route.replace('-', '_')
            
            route_handlers.append(f'''
/**
 * {route} route handler
 */
router.get('/{route}', async (req, res) => {{
  try {{
    if (!req.context_uuid) {{
      return res.status(400).json({{ error: 'Context UUID is required' }});
    }}
    
    // Get plugin instance
    const pluginContext = getPluginContext('{self.plugin_id}', req.context_uuid);
    if (!pluginContext || !pluginContext.plugin) {{
      return res.status(404).json({{ error: 'Plugin context not found' }});
    }}
    
    // Example response
    return res.json({{ 
      success: true,
      route: '{route}',
      data: {{ timestamp: new Date().toISOString() }}
    }});
  }} catch (error) {{
    logger.error('Error in {route} route:', error);
    return res.status(500).json({{ error: error.message }});
  }}
}});
''')
        
        routes_content = f'''// Route handlers for {self.plugin_name} plugin
import express from 'express';
import logger from '../../../logger/index.js';
import {{ getPluginContext }} from '../../../utils/helpers.js';

const router = express.Router();

{("".join(route_handlers))}

export default router;'''
        
        return routes_content

    def _generate_readme_md(self) -> str:
        """Generate the README.md content"""
        variables_section = ""
        if self.plugin_variables:
            variables_list = []
            for var in self.plugin_variables:
                var_type = var.get("type", "string")
                var_default = f" (default: `{var['default']}`)" if "default" in var else ""
                variables_list.append(f"- **{var['name']}** (`{var['id']}`): {var['description']} - Type: {var_type}{var_default}")
            
            variables_section = "## Configuration\n\n" + "\n".join(variables_list)
        
        hooks_section = ""
        if self.plugin_hooks:
            hooks_list = []
            for hook in self.plugin_hooks:
                hooks_list.append(f"- **{hook}**: Implements {hook} functionality")
            
            hooks_section = "## Hooks\n\n" + "\n".join(hooks_list)
        
        routes_section = ""
        if self.plugin_routes:
            routes_list = []
            for route in self.plugin_routes:
                routes_list.append(f"- **/{route}**: Endpoint for {route} functionality")
            
            routes_section = "## API Endpoints\n\n" + "\n".join(routes_list)
        
        readme_content = f'''# {self.plugin_name}

{self.plugin_description}

## Overview

{self.plugin_full_description}

{variables_section}

{hooks_section}

{routes_section}

## Usage

1. Install the plugin from the plugins page
2. Configure the plugin with your specific settings
3. Add the plugin to a context to start using it

## Example

```javascript
// Example code showing how to use this plugin
```

## Author

{self.plugin_author} <{self.plugin_author_email}>
'''
        
        return readme_content

    def _generate_client_adapter(self) -> str:
        """Generate a client-side adapter for data source plugins"""
        methods = []
        class_name = f"{self._camel_case(self.plugin_id)}DataSource"
        
        # Generate constructor
        constructor = f'''
  /**
   * Create a new {class_name} instance
   * @param {{Object}} options - Configuration options
   * @param {{string}} options.contextUuid - The UUID of the context with the {self.plugin_name} plugin
   * @param {{string}} options.jwt - Authentication JWT token
   */
  constructor(options = {{}}) {{
    this.contextUuid = options.contextUuid;
    this.jwt = options.jwt;

    if (!this.contextUuid) {{
      throw new Error('Context UUID is required for {class_name}');
    }}
  }}
  
  /**
   * Set the JWT token for authentication
   * @param {{string}} jwt - The JWT token
   */
  setJwt(jwt) {{
    this.jwt = jwt;
  }}'''
        
        # Generate methods based on available routes
        if "connect" in self.plugin_hooks:
            methods.append(f'''
  /**
   * Test the connection to the {self.plugin_name}
   * @returns {{Promise<boolean>}} - True if connection is successful
   */
  async testConnection() {{
    try {{
      // Call a simple endpoint to test connectivity
      const response = await axios.get(`/api/plugins/${{this.contextUuid}}/status`, {{
        headers: {{
          Authorization: this.jwt ? `Bearer ${{this.jwt}}` : undefined
        }}
      }});
      
      return response.data && response.data.success === true;
    }} catch (error) {{
      console.error('Connection test failed:', error);
      return false;
    }}
  }}''')
        
        if "query" in self.plugin_hooks:
            methods.append(f'''
  /**
   * Execute a query via the {self.plugin_name} plugin
   * @param {{Object}} params - Query parameters
   * @returns {{Promise<Object>}} - Query results
   */
  async query(params) {{
    try {{
      const response = await axios.post(`/api/plugins/${{this.contextUuid}}/routes/query`, params, {{
        headers: {{
          Authorization: this.jwt ? `Bearer ${{this.jwt}}` : undefined
        }}
      }});
      
      return response.data;
    }} catch (error) {{
      console.error('Query execution failed:', error);
      throw error;
    }}
  }}''')
        
        # Generate adapter file
        adapter_content = f'''// Client-side adapter for {self.plugin_name}
import axios from 'axios';

/**
 * {class_name} provides methods to interact with {self.plugin_name}
 * through the web3db-connector plugin system
 */
export class {class_name} {{{constructor}
{("".join(methods))}
}}
'''
        return adapter_content
    
    def _camel_case(self, snake_str: str) -> str:
        """Convert a snake_case string to camelCase"""
        components = snake_str.split('-')
        return components[0] + ''.join(x.title() for x in components[1:])


def main():
    """Main entry point for the plugin creator script"""
    parser = argparse.ArgumentParser(description="Web3DB Connector Plugin Creator")
    
    # Main command groups
    subparsers = parser.add_subparsers(dest="command", help="Commands")
    
    # Interactive mode
    interactive_parser = subparsers.add_parser("interactive", help="Create plugin in interactive mode")
    
    # Create plugin from command line args
    create_parser = subparsers.add_parser("create", help="Create plugin from command line arguments")
    create_parser.add_argument("--name", required=True, help="Plugin name")
    create_parser.add_argument("--id", help="Plugin ID (will be generated from name if not provided)")
    create_parser.add_argument("--class-name", help="Plugin class name (will be generated from name if not provided)")
    create_parser.add_argument("--description", required=True, help="Short plugin description")
    create_parser.add_argument("--full-description", help="Full plugin description")
    create_parser.add_argument("--author", required=True, help="Plugin author name")
    create_parser.add_argument("--email", required=True, help="Plugin author email")
    create_parser.add_argument("--hooks", required=True, help="Comma-separated list of hooks")
    create_parser.add_argument("--routes", help="Comma-separated list of routes")
    create_parser.add_argument("--variables-file", help="JSON file containing variables configuration")
    create_parser.add_argument("--actions-file", help="JSON file containing actions configuration")
    create_parser.add_argument("--dynamic-variables-file", help="JSON file containing dynamic variables configuration")
    
    # Validate plugin
    validate_parser = subparsers.add_parser("validate", help="Validate an existing plugin")
    validate_parser.add_argument("--id", required=True, help="Plugin ID to validate")
    
    args = parser.parse_args()
    
    creator = PluginCreator()
    
    if args.command == "interactive" or not args.command:
        creator.interactive_mode()
    elif args.command == "create":
        creator.create_plugin_from_args(args)
    elif args.command == "validate":
        # TODO: Implement plugin validation logic
        print(f"Validating plugin: {args.id}")
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
