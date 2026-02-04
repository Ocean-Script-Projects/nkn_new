# Исправление Tailwind CSS

Выполните следующие команды для исправления:

```bash
# Удалите node_modules и lock файл
rm -rf node_modules package-lock.json

# Установите зависимости заново
npm install --legacy-peer-deps
```

После этого перезапустите dev сервер:

```bash
npm run dev
```
