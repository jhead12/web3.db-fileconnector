// client/pages/settings.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Settings() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    ipfs: {
      enabled: false,
      nodeUrl: ''
    },
    ceramic: {
      enabled: false,
      nodeUrl: '',
      adminSeed: '',
      settingsStreamId: ''
    },
    composeDb: {
      enabled: false,
      schemaId: '',
      modelDefinition: null
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');

  // Get token from localStorage on client side
  useEffect(() => {
    const storedToken = localStorage.getItem('orbisdb-admin-session');
    if (storedToken) {
      setToken(storedToken);
    } else {
      // Redirect to login if no token
      router.push('/auth');
    }
  }, [router]);

  // Fetch current settings
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || settings);
      } else {
        console.error('Failed to fetch settings');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  // Fetch settings when token is available
  useEffect(() => {
    if (token) {
      fetchSettings();
    }
  }, [token]);

  // Handle form input changes
  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (section, field) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({
          ...prev,
          ceramic: {
            ...prev.ceramic,
            settingsStreamId: data.settingsStreamId || prev.ceramic.settingsStreamId
          },
          composeDb: {
            ...prev.composeDb,
            modelId: data.updatedSettings?.composeDb?.modelId || prev.composeDb.modelId
          }
        }));
        setSuccess(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update settings');
      }
    } catch (err) {
      setError('Error updating settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Settings | Web3 DB File Connector</title>
      </Head>
      
      <h1 className="text-2xl font-bold mb-6">Application Settings</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Settings updated successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* IPFS Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">IPFS Settings</h2>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.ipfs.enabled}
                onChange={() => handleCheckboxChange('ipfs', 'enabled')}
                className="mr-2"
              />
              <span>Enable IPFS</span>
            </label>
          </div>
          
          {settings.ipfs.enabled && (
            <div className="mb-4">
              <label className="block mb-2">IPFS Node URL</label>
              <input
                type="text"
                value={settings.ipfs.nodeUrl}
                onChange={(e) => handleChange('ipfs', 'nodeUrl', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="http://localhost:5001"
              />
            </div>
          )}
        </div>
        
        {/* Ceramic Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Ceramic Settings</h2>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.ceramic.enabled}
                onChange={() => handleCheckboxChange('ceramic', 'enabled')}
                className="mr-2"
              />
              <span>Enable Ceramic</span>
            </label>
          </div>
          
          {settings.ceramic.enabled && (
            <>
              <div className="mb-4">
                <label className="block mb-2">Ceramic Node URL</label>
                <input
                  type="text"
                  value={settings.ceramic.nodeUrl}
                  onChange={(e) => handleChange('ceramic', 'nodeUrl', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="http://localhost:7007"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-2">Admin Seed (hex)</label>
                <input
                  type="password"
                  value={settings.ceramic.adminSeed}
                  onChange={(e) => handleChange('ceramic', 'adminSeed', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Admin seed in hex format"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This is used to authenticate with the Ceramic node. Keep this secure.
                </p>
              </div>
              
              {settings.ceramic.settingsStreamId && (
                <div className="mb-4">
                  <label className="block mb-2">Settings Stream ID</label>
                  <input
                    type="text"
                    value={settings.ceramic.settingsStreamId}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-50"
                  />
                </div>
              )}
            </>
          )}
        </div>
        
        {/* ComposeDB Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">ComposeDB Settings</h2>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.composeDb.enabled}
                onChange={() => handleCheckboxChange('composeDb', 'enabled')}
                className="mr-2"
              />
              <span>Enable ComposeDB</span>
            </label>
          </div>
          
          {settings.composeDb.enabled && (
            <>
              <div className="mb-4">
                <label className="block mb-2">Schema ID</label>
                <input
                  type="text"
                  value={settings.composeDb.schemaId}
                  onChange={(e) => handleChange('composeDb', 'schemaId', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Schema ID"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-2">Model Definition (JSON)</label>
                <textarea
                  value={settings.composeDb.modelDefinition ? JSON.stringify(settings.composeDb.modelDefinition, null, 2) : ''}
                  onChange={(e) => {
                    try {
                      const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                      handleChange('composeDb', 'modelDefinition', parsed);
                    } catch (err) {
                      // Allow invalid JSON during typing, but don't update state
                    }
                  }}
                  className="w-full p-2 border rounded font-mono"
                  rows={6}
                  placeholder="Paste your model definition JSON here"
                />
              </div>
              
              {settings.composeDb.modelId && (
                <div className="mb-4">
                  <label className="block mb-2">Model ID</label>
                  <input
                    type="text"
                    value={settings.composeDb.modelId}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-50"
                  />
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
