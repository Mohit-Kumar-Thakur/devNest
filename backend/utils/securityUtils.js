import crypto from 'crypto';

/**
 * Generate consistent user hash for anonymous tracking
 * Same user always gets same hash, but hash cannot be reversed
 */
export const generateUserHash = (userId, email) => {
  if (!process.env.USER_HASH_SECRET) {
    throw new Error('USER_HASH_SECRET is not configured');
  }
  
  const secret = process.env.USER_HASH_SECRET;
  const data = `${userId}-${email}-${secret}`;
  
  return crypto
    .createHash('sha256') // Use SHA-256 for better security than MD5
    .update(data)
    .digest('hex')
    .substring(0, 32); // Use first 32 chars for consistency
};

/**
 * Verify if a hash matches a user (for admin identification)
 */
export const verifyUserHash = (userHash, userId, email) => {
  const expectedHash = generateUserHash(userId, email);
  return userHash === expectedHash;
};
export const logSecurityEvent = (eventType, adminUserId, postId, details = {}) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        eventType,
        adminUserId,
        postId: postId || null,
        details,
        ip: details.ipAddress || 'unknown'
    };
    
    console.log(`[SECURITY] ${timestamp} - ${eventType}:`, logEntry);
    
    // In production, you might want to save this to a database
    // await SecurityLog.create(logEntry);
};
/**
 * Generate display name from hash (consistent for same user)
 */
export const generateAnonymousName = (userHash) => {
  const names = [
    'Silent Scholar', 'Mystic Learner', 'Digital Thinker', 
    'Code Philosopher', 'Anonymous Student', 'Curious Mind',
    'Secret Scholar', 'Hidden Genius', 'Quiet Observer',
    'Digital Wanderer', 'Tech Explorer', 'Knowledge Seeker',
    'Anonymous Mentor', 'Tech Philosopher', 'Digital Nomad',
    'Code Alchemist', 'Data Dreamer', 'Byte Thinker'
  ];
  
  // Use hash to pick consistent but anonymous name
  const hashNum = parseInt(userHash.substring(0, 8), 16);
  return names[hashNum % names.length];
};

// Test function (remove in production)
export const testHashGeneration = () => {
  const testUserId = '507f1f77bcf86cd799439011';
  const testEmail = 'test@example.com';
  
  const hash1 = generateUserHash(testUserId, testEmail);
  const hash2 = generateUserHash(testUserId, testEmail);
  
  console.log('Hash consistency test:');
  console.log('Hash 1:', hash1);
  console.log('Hash 2:', hash2);
  console.log('Hashes match:', hash1 === hash2);
  console.log('Anonymous name:', generateAnonymousName(hash1));
};