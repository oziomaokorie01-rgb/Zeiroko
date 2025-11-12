import React from 'react';

export default function HamburgerMenu({open, onClose, onOpen}) {
  return (
      <>
            <div className={`side-menu ${open ? 'open' : ''}`}>
                    <button className="close-left" onClick={onClose}>×</button>
                            <nav>
                                      <a href="/">Home</a>
                                                <a href="#about">About</a>
                                                          <a href="#how">How it works</a>
                                                                    <a href="#faq">FAQ</a>
                                                                              <a href="/#signup">Sign up</a>
                                                                                      </nav>
                                                                                            </div>
                                                                                                  <div className={`side-overlay ${open ? 'open' : ''}`} onClick={onClose}></div>
                                                                                                      </>
                                                                                                        );
                                                                                                        }