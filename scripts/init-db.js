#!/usr/bin/env node

/**
 * Database Initialization Script
 *
 * This script helps you set up your Neon.tech database for the CryptoTrack dashboard.
 * Run with: node scripts/init-db.js
 */

const readline = require('readline');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.clear();
  log('╔══════════════════════════════════════════════════════════╗', colors.cyan);
  log('║     CryptoTrack Dashboard - Database Setup Wizard      ║', colors.cyan);
  log('╚══════════════════════════════════════════════════════════╝', colors.cyan);
  console.log();

  log('This wizard will help you set up your database connection.', colors.dim);
  console.log();

  // Check if .env.local exists
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    log('⚠️  .env.local file not found!', colors.yellow);
    log('Creating .env.local file...', colors.dim);

    const exampleEnvPath = path.join(__dirname, '..', '.env.example');
    if (fs.existsSync(exampleEnvPath)) {
      fs.copyFileSync(exampleEnvPath, envPath);
      log('✓ Created .env.local from .env.example', colors.green);
    }
  }

  // Step 1: Database URL
  log('\n📊 Step 1: Neon.tech Database Connection', colors.blue);
  log('───────────────────────────────────────────', colors.dim);

  log('\nHave you created a Neon.tech database yet?', colors.bright);
  log('1. Yes, I have my connection string', colors.dim);
  log('2. No, take me to Neon.tech to create one', colors.dim);

  const hasDb = await question('\nYour choice (1 or 2): ');

  if (hasDb.trim() === '2') {
    log('\n📖 Opening Neon.tech in your browser...', colors.cyan);
    log('\nSteps to get your connection string:', colors.bright);
    log('1. Sign up at https://neon.tech', colors.dim);
    log('2. Create a new project', colors.dim);
    log('3. Copy the connection string (starts with postgresql://)', colors.dim);
    log('4. Come back here and paste it\n', colors.dim);

    // Open browser (cross-platform)
    const command = process.platform === 'win32' ? 'start' :
                    process.platform === 'darwin' ? 'open' : 'xdg-open';
    require('child_process').exec(`${command} https://neon.tech`);

    await question('Press Enter when you have your connection string...');
  }

  log('\n🔗 Enter your Neon.tech connection string:', colors.bright);
  log('(Example: postgresql://user:pass@ep-xxx.aws.neon.tech/db?sslmode=require)', colors.dim);

  const dbUrl = await question('\nDATABASE_URL: ');

  if (!dbUrl.trim().startsWith('postgresql://')) {
    log('\n❌ Invalid connection string. It should start with "postgresql://"', colors.red);
    process.exit(1);
  }

  // Step 2: NextAuth Secret
  log('\n🔐 Step 2: Authentication Secret', colors.blue);
  log('─────────────────────────────────', colors.dim);
  log('\nGenerating a secure secret for authentication...', colors.dim);

  const secret = require('crypto').randomBytes(32).toString('base64');
  log(`✓ Generated secret: ${secret.substring(0, 20)}...`, colors.green);

  // Step 3: Update .env.local
  log('\n📝 Step 3: Updating .env.local', colors.blue);
  log('────────────────────────────────', colors.dim);

  let envContent = fs.readFileSync(envPath, 'utf-8');

  // Update DATABASE_URL
  envContent = envContent.replace(
    /DATABASE_URL=.*/,
    `DATABASE_URL="${dbUrl.trim()}"`
  );

  // Update NEXTAUTH_SECRET
  envContent = envContent.replace(
    /NEXTAUTH_SECRET=.*/,
    `NEXTAUTH_SECRET="${secret}"`
  );

  fs.writeFileSync(envPath, envContent);
  log('✓ Updated .env.local with your database URL and auth secret', colors.green);

  // Step 4: Push database schema
  log('\n🗄️  Step 4: Creating Database Tables', colors.blue);
  log('──────────────────────────────────────', colors.dim);

  const pushDb = await question('\nPush database schema now? (Y/n): ');

  if (pushDb.toLowerCase() !== 'n') {
    log('\n📤 Pushing database schema...', colors.cyan);
    log('This will create all necessary tables in your database.\n', colors.dim);

    await new Promise((resolve, reject) => {
      const dbPush = spawn('npm', ['run', 'db:push'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
        shell: true
      });

      dbPush.on('close', (code) => {
        if (code === 0) {
          log('\n✓ Database schema pushed successfully!', colors.green);
          resolve();
        } else {
          log('\n❌ Failed to push database schema', colors.red);
          reject();
        }
      });
    });
  }

  // Step 5: Done!
  log('\n╔══════════════════════════════════════════════════════════╗', colors.green);
  log('║                  Setup Complete! 🎉                      ║', colors.green);
  log('╚══════════════════════════════════════════════════════════╝', colors.green);

  log('\n✅ Your CryptoTrack dashboard is ready to run!', colors.bright);
  log('\nNext steps:', colors.bright);
  log('1. Run: npm run dev', colors.cyan);
  log('2. Open: http://localhost:3000', colors.cyan);
  log('3. Enjoy tracking crypto! 🚀', colors.cyan);

  log('\n📚 Documentation:', colors.dim);
  log('- Setup Guide: SETUP_GUIDE.md', colors.dim);
  log('- Deployment: DEPLOYMENT.md', colors.dim);
  log('- Features: ROADMAP.md', colors.dim);

  console.log();
  rl.close();
}

main().catch((error) => {
  log(`\n❌ Error: ${error.message}`, colors.red);
  process.exit(1);
});
