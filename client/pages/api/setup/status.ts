import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Return a basic setup status
    res.status(200).json({
      isSetup: true,
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      services: {
        ceramic: true,
        ipfs: true
      }
    });
  } catch (error) {
    console.error('Setup status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
