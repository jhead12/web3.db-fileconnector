interface PhantomProvider {
  isPhantom?: boolean;
  solana?: {
    publicKey: any;
    connect: () => Promise<{ publicKey: any }>;
    disconnect: () => Promise<void>;
    signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
    signTransaction: (transaction: any) => Promise<any>;
    signAllTransactions: (transactions: any[]) => Promise<any[]>;
    // Add any other methods you might need
  };
}

interface Window {
  phantom?: PhantomProvider;
}
