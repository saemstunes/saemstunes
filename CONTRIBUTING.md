
# Contributing to Saem's Tunes

Thank you for your interest in contributing to Saem's Tunes! We welcome contributions from developers, designers, educators, and musicians.

## How to Contribute

### 🐛 Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/saem/tunes-app/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Device/browser information

### 💡 Suggesting Features

1. Check existing [Issues](https://github.com/saem/tunes-app/issues) and [Discussions](https://github.com/saem/tunes-app/discussions)
2. Create a new issue with:
   - Clear feature description
   - Use case and benefits
   - Possible implementation ideas

### 🔧 Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow our coding standards (see below)
   - Write/update tests if applicable
   - Update documentation if needed
4. **Test your changes**
   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
6. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Development Setup

### Prerequisites
- Node.js v16+
- npm v8+

### Local Setup
```bash
git clone https://github.com/saem/tunes-app.git
cd tunes-app
npm install
npm start
```

### Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Route-level components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── context/       # React context providers
├── integrations/  # External service integrations
└── styles/        # Global styles
```

## Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces/types
- Avoid `any` type unless absolutely necessary

### React
- Use functional components with hooks
- Follow component naming conventions (PascalCase)
- Keep components focused and reusable
- Use proper prop types

### Styling
- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Maintain consistency with existing design system
- Use semantic HTML elements

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Use descriptive variable names
- Add comments for complex logic
- Keep functions small and focused

## Commit Message Format

Follow conventional commit format:
```
type(scope): description

Examples:
feat(auth): add social login options
fix(player): resolve audio playback issue
docs(readme): update installation instructions
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Pull Request Guidelines

### Before Submitting
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No console errors/warnings

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added/updated tests

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Functionality tested
```

## Getting Help

- 📧 Email: saemstunes@gmail.com
- 💬 GitHub Discussions
- 📱 Instagram: [@saemstunes](https://instagram.com/saemstunes)

## Recognition

Contributors will be:
- Listed in our README
- Mentioned in release notes
- Eligible for special community recognition

Thank you for helping make music education accessible to everyone! 🎵
