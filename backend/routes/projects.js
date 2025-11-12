const express = require('express');
const router = express.Router();
const { Project } = require('../models');
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
                                const { title, description, bannerUrl, desiredCategories = [] } = req.body;
                                    const project = await Project.create({ userId: req.userId, title, description, bannerUrl, desiredCategories });
                                        res.json({ ok: true, project });
                                          } catch (err) { next(err); }
                                          });

                                          router.get('/', async (req, res, next) => {
                                            try {
                                                const projects = await Project.find().lean();
                                                    res.json({ projects });
                                                      } catch (err) { next(err); }
                                                      });

                                                      module.exports = router;