require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const hostRoutes = require('./routes/hosts');
const projectRoutes = require('./routes/projects');
const uploadRoutes = require('./routes/upload');

require('./auth')(passport);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization']
      }));

      const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
          max: 200
          });
          app.use(limiter);

          // Connect to MongoDB
          const mongoose = require('mongoose');
          mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
              useUnifiedTopology: true
              }).then(()=>console.log('MongoDB connected')).catch(err=>{ console.error('MongoDB connect error', err); process.exit(1); });

              // routes
              app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));
              app.use('/api/auth', authRoutes);
              app.use('/api/users', userRoutes);
              app.use('/api/hosts', hostRoutes);
              app.use('/api/projects', projectRoutes);
              app.use('/api/upload', uploadRoutes);

              // oauth routes (Google & Twitter)
              app.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] }));
              app.get('/auth/google/callback',
                passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/?oauth=fail` }),
                  (req, res) => {
                      // send a JWT cookie then redirect
                          const { signToken } = require('./utils/jwt');
                              const token = signToken({ id: req.user._id, email: req.user.email });
                                  res.cookie('jid', token, { httpOnly: true, secure: false, sameSite: 'lax' });
                                      res.redirect(`${process.env.FRONTEND_URL}/?oauth=success`);
                                        });

                                        app.get('/auth/twitter', passport.authenticate('twitter'));
                                        app.get('/auth/twitter/callback',
                                          passport.authenticate('twitter', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/?oauth=fail` }),
                                            (req, res) => {
                                                const { signToken } = require('./utils/jwt');
                                                    const token = signToken({ id: req.user._id, email: req.user.email });
                                                        res.cookie('jid', token, { httpOnly: true, secure: false, sameSite: 'lax' });
                                                            res.redirect(`${process.env.FRONTEND_URL}/?oauth=success`);
                                                              });

                                                              // global error handler
                                                              app.use((err, req, res, next) => {
                                                                console.error('err:', err);
                                                                  res.status(err.status || 500).json({ error: err.message || 'server error' });
                                                                  });

                                                                  app.listen(PORT, ()=>console.log(`Server running on ${PORT}`));