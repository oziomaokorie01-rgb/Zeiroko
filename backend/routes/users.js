const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { verifyToken } = require('../utils/jwt');

function requireAuth(req, res, next) {
  const token = req.cookies.jid;
    if (!token) return res.status(401).json({ error: 'not authenticated' });
      try {
          const payload = verifyToken(token);
              req.userId = payload.id;
                  return next();
                    } catch (e) {
                        return res.status(401).json({ error: 'invalid token' });
                          }
                          }

                          // set wallet address
                          router.post('/wallet', requireAuth, async (req, res, next) => {
                            try {
                                const { address } = req.body;
                                    if (!address) return res.status(400).json({ error: 'address required' });
                                        const user = await User.findById(req.userId);
                                            user.walletAddress = address;
                                                await user.save();
                                                    res.json({ ok: true, walletAddress: address });
                                                      } catch (err) { next(err); }
                                                      });

                                                      module.exports = router;