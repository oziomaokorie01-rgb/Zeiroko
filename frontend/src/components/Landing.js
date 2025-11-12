import React, { useState, useEffect } from 'react';
import api from '../api';

const Icon = ({type}) => {
  if (type==='google') return <svg width="28" height="28" viewBox="0 0 48 48" className="icon"><path fill="#EA4335" d="M24 12v8h12c-.5 3.5-3 8-12 8-7 0-13-6-13-13s6-13 13-13c3 0 5 1 7 2z"/></svg>;
    if (type==='twitter') return <svg width="28" height="28"><path fill="#1DA1F2" d="M22 5.9c-.6.3-1.2.5-1.9.6.7-.4 1.2-1 1.5-1.7-.7.4-1.5.7-2.3.9C18.3 5 17 4.5 15.6 4.5c-2 0-3.6 1.6-3.6 3.6 0 .3 0 .6.1.9C8.3 9 5.2 7.5 3.1 5c-.4.7-.6 1.5-.6 2.4 0 1.6.8 3 2 3.8-.6 0-1.2-.2-1.7-.5v.1c0 2.3 1.6 4.2 3.7 4.6-.4.1-.8.1-1.2.1-.3 0-.6 0-.9-.1.6 2 2.4 3.5 4.6 3.6-1.6 1.3-3.5 2-5.6 2-.4 0-.7 0-1-.1C4.1 20.4 7.6 21.5 11.4 21.5c7.1 0 11-6 11-11.2v-.5c.8-.6 1.5-1.3 2-2.1-.7.3-1.4.5-2.1.6z"/></svg>;
      return <svg width="28" height="28"><circle cx="12" cy="12" r="10"/></svg>;
      };

      export default function Landing({onLogin}) {
        const [form, setForm] = useState({ email:'', password:'', name:'' });

          useEffect(()=>{
              // If came from OAuth redirect
                  const url = new URL(window.location.href);
                      if (url.searchParams.get('oauth') === 'success') {
                            (async ()=>{
                                    try {
                                              const r = await api.get('/api/auth/me');
                                                        if (r.data.user) onLogin(r.data.user);
                                                                } catch (e) {}
                                                                      })();
                                                                          }
                                                                            }, [onLogin]);

                                                                              const signup = async () => {
                                                                                  try {
                                                                                        const r = await api.post('/api/auth/signup', form);
                                                                                              if (r.data.ok) onLogin(r.data.user);
                                                                                                    alert('Verification email sent — check your inbox.');
                                                                                                        } catch (e) { alert(e.response?.data?.error || 'signup error'); }
                                                                                                          };
                                                                                                            const login = async () => {
                                                                                                                try {
                                                                                                                      const r = await api.post('/api/auth/login', { email: form.email, password: form.password });
                                                                                                                            if (r.data.ok) onLogin(r.data.user);
                                                                                                                                } catch (e) { alert(e.response?.data?.error || 'login failed'); }
                                                                                                                                  };

                                                                                                                                    const googleUrl = `${(process.env.REACT_APP_API_URL || 'http://localhost:4000')}/auth/google`;
                                                                                                                                      const twitterUrl = `${(process.env.REACT_APP_API_URL || 'http://localhost:4000')}/auth/twitter`;

                                                                                                                                        return (
                                                                                                                                            <div className="card">
                                                                                                                                                  <h2>Welcome to ZEIROKO</h2>
                                                                                                                                                        <p style={{fontFamily:'Times New Roman'}}>Peer-to-peer banner advertising — hosts and projects connect directly.</p>
                                                                                                                                                              <div style={{display:'flex',gap:12}}>
                                                                                                                                                                      <a className="oauth-btn" href={googleUrl}><Icon type="google" /> Connect with Google</a>
                                                                                                                                                                              <a className="oauth-btn" href={twitterUrl}><Icon type="twitter" /> Connect with Twitter</a>
                                                                                                                                                                                    </div>

                                                                                                                                                                                          <div style={{marginTop:12}}>— or —</div>
                                                                                                                                                                                                <div style={{marginTop:12}}>
                                                                                                                                                                                                        <input placeholder="Name (optional)" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
                                                                                                                                                                                                                <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
                                                                                                                                                                                                                        <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
                                                                                                                                                                                                                                <div style={{display:'flex',gap:8}}>
                                                                                                                                                                                                                                          <button className="primary" onClick={login}>Sign in</button>
                                                                                                                                                                                                                                                    <button onClick={signup}>Sign up</button>
                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                        );
                                                                                                                                                                                                                                                                        }