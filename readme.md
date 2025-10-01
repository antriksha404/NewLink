# NewLink

**Stop reinventing the wheel. Start building what matters.**

NewLink is a scalable, modular backend framework built for modern microservices. Get authentication, notifications, blockchain integration, and more — all production-ready from day one.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## Why NewLink?

In today's fast-paced development world, teams waste valuable weeks setting up the same repetitive plumbing: authentication, logging, notifications, multi-tenant support. **NewLink eliminates that bottleneck.**

Whether you're a startup racing to launch an MVP or an enterprise standardizing infrastructure across teams, NewLink provides the foundation to go from idea to deployment fast — without sacrificing clean architecture.

## Core Features

### Out-of-the-Box Services

- **Authentication & RBAC** - Secure login, JWT support, and fine-grained role-based access control
- **Notification Service** - Unified interface for email, SMS, and async messaging
- **Blockchain Integration** - Wallet verification, transaction logging, and Web3 primitives
- **Multi-Tenant Architecture** - Native tenant awareness and data isolation for SaaS platforms
- **Centralized Logging** - Structured logging across distributed services
- **Security & Rate Limiting** - Built-in API protection with smart throttling

### Built on a Future-Ready Stack

- **NestJS** - Modular, testable microservices
- **Lerna** - Monorepo management and package modularity
- **TypeScript** - Type-safe development
- **Clean Architecture** - Separation of concerns built-in
- **Docker Ready** - Seamless CI/CD integration
- **Custom CLI** - Rapid scaffolding with consistent conventions

## Quick Start

### Prerequisites

- Node.js (version managed via `.nvmrc`)
- npm or yarn
- nvm (Node Version Manager)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/antriksha404/NewLink.git
   cd NewLink
   ```

2. **Use the correct Node version**

   ```bash
   nvm use
   ```

   This automatically loads the Node version specified in `.nvmrc`

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run start
   ```

### Creating Your First Microservice

Once NewLink is running, you can scaffold a new microservice using the CLI:

1. **Navigate to your project directory**

   ```bash
   cd /path/to/your/projects
   ```

2. **Run the NewLink CLI**

   ```bash
   ccube-newlink
   ```

3. **Answer the interactive prompts**

   The CLI will guide you through project setup:

   ```
   ? Project name: my-awesome-service
   ? Description: A microservice for handling user operations
   ? Select services to include: (Use arrow keys and space to select)

   ◯ Authentication - User auth, JWT, and RBAC
   ◯ Blockchain - Wallet integration and Web3 features
   ◯ Notification - Email, SMS, and messaging
   ```

   **Available Services:**

   - **Authentication** - Complete auth system with JWT, user management, and role-based access control
   - **Blockchain** - Web3 integration, wallet verification, and transaction logging
   - **Notification** - Multi-channel notification system (email, SMS, push)

4. **Start building!**

   Your new microservice is ready with:

   - Pre-configured project structure
   - Selected service modules integrated
   - Development and production configs
   - Docker setup
   - Testing framework
   - API documentation

## Project Structure

```
NewLink/
├── services/
│   ├── authentication/              # Authentication module
│   ├── blockchain/        # Blockchain integration
│   └── notification/      # Notification service
├── package.json           # Root dependencies
├── .nvmrc                 # Node version
└── README.md              # You are here
```


## Who Should Use NewLink?

NewLink is built for teams that value speed without sacrificing quality:

- **Startups** - Bootstrap MVPs and internal tools in days, not weeks
- **Enterprises** - Standardize backend architecture across multiple teams
- **Engineering Managers** - Onboard developers faster with consistent foundations
- **Solution Architects** - Reduce technical debt and fragmentation

If you've ever spent weeks rebuilding the same authentication system or notification service, NewLink was made for you.

## Use Cases

### SaaS Platforms
Multi-tenant architecture built-in. Launch faster with tenant isolation and centralized management.

### Web3 Applications
Blockchain integration ready. Build decentralized apps without wrestling with low-level complexity.

### Enterprise APIs
Standardized microservices across your organization. Consistent patterns, shared services, faster delivery.

### Internal Tools
Rapid prototyping with production-ready foundations. Go from concept to deployment in record time.


### Enhanced Blockchain Features
- Deeper smart contract integrations
- Token-based access control
- Advanced Web3-ready APIs
- Decentralized identity management

## Documentation

For detailed guides and API references:

- [Service Modules](./docs/modules.md)
- [Deployment Guide](./docs/deployment.md)
- [Best Practices](./docs/best-practices.md)

## Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](./CONTRIBUTING.md) for code standards and development workflow.

## Community & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/antriksha404/NewLink/issues)
- **Discussions**: [Ask questions and share ideas](https://github.com/antriksha404/NewLink/discussions)
- **Documentation**: [Read the full docs](./docs)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

Built with modern tools:
- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Lerna](https://lerna.js.org/) - Monorepo management
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

---

**Built for developers who want to focus on what matters: building great products.**

*Stop reinventing. Start shipping.*
```
