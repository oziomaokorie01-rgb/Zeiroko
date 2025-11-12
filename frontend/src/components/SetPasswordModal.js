import React, { useState } from 'react';
import api from '../api';

export default function SetPasswordModal({ onClose, onDone }) {
  const [pw, setPw] = useState('');
    const [status, setStatus] = useState('');

      const submit = async () => {
          try {
                setStatus('saving...');
                      await api.post('/api/auth/set-password', { password: pw });
                            setStatus('done');
                                  onDone();
                                      } catch (e) {
                                            setStatus('error');
                                                }
                                                  };

                                                    return (
                                                        <div className="set-password-modal">
                                                              <div className="modal-card">
                                                                      <h3>Set a password</h3>
                                                                              <p style={{fontFamily:'Times New Roman'}}>We detected you signed in via OAuth. Set a local password so you can sign in directly later.</p>
                                                                                      <input type="password" placeholder="New password" value={pw} onChange={e=>setPw(e.target.value)} />
                                                                                              <div style={{display:'flex',gap:8}}>
                                                                                                        <button className="primary" onClick={submit}>Set password</button>
                                                                                                                  <button onClick={onClose}>Later</button>
                                                                                                                          </div>
                                                                                                                                  <div className="status">{status}</div>
                                                                                                                                        </div>
                                                                                                                                            </div>
                                                                                                                                              );
                                                                                                                                              }