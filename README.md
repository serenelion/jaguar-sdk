# 🐆 Jaguar Monorepo

**The world's first self-evolving AI development platform**

A unified monorepo combining the Jaguar SDK (Next.js AI platform) with AI Open Agents (OpenWebUI + Tool Server) for complete AI agent collaboration and self-development capabilities.

## 🚀 Quick Start

### Prerequisites
- **Docker Desktop** - [Install Docker](https://docs.docker.com/get-docker/)
- **Git** - For cloning the repository
- **API Keys** - OpenRouter API key for AI models

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd jaguar-monorepo

# Configure environment
cp .env.example .env
# Edit .env with your API keys (see Configuration section)
```

### 2. Start All Services
```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

### 3. Access Services
- **Jaguar SDK**: http://localhost:3000 (AI Agent Platform)
- **OpenWebUI**: http://localhost:3002 (AI Chat Interface)
- **Tool Server**: http://localhost:8000/docs (GitHub Integration API)

## 🏗️ Architecture

### Local Development
```
localhost:3000 → Jaguar SDK (Next.js AI Platform)
localhost:3002 → OpenWebUI (AI Chat Interface)
localhost:8000 → Tool Server (GitHub Integration)
localhost:6379 → Redis (Caching)
```

### Production Deployment
```
jaguar-sdk.thespatialnetwork.net → Jaguar SDK
ai.thespatialnetwork.net → OpenWebUI
Internal: Tool Server + Redis + GitHub Integration
```

## ⚙️ Configuration

### Required Environment Variables
```bash
# Essential for AI functionality
OPEN_ROUTER_API_KEY=your-open-router-api-key-here
TOOL_SERVER_API_KEY=keepthissecret

# GitHub integration (for self-development)
GITHUB_TOKEN=ghp_your_github_personal_access_token_here

# Auto-configured for Docker (don't change)
JAGUAR_BASE_URL=http://localhost:3002
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=jaguar-local-dev-secret-32-chars-minimum-length-required
```

### Getting API Keys

#### OpenRouter API Key
1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up and get your API key
3. Add to `.env`: `OPEN_ROUTER_API_KEY=your-key-here`

#### GitHub Token (Optional - for self-development features)
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate token with `repo` and `workflow` permissions
3. Add to `.env`: `GITHUB_TOKEN=ghp_your-token-here`

## 🧪 Testing & Validation

### Validate Setup
```bash
# Run validation script
python3 validate-docker-setup.py

# Expected output: ✅ All validations passed!
```

### Test Services
```bash
# Test each service endpoint
curl http://localhost:3000      # Jaguar SDK
curl http://localhost:3002      # OpenWebUI
curl http://localhost:8000/docs # Tool Server API

# Check service status
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs jaguar-sdk
docker-compose logs open-web-ui
docker-compose logs tool-server
```

## 🎯 Features

### Jaguar SDK (Port 3000)
- **AI Agent Collaboration Platform**
- **Multi-agent chat interface**
- **Authentication and user management**
- **Integration with OpenWebUI for AI processing**

### OpenWebUI (Port 3002)
- **Local AI model access**
- **Chat interface for AI interactions**
- **Tool integration for GitHub operations**
- **Support for multiple AI models**

### Tool Server (Port 8000)
- **GitHub API integration**
- **Repository analysis endpoints**
- **Issue creation automation**
- **Self-development capabilities**

### Self-Development Capabilities
1. **AI agents can read their own codebase**
2. **AI agents can create GitHub issues for improvements**
3. **AI agents can trigger automated workflows**
4. **Continuous learning and improvement**

## 🔧 Development

### Making Changes
```bash
# Rebuild after code changes
docker-compose up --build

# Rebuild specific service
docker-compose build jaguar-sdk
docker-compose up -d jaguar-sdk
```

### Environment Updates
```bash
# Edit environment variables
nano .env

# Restart services to apply changes
docker-compose down
docker-compose up -d
```

### Database Operations
```bash
# Access Jaguar SDK container
docker-compose exec jaguar-sdk sh

# Run database migrations
npm run db:migrate
```

## 🚀 Production Deployment

### GitHub Actions (Automated)
1. **Configure GitHub secrets** (see [GitHub Actions Setup](GITHUB-ACTIONS-SETUP.md))
2. **Push to main branch** to trigger deployment
3. **Monitor deployment** in GitHub Actions tab

### Manual Deployment
```bash
# Use production configuration
docker-compose -f docker-compose-production.yml up --build -d
```

## 📚 Documentation

- **[Docker Setup Testing](DOCKER-SETUP-TESTING.md)** - Complete Docker testing guide
- **[GitHub Actions Setup](GITHUB-ACTIONS-SETUP.md)** - Automated deployment configuration
- **[Complete Setup Summary](COMPLETE-SETUP-SUMMARY.md)** - Full project overview

## 🔍 Troubleshooting

### Common Issues

#### "Cannot connect to Docker daemon"
```bash
# Start Docker Desktop
open -a Docker  # macOS
# Or start Docker Desktop from Applications
```

#### "Port already in use"
```bash
# Find and kill processes using ports
lsof -i :3000 && kill -9 <PID>
lsof -i :3002 && kill -9 <PID>
lsof -i :8000 && kill -9 <PID>
```

#### "Service not responding"
```bash
# Check service logs
docker-compose logs <service-name>

# Restart specific service
docker-compose restart <service-name>
```

#### "Build failed"
```bash
# Clean Docker cache and rebuild
docker system prune -a
docker-compose build --no-cache
```

### Getting Help
- Check service logs: `docker-compose logs`
- Validate setup: `python3 validate-docker-setup.py`
- Review documentation in the `/docs` folder

## 🎉 Success Metrics

When everything is working correctly:

- ✅ **All services start** without errors
- ✅ **Jaguar SDK** loads at http://localhost:3000
- ✅ **OpenWebUI** accessible at http://localhost:3002
- ✅ **Tool Server API** docs at http://localhost:8000/docs
- ✅ **Services communicate** internally via Docker network
- ✅ **AI workflow** functions end-to-end

## 🌟 What Makes This Special

### Revolutionary Capabilities:
1. **Self-Evolving AI Platform** - AI agents improve their own code
2. **Complete Local Development** - Everything runs in Docker
3. **Production-Ready Deployment** - Automated CI/CD pipeline
4. **Multi-Agent Collaboration** - Agents work together on complex tasks
5. **GitHub Integration** - Direct code analysis and improvement

### Technical Excellence:
- **Monorepo Architecture** with pnpm workspaces
- **Docker Containerization** for consistency
- **Traefik Routing** for production domains
- **GitHub Actions** for automated deployment
- **TypeScript/Python** integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `docker-compose up --build`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Ready to revolutionize AI development!** 🐆

Start Docker Desktop and run `docker-compose up --build` to begin your journey with the world's first self-evolving AI platform.
