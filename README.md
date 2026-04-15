# DevOps CLI ⚡

> A powerful CLI tool for common development operations - backup, deploy, monitor, and more.

**Author:** Cherie (smartearners)  
**License:** MIT

## Features

- 📦 **Backup** - Create compressed backups of any directory
- 🚀 **Deploy** - Automated deployment with pre-flight checks
- 👀 **Monitor** - Real-time application health monitoring
- 📋 **Logs** - View and filter application logs
- 🧹 **Clean** - Clean up old backups, logs, and cache
- 🔧 **Init** - Quick setup for new projects

## Installation

```bash
# Clone the repository
git clone https://github.com/smartearners/automate.git
cd automate

# Install dependencies
npm install

# Link globally (optional)
npm link
```

## Usage

### Backup

Create a backup of your project:

```bash
# Basic backup
devops backup ./my-project

# Compressed backup
devops backup ./my-project --compress

# Custom destination
devops backup ./my-project --dest /backups --name my-backup
```

### Deploy

Deploy your application:

```bash
# Deploy to production
devops deploy

# Deploy to staging
devops deploy --env staging

# Deploy specific branch
devops deploy --branch develop

# Skip tests (not recommended)
devops deploy --skip-tests
```

### Monitor

Monitor application health:

```bash
# Monitor every 60 seconds (default)
devops monitor --url https://myapp.com

# Custom interval
devops monitor --url https://myapp.com --interval 30
```

### Logs

View application logs:

```bash
# View last 100 lines
devops logs

# Follow logs in real-time
devops logs --follow

# Filter by log level
devops logs --level error

# Combine options
devops logs --follow --level warn
```

### Clean

Clean up old files:

```bash
# Clean old backups (keep last 3)
devops clean --backups

# Clean old logs (keep last 7 days)
devops clean --logs

# Clean build cache
devops clean --cache

# Clean everything
devops clean --backups --logs --cache
```

### Init

Initialize in your project:

```bash
devops init
```

This adds convenient npm scripts to your `package.json`:

```bash
npm run backup    # Backup current directory
npm run deploy    # Deploy to production
npm run monitor   # Start monitoring
npm run logs      # View logs
npm run clean     # Clean up old files
```

## NPM Scripts

If you've run `devops init`, you can use these shortcuts:

```bash
npm run backup
npm run deploy
npm run monitor
npm run logs
npm run clean
```

## Examples

### Daily Backup Routine

```bash
# Create compressed backup
devops backup ./ --compress --dest ./backups

# Clean old backups (keep last 3)
devops clean --backups
```

### Deployment Workflow

```bash
# Run tests, build, and deploy
devops deploy --env production

# Monitor after deployment
devops monitor --url https://myapp.com --interval 30
```

### Log Analysis

```bash
# View error logs
devops logs --level error

# Follow warning logs
devops logs --follow --level warn
```

## Configuration

The CLI works out of the box, but you can customize:

- **Backup destination:** Use `--dest` flag
- **Monitoring interval:** Use `--interval` flag
- **Log file path:** Edit the `logs` command in `cli.js`
- **Deployment commands:** Edit the `deploy` command in `cli.js`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

- 📧 Email: cherie@smartearners
- 🐛 Issues: [GitHub Issues](https://github.com/smartearners/automate/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/smartearners/automate/discussions)

## Sponsor

If you find this tool useful, consider sponsoring me on GitHub:

[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-green)](https://github.com/sponsors/smartearners)

## License

MIT © [Cherie](https://github.com/smartearners)

---

Made with ⚡ by [Cherie](https://github.com/smartearners)
