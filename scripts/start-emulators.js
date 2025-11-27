#!/usr/bin/env node

/**
 * Script to start Firebase Emulators for local testing
 * This script starts all Firebase emulators in the background
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Firebase Emulators...\n');

// Start Firebase emulators
const emulatorProcess = spawn('firebase', ['emulators:start'], {
  stdio: 'inherit',
  shell: true,
  cwd: path.resolve(__dirname, '..')
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping Firebase Emulators...');
  emulatorProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping Firebase Emulators...');
  emulatorProcess.kill('SIGTERM');
  process.exit(0);
});

emulatorProcess.on('close', (code) => {
  console.log(`\n✅ Firebase Emulators stopped with code ${code}`);
  process.exit(code);
});

emulatorProcess.on('error', (error) => {
  console.error('❌ Error starting Firebase Emulators:', error);
  console.error('\n💡 Make sure Firebase CLI is installed: npm install -g firebase-tools');
  process.exit(1);
});

