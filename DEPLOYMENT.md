# Deployment Guide for GitHub Pages

## Setup Instructions

1. **Create GitHub Repository**
   - Create a new repository on GitHub
   - Push your code to the repository

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Under "Source", select "GitHub Actions"
   - The workflow will automatically deploy on push to `main` branch

3. **Configure basePath (if project repository)**
   - If your repository name is not `username.github.io`, you need to set the basePath
   - Open `next.config.ts`
   - Uncomment the `basePath` line and set it to your repository name:
     ```typescript
     basePath: '/your-repository-name',
     ```
   - Commit and push the changes

4. **Build and Deploy**
   - Push to `main` branch
   - GitHub Actions will automatically build and deploy
   - Your site will be available at:
     - User site: `https://username.github.io`
     - Project site: `https://username.github.io/repository-name`

## Manual Build

To test the build locally:

```bash
npm run build
```

The static files will be in the `out` directory.

## Troubleshooting

- If images don't load, check that `basePath` is correctly set
- Make sure `output: 'export'` is set in `next.config.ts`
- Check GitHub Actions logs if deployment fails
