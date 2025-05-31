import { NextApiRequest, NextApiResponse } from 'next';
import { CeramicClient } from '@ceramicnetwork/http-client';

const CERAMIC_URL = process.env.NEXT_PUBLIC_CERAMIC_URL || 'http://localhost:7007';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const ceramic = new CeramicClient(CERAMIC_URL);
    
    // Check if we can connect to Ceramic by getting the supported chains
    const supportedChains = await ceramic.getSupportedChains();
    
    res.status(200).json({
      status: 'ok',
      ceramic: {
        url: CERAMIC_URL,
        connected: true,
        supportedChains
      }
    });
  } catch (error) {
    console.error('Ceramic status check error:', error);
    res.status(503).json({
      status: 'error',
      ceramic: {
        url: CERAMIC_URL,
        connected: false,
        error: error.message
      }
    });
  }
}
