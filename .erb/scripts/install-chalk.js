const { execSync } = require('child_process');
const fs = require('fs');

// Check if chalk is already installed
const isChalkInstalled = () => {
  try {
    require.resolve('chalk');
    return true;
  } catch (e) {
    return false;
  }
};

// Install chalk if not installed
if (!isChalkInstalled()) {
  console.log('Installing chalk...');
  execSync('npm install chalk', { stdio: 'inherit' });
} else {
  console.log('Chalk is already installed.');
}
