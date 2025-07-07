# Contributing to MediCare

Thank you for your interest in contributing to MediCare! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:
- Be respectful and inclusive
- Focus on constructive feedback
- Help create a positive environment for all contributors
- Remember that this is a healthcare-related application that affects real people

## Medical Disclaimer

**IMPORTANT**: When contributing to MediCare, always remember that this is a healthcare-related application. All contributions must:
- Include appropriate medical disclaimers
- Not provide specific medical advice
- Encourage users to consult healthcare providers
- Maintain the highest standards of accuracy and safety

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/medicare-web-app.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Test thoroughly
7. Commit with descriptive messages
8. Push to your fork
9. Submit a pull request

## Development Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

## Coding Standards

### JavaScript
- Use ES6+ features
- Follow existing code style
- Add JSDoc comments for functions
- Use meaningful variable names
- Handle errors appropriately

### CSS
- Use CSS custom properties (variables)
- Follow mobile-first responsive design
- Maintain accessibility standards
- Keep medical/professional styling theme

### HTML
- Use semantic HTML5 elements
- Ensure accessibility compliance
- Include appropriate ARIA labels
- Test with screen readers

## Testing Guidelines

### Manual Testing Checklist
- [ ] Medicine CRUD operations work correctly
- [ ] Notifications display properly
- [ ] Dashboard statistics are accurate
- [ ] AI assistant responds appropriately
- [ ] Responsive design works on all devices
- [ ] PWA installation works
- [ ] Offline functionality works

### Browser Testing
Test on:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Pull Request Process

1. **Create descriptive title**: Use format like "Add feature: medicine interaction checker"
2. **Provide detailed description**: Explain what changes were made and why
3. **Include screenshots**: For UI changes, include before/after screenshots
4. **Update documentation**: Update README.md if needed
5. **Test thoroughly**: Ensure all functionality works as expected
6. **Medical review**: For health-related features, indicate if medical review is needed

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] Cross-browser testing completed
- [ ] Mobile testing completed

## Medical Considerations
- [ ] Includes appropriate medical disclaimers
- [ ] Does not provide specific medical advice
- [ ] Encourages professional consultation

## Screenshots (if applicable)
Add screenshots here

## Additional Notes
Any additional information
```

## Feature Requests

When submitting feature requests:
1. Check existing issues first
2. Use the feature request template
3. Provide clear use cases
4. Consider medical/safety implications
5. Include mockups if applicable

## Bug Reports

When reporting bugs:
1. Use the bug report template
2. Provide clear reproduction steps
3. Include browser/device information
4. Add screenshots if helpful
5. Specify severity level

## Documentation

- Update README.md for new features
- Add JSDoc comments for new functions
- Update API documentation for new endpoints
- Include examples in documentation

## Security

- Report security issues privately via email
- Never commit sensitive information (API keys, passwords)
- Follow security best practices
- Consider healthcare data privacy (HIPAA considerations)

## Medical and Legal Considerations

### Medical Disclaimers
All healthcare-related features must include:
- Clear disclaimers about not replacing medical advice
- Encouragement to consult healthcare providers
- Warnings about emergency situations

### Legal Compliance
- Ensure compliance with healthcare regulations
- Respect user privacy and data protection
- Follow accessibility guidelines (WCAG)
- Consider international healthcare standards

## Review Process

1. **Automated checks**: Code style, basic functionality
2. **Peer review**: Code quality, functionality, best practices
3. **Medical review**: For health-related features (if needed)
4. **Final review**: Maintainer approval

## Recognition

Contributors will be:
- Listed in the README.md contributors section
- Mentioned in release notes for significant contributions
- Invited to join the core team for consistent contributors

## Questions?

- Open an issue for general questions
- Email maintainers for private questions
- Join our community discussions

## Development Guidelines

### Database Changes
- Always include migration scripts
- Test with existing data
- Document schema changes
- Consider backward compatibility

### API Changes
- Maintain backward compatibility when possible
- Version new API endpoints
- Update documentation
- Test with existing clients

### UI/UX Changes
- Follow existing design patterns
- Maintain accessibility
- Test responsive design
- Consider user experience flow

Thank you for contributing to MediCare and helping improve medication management for everyone! 💊❤️