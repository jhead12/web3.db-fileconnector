import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Return empty admins list for now - implement your admin logic here
    res.status(200).json({
      admins: []
    });
  } catch (error) {
    console.error('Admin fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
