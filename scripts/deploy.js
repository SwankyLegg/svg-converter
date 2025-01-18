const { execSync } = require('child_process');

const runCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute ${command}`, error);
    process.exit(1);
  }
};

console.log('🚀 Starting deployment...');
console.log('📦 Building the project...');
runCommand('npm run build');

console.log('🔄 Switching to gh-pages branch...');
runCommand('git checkout gh-pages');

console.log('📋 Copying build files...');
runCommand('cp -r out/* .');
runCommand('rm -rf out/');

console.log('📤 Committing and pushing changes...');
runCommand('git add .');
runCommand('git commit -m "Deploy site updates"');
runCommand('git push origin gh-pages -f');

console.log('⏪ Switching back to main branch...');
runCommand('git checkout main');

console.log('✅ Deployment complete! Your site should be live in a few minutes.'); 