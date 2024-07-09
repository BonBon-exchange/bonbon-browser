const { execSync } = require('child_process');

try {
  execSync(
    'npm install -g ts-node & node --loader ts-node/esm ./.erb/scripts/check-native-dep.mjs',
    {
      stdio: 'inherit',
    }
  );
} catch (error) {
  console.error('Failed to run check-native-dep script:', error);
  process.exit(1);
}
