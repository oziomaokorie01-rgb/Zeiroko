import React, { useState } from 'react';
import api from '../api';

export default function HostForm({ existing }) {
  const [form, setForm] = useState({
      displayName: existing?.displayName || '',
          bio: existing?.bio || '',
              price: existing?.price || '',
                  categories: existing?.categories || [],
                      twitterHandle: existing?.twitterHandle || ''
                        });
                          const [status, setStatus] = useState('');

                            const submit = async () => {
                                try {
                                      setStatus('saving...');
                                            const r = await api.post('/api/hosts', {
                                                    displayName: form.displayName,
                                                            bio: form.bio,
                                                                    price: parseFloat(form.price),
                                                                            categories: form.categories,
                                                                                    twitterHandle: form.twitterHandle
                                                                                          });
                                                                                                setStatus('saved');
                                                                                                    } catch (e) { setStatus('error'); }
                                                                                                      };

                                                                                                        // upload proof
                                                                                                          const uploadProof = async (file) => {
                                                                                                              const fd = new FormData(); fd.append('file', file);
                                                                                                                  try {
                                                                                                                        const r = await api.post('/api/upload/screenshot', fd, { headers: {'Content-Type':'multipart/form-data'} });
                                                                                                                              alert('uploaded proof');
                                                                                                                                  } catch (e) { alert('upload failed'); }
                                                                                                                                    };

                                                                                                                                      return (
                                                                                                                                          <div className="card">
                                                                                                                                                <h3 style={{fontFamily:'Times New Roman'}}>Host profile</h3>
                                                                                                                                                      <input placeholder="Display name" value={form.displayName} onChange={e=>setForm({...form, displayName:e.target.value})} />
                                                                                                                                                            <textarea placeholder="Short bio" value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})}></textarea>
                                                                                                                                                                  <input placeholder="Price (USD)" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
                                                                                                                                                                        <input placeholder="Categories (comma separated)" value={form.categories.join(',')} onChange={e=>setForm({...form, categories: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} />
                                                                                                                                                                              <input placeholder="Twitter handle (optional)" value={form.twitterHandle} onChange={e=>setForm({...form, twitterHandle:e.target.value})} />
                                                                                                                                                                                    <div style={{display:'flex',gap:8}}>
                                                                                                                                                                                            <button className="primary" onClick={submit}>Save profile</button>
                                                                                                                                                                                                    <label style={{alignSelf:'center'}}>
                                                                                                                                                                                                              <input type="file" accept="image/*" style={{display:'none'}} onChange={e=>uploadProof(e.target.files[0])} />
                                                                                                                                                                                                                        <span style={{cursor:'pointer'}}>Upload weekly screenshot</span>
                                                                                                                                                                                                                                </label>
                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                            <div className="status">{status}</div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                  );
                                                                                                                                                                                                                                                  }