# Инструкция по деплою на GitHub Pages

## Настройка

1. **Убедитесь, что в `next.config.ts` установлен правильный `basePath`**:
   ```typescript
   basePath: '/nkn_new',
   assetPrefix: '/nkn_new',
   ```

2. **Проверьте, что workflow использует правильную ветку**:
   - В `.github/workflows/deploy.yml` указана ветка `live`
   - Создайте ветку `live` и запушьте изменения:
     ```bash
     git checkout -b live
     git push origin live
     ```

3. **Включите GitHub Pages в настройках репозитория**:
   - Перейдите в Settings → Pages
   - Source: выберите "GitHub Actions"

## Деплой

После настройки, каждый push в ветку `live` автоматически запустит деплой.

Или запустите вручную:
- Перейдите в Actions → Deploy to GitHub Pages → Run workflow

## Проверка

После успешного деплоя сайт будет доступен по адресу:
https://ocean-script-projects.github.io/nkn_new/

## Важно

- Убедитесь, что все пути учитывают `basePath: '/nkn_new'`
- После изменения `basePath` нужно пересобрать проект
- Если сайт не отображается, проверьте консоль браузера на ошибки загрузки ресурсов
