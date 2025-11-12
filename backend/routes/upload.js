const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const { Proof } = require('../models');
const { verifyToken } = require('../utils/jwt');

const mongoURI = process.env.MONGO_URI;
const storage = new GridFsStorage({
  url: mongoURI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
      file: (req, file) => {
          const filename = `proof_${Date.now()}_${file.originalname}`;
              return { filename, bucketName: 'proofs' };
                }
                });
                const upload = multer({ storage });

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

                                          // upload screenshot (host)
                                          router.post('/screenshot', requireAuth, upload.single('file'), async (req, res, next) => {
                                            try {
                                                // req.file.id is the GridFS file id
                                                    const proof = await Proof.create({ hostId: req.userId, filename: req.file.filename, fileId: req.file.id });
                                                        res.json({ ok: true, proof });
                                                          } catch (err) { next(err); }
                                                          });

                                                          // download by fileId
                                                          router.get('/screenshot/:id', async (req, res, next) => {
                                                            try {
                                                                const conn = mongoose.connection;
                                                                    const Grid = require('gridfs-stream');
                                                                        Grid.mongo = mongoose.mongo;
                                                                            const gfs = Grid(conn.db);
                                                                                const fileId = req.params.id;
                                                                                    const objId = mongoose.Types.ObjectId(fileId);
                                                                                        const readstream = gfs.createReadStream({ _id: objId, root: 'proofs' });
                                                                                            readstream.on('error', function(err){ res.status(404).send('Not found'); });
                                                                                                readstream.pipe(res);
                                                                                                  } catch (err) { next(err); }
                                                                                                  });

                                                                                                  module.exports = router;