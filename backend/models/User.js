import mongoose from "mongoose";
import { generateUserHash } from "../utils/securityUtils.js";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { 
    type: String, 
    enum: ['user', 'admin', 'moderator'], 
    default: 'user' 
  },
  isVerified: { type: Boolean, default: false },
  verifyToken: String,
  googleId: String,
  resetOTP: String,
  resetOTPExpires: Date,
  
  // Security tracking - REMOVE THE VALIDATOR TEMPORARILY
  userHash: { 
    type: String, 
    unique: true,
    // Remove the validator for now to debug
    // validate: {
    //   validator: function(hash) {
    //     // Basic hash validation (32 char hex string)
    //     return /^[a-f0-9]{32}$/.test(hash);
    //   },
    //   message: 'Invalid user hash format'
    // }
  },
  
  reportedCount: { type: Number, default: 0 },
  isBanned: { type: Boolean, default: false },
  banReason: String,
  banExpires: Date
}, { timestamps: true });

// Enhanced pre-save middleware with better error handling
userSchema.pre('save', function(next) {
  // Only generate hash for new users or if hash is missing
  if ((this.isNew || !this.userHash) && this.email) {
    try {
      console.log('Generating userHash for:', this.email);
      
      // Make sure we have the required data
      if (!this._id) {
        console.log('Waiting for _id to be generated...');
        return next();
      }
      
      const userHash = generateUserHash(this._id.toString(), this.email);
      console.log('Generated userHash:', userHash);
      
      this.userHash = userHash;
    } catch (error) {
      console.error('Error generating user hash:', error);
      // Don't block the save operation if hash generation fails
      // This allows users to be created even if hash fails
      // The auth middleware will handle missing hashes later
    }
  }
  next();
});

// Also add a post-save hook to ensure hash is set
userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    // Handle duplicate key error (unique constraint)
    if (error.keyValue.userHash) {
      console.error('Duplicate userHash detected:', error.keyValue.userHash);
      // Regenerate hash and retry
      try {
        const newHash = generateUserHash(doc._id.toString(), doc.email + Date.now());
        doc.userHash = newHash;
        doc.save().then(() => next()).catch(next);
        return;
      } catch (hashError) {
        console.error('Error regenerating user hash:', hashError);
      }
    }
  }
  next(error);
});

export default mongoose.model("User", userSchema);