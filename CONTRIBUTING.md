# Contributing to htmx-magnify

Thank you for your interest in contributing to htmx-magnify! This guide will help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/htmx-magnify.git
   cd htmx-magnify
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development

### Running the Dev Server

```bash
npm run dev
```

This serves the demo page at `http://localhost:3000` where you can test changes live.

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Linting

```bash
npm run lint
```

### Building

```bash
npm run build
```

## Making Changes

1. Keep changes focused - one feature or fix per PR
2. Write or update tests for any new or changed functionality
3. Ensure all tests pass before submitting
4. Ensure the linter reports no errors
5. Update documentation if you change public-facing behavior

## Code Style

- Use ES modules (`import`/`export`)
- Follow existing code patterns in `src/` and `test/`
- Keep the library zero-dependency and lightweight

## Submitting a Pull Request

1. Push your branch to your fork
2. Open a pull request against the `main` branch
3. Provide a clear description of the change
4. Reference any related issues

## Reporting Issues

- Use the GitHub issue tracker
- Include steps to reproduce the problem
- Include browser/OS information
- Note the htmx version you are using

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
