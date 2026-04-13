# Как добавить переменные окружения в GitHub

## Для GitHub Actions (в workflow файле)

В вашем проекте переменные окружения уже настроены в файле `.github/workflows/deploy.yml`:

```yaml
- name: Build
  run: npm run build
  env:
    NODE_ENV: production
```

## Для добавления секретов и переменных в настройках репозитория

Если вам нужно добавить секретные переменные (например, API ключи), которые не должны быть видны в коде:

1. **Перейдите в ваш репозиторий на GitHub**
2. **Нажмите на вкладку "Settings"** (Настройки)
3. **В левом меню выберите "Secrets and variables" → "Actions"**
4. **Нажмите "New repository secret"** для секретов или **"New repository variable"** для обычных переменных
5. **Введите имя и значение переменной**
6. **Нажмите "Add secret"** или **"Add variable"**

## Использование в workflow

После добавления переменных, их можно использовать в workflow файле:

```yaml
- name: Build
  run: npm run build
  env:
    NODE_ENV: production
    MY_SECRET: ${{ secrets.MY_SECRET }}
    MY_VARIABLE: ${{ vars.MY_VARIABLE }}
```

## Для вашего проекта

**Вам НЕ нужно добавлять переменные окружения вручную!** 

Код автоматически определяет `basePath` из URL страницы. Это работает так:
- Если URL начинается с `/nkn_new` → используется basePath `/nkn_new`
- Иначе → basePath пустой (для локальной разработки)

Переменная `NODE_ENV: production` уже настроена в workflow файле и используется только для сборки.
