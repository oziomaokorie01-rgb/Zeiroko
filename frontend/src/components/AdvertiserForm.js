import React, { useState } from 'react';
import api from '../api';

export default function AdvertiserForm(){
  const [form, setForm] = useState({ title:'', description:'', bannerUrl:'', desiredCategories:[] });
    const [status, setStatus] = useState('');

      const submit = async () => {
          try {
                setStatus('saving...');
                      const r = await api.post('/api/projects', {
                              title: form.title,
                                      description: form.description,
                                              bannerUrl: form.bannerUrl,
                                                      desiredCategories: form.desiredCategories
                                                            });
                                                                  setStatus('saved');
                                                                      } catch (e) { setStatus('error'); }
                                                                        };

                                                                          return (
                                                                              <div className="card">
                                                                                    <h3 style={{fontFamily:'Times New Roman'}}>Create Campaign</h3>
                                                                                          <input placeholder="Campaign title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
                                                                                                <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}></textarea>
                                                                                                      <input placeholder="Banner image URL (or placeholder)" value={form.bannerUrl} onChange={e=>setForm({...form, bannerUrl:e.target.value})} />
                                                                                                            <input placeholder="Categories (comma separated)" value={form.desiredCategories.join(',')} onChange={e=>{
                                                                                                                    setForm({...form, desiredCategories: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)});
                                                                                                                          }} />
                                                                                                                                <div style={{display:'flex',gap:8}}>
                                                                                                                                        <button className="primary" onClick={submit}>Create campaign</button>
                                                                                                                                              </div>
                                                                                                                                                    <div className="status">{status}</div>
                                                                                                                                                        </div>
                                                                                                                                                          );
                                                                                                                                                          }