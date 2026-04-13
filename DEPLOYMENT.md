# Deployment

## DigitalOcean App Platform (Node, полный backend)

Репозиторий по умолчанию собирает **полный Next.js** (без `output: 'export'`). Запуск: `npm run build` → `npm start` (`next start`, порт из `PORT`).

В **runtime** на сервере задайте: `ENABLE_ADMIN_API=true`, `ADMIN_SECRET`, ключи Spaces, `NEXT_PUBLIC_MEDIATHEK_BASE_URL` и остальное по необходимости. Тип компонента: **Web Service** (Node), не «Static Site».

**Заявки с сайта (Telegram):** `TELEGRAM_BOT_TOKEN` (токен бота от [@BotFather](https://t.me/BotFather)), `TELEGRAM_CHAT_ID` (куда слать сообщения: id личного чата или группы; для личного чата напишите боту `/start`, затем получите `chat.id` через `https://api.telegram.org/bot<TOKEN>/getUpdates`). Без этих переменных `POST /api/request` вернёт ошибку конфигурации.

---

## GitHub Pages (ниже — устаревший сценарий со статикой)

Ранее проект мог собираться в `out/`; сейчас в `next.config.ts` **нет** `output: 'export'` по умолчанию. Для чисто статического деплоя понадобится отдельная ветка/конфиг.

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
