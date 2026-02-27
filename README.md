# The 5 Love Languages Quiz

An interactive, bilingual (English/Arabic) quiz to discover your primary love language. Built with React and styled with Apple Human Interface Guidelines.

Based on Dr. Gary Chapman's 5 Love Languages framework.

## Features

- **30 Forced-Choice Questions** -- Mathematically balanced: 10 unique language pairs x 3 questions each, every language appears exactly 12 times
- **Bilingual Support** -- Full English and Arabic with RTL layout switching
- **Apple-Inspired Design** -- Clean typography, SF-style color palette, smooth animations
- **IBM Plex Sans Arabic** -- Professional bilingual font for both EN and AR
- **Rich Results Page** -- SVG donut chart, expandable cards with detailed descriptions, tips, and examples for each love language
- **Confetti Celebration** -- Animated confetti on results reveal
- **Mobile Responsive** -- Works on all screen sizes
- **Auto-Advance** -- Progresses automatically on answer selection with Previous/Back navigation
- **No Dependencies** -- Pure React with inline styles, no CSS framework required

## Love Languages Covered

1. **Words of Affirmation** -- Verbal compliments, encouragement, and appreciation
2. **Quality Time** -- Undivided attention, shared activities, meaningful conversations
3. **Receiving Gifts** -- Thoughtful gifts, symbols of love, visual tokens of affection
4. **Acts of Service** -- Helping with tasks, easing responsibilities, doing things for loved ones
5. **Physical Touch** -- Hugs, holding hands, physical closeness and affection

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- React 18
- Vite 5
- IBM Plex Sans Arabic (Google Fonts)
- SVG for chart rendering
- CSS-in-JS (inline styles)

## Project Structure

```
love-languages-quiz/
├── index.html          # Entry HTML with Google Fonts, OG meta tags
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite build configuration
├── .gitignore          # Git ignore rules
├── README.md           # This file
├── PROGRESS.md         # Development progress log
└── src/
    ├── main.jsx        # React entry point
    └── App.jsx         # Complete quiz application (566 lines)
```

## Scoring Methodology

Each question presents two statements, each representing a different love language. The quiz uses all 10 possible pairs of the 5 languages (C(5,2) = 10), with exactly 3 questions per pair, totaling 30 questions. Each love language appears in exactly 12 questions (paired with each of the other 4 languages, 3 times each: 4 x 3 = 12). This ensures perfectly balanced and unbiased scoring.

## Deployment

The project builds to a static `dist/` folder. Deploy to any static hosting:

- **Vercel**: `vercel --prod`
- **Netlify**: Connect repo or `netlify deploy --prod`
- **GitHub Pages**: Use `vite-plugin-gh-pages` or manual deploy

## License

Personal project. Quiz methodology based on Dr. Gary Chapman's "The 5 Love Languages" framework.
