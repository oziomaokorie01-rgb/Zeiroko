import React, { useState } from 'react';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";

export default function WalletConnectBtn({ onConnected }) {
  const [addr, setAddr] = useState(null);

    const connect = async () => {
        try {
              const provider = new WalletConnectProvider({
                      rpc: { 1: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY" },
                              qrcode: true,
                                      projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || ''
                                            });
                                                  await provider.enable();
                                                        const web3provider = new ethers.BrowserProvider(provider);
                                                              const signer = await web3provider.getSigner();
                                                                    const address = await signer.getAddress();
                                                                          setAddr(address);
                                                                                if (onConnected) await onConnected(address);
                                                                                    } catch (e) {
                                                                                          console.error(e);
                                                                                                alert('wallet connect failed');
                                                                                                    }
                                                                                                      };

                                                                                                        return (
                                                                                                            <div style={{display:'inline-block', marginRight:8}}>
                                                                                                                  <button className="primary" onClick={connect}>{addr ? `Wallet: ${addr.substring(0,6)}...` : 'Connect Wallet'}</button>
                                                                                                                      </div>
                                                                                                                        );
                                                                                                                        }