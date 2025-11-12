const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true },
    name: String,
      passwordHash: String,
        provider: { type: String, default: 'local' }, // local|google|twitter
          providerId: String,
            role: { type: String, default: 'user' }, // user|host|advertiser|admin
              emailVerified: { type: Boolean, default: false },
                needsPasswordSetup: { type: Boolean, default: false },
                  walletAddress: String,
                    createdAt: { type: Date, default: Date.now }
                    });

                    UserSchema.methods.comparePassword = function(plain) {
                      if (!this.passwordHash) return Promise.resolve(false);
                        return bcrypt.compare(plain, this.passwordHash);
                        };

                        UserSchema.statics.createWithPassword = async function(email, password, name) {
                          const hash = await bcrypt.hash(password, SALT_ROUNDS);
                            return this.create({ email, name, passwordHash: hash, provider: 'local', emailVerified: false });
                            };

                            const HostProfileSchema = new mongoose.Schema({
                              userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                                displayName: String,
                                  bio: String,
                                    price: Number,
                                      categories: [String],
                                        twitterHandle: String,
                                          createdAt: { type: Date, default: Date.now }
                                          });

                                          const ProjectSchema = new mongoose.Schema({
                                            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                                              title: String,
                                                description: String,
                                                  bannerUrl: String,
                                                    desiredCategories: [String],
                                                      createdAt: { type: Date, default: Date.now }
                                                      });

                                                      // Proofs: weekly screenshot uploads (GridFS metadata references)
                                                      const ProofSchema = new mongoose.Schema({
                                                        hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                                                          filename: String,
                                                            fileId: mongoose.Schema.Types.ObjectId, // GridFS file id
                                                              uploadedAt: { type: Date, default: Date.now }
                                                              });

                                                              const User = mongoose.model('User', UserSchema);
                                                              const HostProfile = mongoose.model('HostProfile', HostProfileSchema);
                                                              const Project = mongoose.model('Project', ProjectSchema);
                                                              const Proof = mongoose.model('Proof', ProofSchema);

                                                              module.exports = { User, HostProfile, Project, Proof };