import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import * as raw from 'multiformats/codecs/raw';

let ipfsInstance;

/** Simple IPFS-like interface that works without complex networking */
export const initIPFS = async () => {
  if (!ipfsInstance) {
    console.log('Initializing simplified IPFS interface...');
    
    // Create a simple in-memory storage for demonstration
    const storage = new Map();
    
    ipfsInstance = {
      helia: null, // Not using full Helia due to native module issues
      strings: null,
      add: async (content) => {
        try {
          if (typeof content === 'string') {
            // Create CID for string content
            const bytes = new TextEncoder().encode(content);
            const hash = await sha256.digest(bytes);
            const cid = CID.create(1, raw.code, hash);
            const cidString = cid.toString();
            
            // Store in memory
            storage.set(cidString, content);
            console.log(`Stored string content with CID: ${cidString}`);
            return cidString;
          } else {
            // For binary content
            const bytes = new Uint8Array(content);
            const hash = await sha256.digest(bytes);
            const cid = CID.create(1, raw.code, hash);
            const cidString = cid.toString();
            
            // Store in memory
            storage.set(cidString, bytes);
            console.log(`Stored binary content with CID: ${cidString}`);
            return cidString;
          }
        } catch (error) {
          console.error('IPFS add error:', error);
          // Generate a fallback CID
          const timestamp = Date.now().toString();
          const fallbackCid = `QmFallback${timestamp}`;
          storage.set(fallbackCid, content);
          return fallbackCid;
        }
      },
      get: async (cid) => {
        try {
          const content = storage.get(cid);
          if (content) {
            console.log(`Retrieved content for CID: ${cid}`);
            return content;
          } else {
            console.warn(`Content not found for CID: ${cid}`);
            return null;
          }
        } catch (error) {
          console.error('IPFS get error:', error);
          return null;
        }
      },
      // Additional utility method to check what's stored
      list: () => {
        return Array.from(storage.keys());
      }
    };
    
    console.log('Simplified IPFS interface initialized successfully');
  }
  return ipfsInstance;
};
