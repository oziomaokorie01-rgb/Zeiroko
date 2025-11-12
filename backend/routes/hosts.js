const express = require('express');
const router = express.Router();
const { HostProfile, Proof } = require('../models');
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

                          router.post('/', requireAuth, async (req, res, next) => {
                            try {
                                const { displayName, bio, price, categories = [], twitterHandle } = req.body;
                                    let profile = await HostProfile.findOne({ userId: req.userId });
                                        if (!profile) {
                                              profile = await HostProfile.create({ userId: req.userId, displayName, bio, price, categories, twitterHandle });
                                                  } else {
                                                        profile.displayName = displayName; profile.bio = bio; profile.price = price; profile.categories = categories; profile.twitterHandle = twitterHandle;
                                                              await profile.save();
                                                                  }
                                                                      res.json({ ok: true, profile });
                                                                        } catch (err) { next(err); }
                                                                        });

                                                                        router.get('/me', requireAuth, async (req, res, next) => {
                                                                          try {
                                                                              const profile = await HostProfile.findOne({ userId: req.userId });
                                                                                  res.json({ profile });
                                                                                    } catch (err) { next(err); }
                                                                                    });

                                                                                    router.get('/', async (req, res, next) => {
                                                                                      try {
                                                                                          const { category } = req.query;
                                                                                              let q = {};
                                                                                                  if (category) q.categories = category;
                                                                                                      const hosts = await HostProfile.find(q).lean();
                                                                                                          res.json({ hosts });
                                                                                                            } catch (err) { next(err); }
                                                                                                            });

                                                                                                            module.exports = router;