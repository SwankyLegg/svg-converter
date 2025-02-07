const { execSync } = require('child_process');

const runCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute ${command}`, error);
    process.exit(1);
  }
};

const checkGitStatus = () => {
  try {
    // Check if git is installed
    execSync('git --version', { stdio: 'ignore' });

    // Check if user is authenticated with GitHub
    try {
      execSync('git remote get-url origin', { stdio: 'ignore' });
    } catch (error) {
      console.error('❌ Git remote is not configured. Please set up your Git remote first.');
      process.exit(1);
    }

    // Check for uncommitted changes
    const status = execSync('git status --porcelain').toString();
    if (status) {
      console.error('❌ You have uncommitted changes. Please commit or stash them before deploying.');
      console.log('Uncommitted files:');
      console.log(status);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Git is not installed or there was an error checking git status.');
    process.exit(1);
  }
};

console.log('🔍 Checking Git status...');
checkGitStatus();

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