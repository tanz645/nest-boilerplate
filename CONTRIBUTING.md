# Contributing to NestJS Boilerplate

Thank you for your interest in contributing to the NestJS Boilerplate! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/nest-boilerplate.git
   cd nest-boilerplate
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/originalowner/nest-boilerplate.git
   ```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment file:
   ```bash
   cp env.example .env
   ```

3. Update the `.env` file with your configuration:
   - Set up MongoDB connection
   - Configure JWT secret
   - Set up Brevo email service (optional for development)

4. Start the development server:
   ```bash
   npm run start:dev
   ```

## Making Changes

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/your-bugfix-name
   ```

2. Make your changes following our [coding standards](#coding-standards)

3. Write or update tests as needed

4. Run the test suite:
   ```bash
   npm run test
   npm run test:e2e
   ```

5. Run linting:
   ```bash
   npm run lint
   ```

6. Format your code:
   ```bash
   npm run format
   ```

## Pull Request Process

1. Ensure your branch is up to date with the main branch:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. Push your changes to your fork:
   ```bash
   git push origin your-branch
   ```

3. Create a Pull Request on GitHub with:
   - A clear title and description
   - Reference to any related issues
   - Screenshots or examples if applicable
   - Confirmation that tests pass

4. Respond to any feedback or requested changes

## Issue Guidelines

When creating issues, please:

- Use the issue templates when available
- Provide a clear description of the problem or feature request
- Include steps to reproduce for bugs
- Add relevant labels
- Reference related issues or PRs

### Issue Types

- **Bug Report**: Something isn't working as expected
- **Feature Request**: Suggest an idea for this project
- **Documentation**: Improvements or additions to documentation
- **Question**: Ask a question about the project

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Prefer `const` over `let`, avoid `var`

### NestJS Patterns

- Follow NestJS conventions and best practices
- Use dependency injection properly
- Implement proper error handling
- Use DTOs for request/response validation
- Follow the existing module structure

### File Organization

- Keep related files together in modules
- Use barrel exports (`index.ts`) for clean imports
- Follow the existing directory structure:
  ```
  src/
  ├── module-name/
  │   ├── dto/
  │   ├── entities/
  │   ├── transformers/
  │   ├── types/
  │   ├── exceptions/
  │   ├── test/
  │   ├── module.controller.ts
  │   ├── module.service.ts
  │   └── module.module.ts
  ```

### Database

- Use Mongoose schemas with proper validation
- Include timestamps in entities
- Use proper indexing for performance
- Follow the existing entity patterns

## Testing

### Unit Tests

- Write unit tests for services and utilities
- Use Jest testing framework
- Mock external dependencies
- Aim for good test coverage

### Integration Tests

- Write integration tests for controllers
- Test API endpoints with real database
- Use test database for integration tests

### E2E Tests

- Write end-to-end tests for critical user flows
- Test authentication and authorization flows
- Test API responses and error handling

### Running Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Documentation

- Update README.md for significant changes
- Add JSDoc comments for new public APIs
- Update API documentation if endpoints change
- Include examples in documentation

## Security

- Never commit sensitive information (API keys, passwords, etc.)
- Use environment variables for configuration
- Follow security best practices
- Report security vulnerabilities privately

## Questions?

If you have questions about contributing, please:

1. Check existing issues and discussions
2. Create a new issue with the "question" label
3. Join our community discussions

Thank you for contributing to NestJS Boilerplate! 🚀
