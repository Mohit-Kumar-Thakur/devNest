import dotenv from 'dotenv';
dotenv.config();

import { testHashGeneration } from './utils/securityUtils.js';

console.log('Testing USER_HASH_SECRET setup...');
console.log('Secret exists:', !!process.env.USER_HASH_SECRET);
console.log('Secret length:', process.env.USER_HASH_SECRET?.length);

if (process.env.USER_HASH_SECRET) {
  testHashGeneration();
} else {
  console.error('❌ USER_HASH_SECRET is not set!');
  console.log('Please add to your .env file:');
  console.log('USER_HASH_SECRET=your-generated-secret-here');
}