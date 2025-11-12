const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { signToken, verifyToken } = require('../utils/jwt');
const { sendVerificationEmail } = require('../mailer');
const validator = require('validator');

// signup (email)
router.post('/signup', async (req, res, next) => {
  try {
      const { email, password, name } = req.body;
          if (!email || !password || !validator.isEmail(email)) return res.status(400).json({ error: 'valid email & password required' });
              const existing = await User.findOne({ email });
                  if (existing) return res.status(400).json({ error: 'user exists' });
                      const user = await User.createWithPassword(email, password, name);
                          // create verification token (short lived)
                              const token = signToken({ id: user._id, type: 'email_verify' });
                                  await sendVerificationEmail(email, token);
                                      // set cookie
                                          const authToken = signToken({ id: user._id });
                                              res.cookie('jid', authToken, { httpOnly: true, sameSite: 'lax' });
                                                  res.json({ ok: true, user: { id: user._id, email: user.email, needsVerify: true } });
                                                    } catch (err) { next(err); }
                                                    });

                                                    // verify email endpoint used by frontend
                                                    router.post('/verify-email', async (req, res, next) => {
                                                      try {
                                                          const { token } = req.body;
                                                              if (!token) return res.status(400).json({ error: 'token required' });
                                                                  const payload = verifyToken(token);
                                                                      if (!payload || payload.type !== 'email_verify') return res.status(400).json({ error: 'invalid token' });
                                                                          const user = await User.findById(payload.id);
                                                                              if (!user) return res.status(400).json({ error: 'user not found' });
                                                                                  user.emailVerified = true;
                                                                                      await user.save();
                                                                                          res.json({ ok: true });
                                                                                            } catch (err) { next(err); }
                                                                                            });

                                                                                            // login (email)
                                                                                            router.post('/login', async (req, res, next) => {
                                                                                              try {
                                                                                                  const { email, password } = req.body;
                                                                                                      if (!email || !password) return res.status(400).json({ error: 'email & password required' });
                                                                                                          const user = await User.findOne({ email });
                                                                                                              if (!user) return res.status(400).json({ error: 'invalid credentials' });
                                                                                                                  const ok = await user.comparePassword(password);
                                                                                                                      if (!ok) return res.status(400).json({ error: 'invalid credentials' });
                                                                                                                          const token = signToken({ id: user._id });
                                                                                                                              res.cookie('jid', token, { httpOnly: true, sameSite: 'lax' });
                                                                                                                                  res.json({ ok: true, user: { id: user._id, email: user.email, name: user.name, emailVerified: user.emailVerified } });
                                                                                                                                    } catch (err) { next(err); }
                                                                                                                                    });

                                                                                                                                    // set password for oauth users
                                                                                                                                    router.post('/set-password', async (req, res, next) => {
                                                                                                                                      try {
                                                                                                                                          const auth = req.cookies.jid;
                                                                                                                                              if (!auth) return res.status(401).json({ error: 'not authenticated' });
                                                                                                                                                  const payload = verifyToken(auth);
                                                                                                                                                      const user = await User.findById(payload.id);
                                                                                                                                                          if (!user) return res.status(401).json({ error: 'user not found' });
                                                                                                                                                              const { password } = req.body;
                                                                                                                                                                  if (!password) return res.status(400).json({ error: 'password required' });
                                                                                                                                                                      const bcrypt = require('bcrypt');
                                                                                                                                                                          user.passwordHash = await bcrypt.hash(password, 10);
                                                                                                                                                                              user.needsPasswordSetup = false;
                                                                                                                                                                                  await user.save();
                                                                                                                                                                                      res.json({ ok: true });
                                                                                                                                                                                        } catch (err) { next(err); }
                                                                                                                                                                                        });

                                                                                                                                                                                        // me
                                                                                                                                                                                        router.get('/me', async (req, res, next) => {
                                                                                                                                                                                          try {
                                                                                                                                                                                              const auth = req.cookies.jid;
                                                                                                                                                                                                  if (!auth) return res.json({ user: null });
                                                                                                                                                                                                      const payload = verifyToken(auth);
                                                                                                                                                                                                          if (!payload) return res.json({ user: null });
                                                                                                                                                                                                              const user = await User.findById(payload.id).lean();
                                                                                                                                                                                                                  if (!user) return res.json({ user: null });
                                                                                                                                                                                                                      res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role, emailVerified: user.emailVerified, needsPasswordSetup: user.needsPasswordSetup, walletAddress: user.walletAddress }});
                                                                                                                                                                                                                        } catch (err) { next(err); }
                                                                                                                                                                                                                        });

                                                                                                                                                                                                                        // logout
                                                                                                                                                                                                                        router.post('/logout', (req, res) => {
                                                                                                                                                                                                                          res.clearCookie('jid');
                                                                                                                                                                                                                            res.json({ ok: true });
                                                                                                                                                                                                                            });

                                                                                                                                                                                                                            module.exports = router;