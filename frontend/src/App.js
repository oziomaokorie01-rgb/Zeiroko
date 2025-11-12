import React, { useEffect, useState } from 'react';
import api from './api';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import SetPasswordModal from './components/SetPasswordModal';

export default function App(){
  const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('light');
      const [showSetPassword, setShowSetPassword] = useState(false);

        useEffect(() => {
            (async () => {
                  try {
                          const r = await api.get('/api/auth/me');
                                  setUser(r.data.user);
                                          if (r.data.user?.needsPasswordSetup) setShowSetPassword(true);
                                                } catch (e) {}
                                                    })();
                                                      }, []);

                                                        return (
                                                            <div className={`app ${theme}`}>
                                                                  <div className="background-canvas" aria-hidden="true"></div>
                                                                        <header className="topbar">
                                                                                <h1 className="brand">ZEIROKO</h1>
                                                                                        <div className="top-actions">
                                                                                                  <button className="theme-btn" onClick={()=>setTheme(t=>t==='light'?'dark':'light')}>{theme==='light'?'Dark':'Light'}</button>
                                                                                                          </div>
                                                                                                                </header>

                                                                                                                      <main className="main">
                                                                                                                              {!user ? <Landing onLogin={(u)=>setUser(u)} /> : <Dashboard user={user} />}
                                                                                                                                    </main>

                                                                                                                                          {showSetPassword && <SetPasswordModal onClose={()=>setShowSetPassword(false)} onDone={()=>{
                                                                                                                                                  setShowSetPassword(false);
                                                                                                                                                          (async ()=>{
                                                                                                                                                                    const r = await api.get('/api/auth/me');
                                                                                                                                                                              setUser(r.data.user);
                                                                                                                                                                                      })();
                                                                                                                                                                                            }} />}
                                                                                                                                                                                                </div>
                                                                                                                                                                                                  );
                                                                                                                                                                                                  }