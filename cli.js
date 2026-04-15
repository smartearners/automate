#!/usr/bin/env node

/**
 * DevOps CLI - Common development operations
 * @author Cherie (smartearners)
 * @license MIT
 */

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

program
  .name('devops')
  .description('DevOps CLI for common development operations')
  .version('1.0.0');

// Backup command
program
  .command('backup')
  .description('Create a backup of specified directory')
  .argument('<source>', 'Source directory to backup')
  .option('-d, --dest <destination>', 'Backup destination', './backups')
  .option('-n, --name <name>', 'Backup name (timestamp if not specified)')
  .option('-c, --compress', 'Compress backup with gzip', false)
  .action((source, options) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = options.name || `backup-${timestamp}`;
    const destPath = path.join(options.dest, backupName);

    console.log(`📦 Creating backup: ${source} → ${destPath}`);

    try {
      if (!fs.existsSync(options.dest)) {
        fs.mkdirSync(options.dest, { recursive: true });
      }

      if (options.compress) {
        const tarPath = `${destPath}.tar.gz`;
        execSync(`tar -czf ${tarPath} ${source}`, { stdio: 'inherit' });
        console.log(`✅ Compressed backup created: ${tarPath}`);
      } else {
        execSync(`cp -r ${source} ${destPath}`, { stdio: 'inherit' });
        console.log(`✅ Backup created: ${destPath}`);
      }
    } catch (error) {
      console.error(`❌ Backup failed: ${error.message}`);
      process.exit(1);
    }
  });

// Deploy command
program
  .command('deploy')
  .description('Deploy application to production')
  .option('-e, --env <environment>', 'Target environment', 'production')
  .option('-b, --branch <branch>', 'Git branch to deploy', 'main')
  .option('-s, --skip-tests', 'Skip tests before deployment', false)
  .action((options) => {
    console.log(`🚀 Deploying to ${options.env} from branch ${options.branch}`);

    try {
      // Run tests unless skipped
      if (!options.skipTests) {
        console.log('🧪 Running tests...');
        execSync('npm test', { stdio: 'inherit' });
      }

      // Build
      console.log('🔨 Building...');
      execSync('npm run build', { stdio: 'inherit' });

      // Deploy (placeholder - customize for your setup)
      console.log('📤 Deploying...');
      console.log('⚠️  Configure deployment command for your infrastructure');

      console.log(`✅ Deployed to ${options.env}`);
    } catch (error) {
      console.error(`❌ Deployment failed: ${error.message}`);
      process.exit(1);
    }
  });

// Monitor command
program
  .command('monitor')
  .description('Monitor application health')
  .option('-u, --url <url>', 'Application URL to monitor')
  .option('-i, --interval <seconds>', 'Check interval in seconds', '60')
  .action((options) => {
    if (!options.url) {
      console.error('❌ URL is required for monitoring');
      process.exit(1);
    }

    console.log(`👀 Monitoring ${options.url} every ${options.interval}s`);
    console.log('Press Ctrl+C to stop');

    const interval = setInterval(async () => {
      try {
        const start = Date.now();
        const response = await fetch(options.url);
        const duration = Date.now() - start;

        if (response.ok) {
          console.log(`✅ ${new Date().toISOString()} - ${response.status} (${duration}ms)`);
        } else {
          console.log(`⚠️  ${new Date().toISOString()} - ${response.status} (${duration}ms)`);
        }
      } catch (error) {
        console.log(`❌ ${new Date().toISOString()} - ${error.message}`);
      }
    }, options.interval * 1000);

    process.on('SIGINT', () => {
      clearInterval(interval);
      console.log('\n👋 Monitoring stopped');
      process.exit(0);
    });
  });

// Logs command
program
  .command('logs')
  .description('View and filter application logs')
  .option('-f, --follow', 'Follow log output', false)
  .option('-n, --lines <number>', 'Number of lines to show', '100')
  .option('-l, --level <level>', 'Filter by log level (error, warn, info, debug)')
  .action((options) => {
    console.log('📋 Viewing logs...');

    try {
      let command = `tail -n ${options.lines}`;

      if (options.follow) {
        command = 'tail -f';
      }

      if (options.level) {
        command += ` | grep -i "${options.level}"`;
      }

      // Add your log file path
      const logFile = './logs/app.log';
      if (fs.existsSync(logFile)) {
        execSync(`${command} ${logFile}`, { stdio: 'inherit' });
      } else {
        console.log(`ℹ️  No log file found at ${logFile}`);
      }
    } catch (error) {
      console.error(`❌ Failed to read logs: ${error.message}`);
      process.exit(1);
    }
  });

// Clean command
program
  .command('clean')
  .description('Clean up temporary files and old backups')
  .option('--backups', 'Clean old backups (keep last 3)')
  .option('--logs', 'Clean old logs (keep last 7 days)')
  .option('--cache', 'Clean build cache and node_modules')
  .action((options) => {
    console.log('🧹 Cleaning up...');

    try {
      if (options.backups) {
        console.log('📦 Cleaning old backups...');
        const backups = fs.readdirSync('./backups')
          .sort()
          .slice(0, -3);

        backups.forEach(backup => {
          fs.rmSync(path.join('./backups', backup), { recursive: true });
          console.log(`  Removed: ${backup}`);
        });
      }

      if (options.logs) {
        console.log('📋 Cleaning old logs...');
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

        if (fs.existsSync('./logs')) {
          const logs = fs.readdirSync('./logs');
          logs.forEach(log => {
            const logPath = path.join('./logs', log);
            const stats = fs.statSync(logPath);
            if (stats.mtimeMs < sevenDaysAgo) {
              fs.rmSync(logPath);
              console.log(`  Removed: ${log}`);
            }
          });
        }
      }

      if (options.cache) {
        console.log('🗑️  Cleaning cache...');
        execSync('rm -rf node_modules .next dist build', { stdio: 'inherit' });
        console.log('  Cache cleared');
      }

      console.log('✅ Cleanup complete');
    } catch (error) {
      console.error(`❌ Cleanup failed: ${error.message}`);
      process.exit(1);
    }
  });

// Init command
program
  .command('init')
  .description('Initialize DevOps CLI in current project')
  .action(() => {
    console.log('🔧 Initializing DevOps CLI...');

    const packageJsonPath = path.join(process.cwd(), 'package.json');

    try {
      let packageJson = {};
      if (fs.existsSync(packageJsonPath)) {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      }

      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts.backup = 'devops backup ./';
      packageJson.scripts.deploy = 'devops deploy';
      packageJson.scripts.monitor = 'devops monitor';
      packageJson.scripts.logs = 'devops logs';
      packageJson.scripts.clean = 'devops clean --backups --logs';

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Added npm scripts to package.json');
      console.log('📝 Run: npm run backup | npm run deploy | npm run monitor');
    } catch (error) {
      console.error(`❌ Initialization failed: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
