# Mortality - Raycast Extension

A comprehensive mortality awareness toolkit for Raycast that helps you visualize and track the passage of time with precision and meaning.

## Features

### 🌍 Global Age Demographics
- See where you stand globally by age
- Visual bar chart showing your position among world population
- Statistics on how many people are younger/older than you
- Age perspective insights and demographic context

### 📅 Years Lived
- Precise age tracking in years with 9 decimal places
- Visual grid of colored squares (one per year)
- Customizable life expectancy (50-120 years)
- Real-time updates every 100ms
- Progress statistics and percentages

### 📆 Months Lived  
- Precise age tracking in months
- Visual grid of 948 squares (79 years × 12 months)
- Monthly progress with detailed statistics
- Customizable life expectancy
- Real-time updates every 100ms

### 💭 Motivational Quotes
- Daily memento mori and motivational messages
- 25+ philosophical quotes from Marcus Aurelius, Seneca, Steve Jobs, and others
- 10+ motivational messages about time and purpose
- Daily consistent quotes with random option
- Reflection prompts and actionable challenges

## Visual Design

### Minimalistic Progress Bars
Each command shows a clean progress representation in the Raycast command list:
- **Years/Months**: `■■■■■□□□□□ 54%` with completion percentage
- **Demographics**: `■■■■●□□□·· Age 33` showing global position

### Color-Coded Squares
- 🟦 **Blue**: Complete periods (100%)
- 🟪 **Purple**: 75%+ completed (colorblind-friendly)
- 🟩 **Green**: 50%+ completed
- 🟨 **Yellow**: 25%+ completed
- 🟧 **Orange**: Just started
- ⬜ **White**: Future periods

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start development mode
4. Open Raycast and the commands will be available

## Commands

- **Global Age Demographics** - Age comparison with world population
- **Years Lived** - Yearly precision life tracker  
- **Months Lived** - Monthly precision life tracker
- **Motivational Quotes** - Daily inspiration and memento mori

## Customization

### Life Expectancy Settings
Adjust the average lifespan (default: 79 years) to reflect:
- Personal health expectations
- Cultural/regional life expectancy
- Family history considerations

**Common Life Expectancies:**
- Japan: 84 years
- Switzerland: 83 years
- Australia/Canada: 82 years
- UK: 81 years
- USA: 78 years
- Global average: 73 years

## Development

### Scripts
```bash
npm run dev          # Start development mode
npm run build        # Build for production
npm run test         # Run test suite
npm run test:coverage # Run tests with coverage
npm run lint         # Check code style
npm run lint:fix     # Fix linting issues
```

### Testing
- Comprehensive test coverage for all utilities
- Jest with TypeScript support
- Mocked Raycast API for component testing
- Coverage reporting with HTML output

### Code Quality
- ESLint with Raycast configuration
- TypeScript strict mode
- Automated testing pipeline
- Git hooks for pre-commit validation

## Philosophy

This extension embodies the ancient philosophical concept of "memento mori" - remember you must die. By visualizing the finite nature of time, it encourages:

- **Mindful living** - Making conscious choices about time
- **Priority clarity** - Focusing on what truly matters
- **Gratitude** - Appreciating each moment and day
- **Action** - Taking steps toward meaningful goals
- **Perspective** - Understanding your place in the human timeline

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Ensure all tests pass: `npm test`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Inspired by Stoic philosophy and memento mori tradition
- Built for the Raycast ecosystem
- Quotes from Marcus Aurelius, Seneca, Viktor Frankl, Steve Jobs, and others
- UN World Population data for demographic calculations