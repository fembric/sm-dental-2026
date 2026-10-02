# Публикация тестового сайта

Папка `sm-dental-github` подготовлена для GitHub с новой локальной Git-историей, без настроек и истории прежнего хостинга. Исходный проект `sm-dental` сохранён отдельно.

1. Войдите в GitHub и создайте новый **Public** репозиторий **sm-dental-test**. Не добавляйте README, .gitignore и лицензию через форму: репозиторий должен быть пустым.
2. Откройте PowerShell и выполните команды, заменив YOUR_LOGIN на свой логин:

```powershell
cd 'C:\Users\vacto\Documents\Codex\2026-10-02\new-chat-2\outputs\sm-dental-github'
git remote add origin https://github.com/YOUR_LOGIN/sm-dental-test.git
git push -u origin main
```

Если Git попросит вход, завершите авторизацию в браузере через Git Credential Manager. Если менеджера входа нет, установите Git for Windows с Git Credential Manager и повторите push. Не помещайте токен в адрес репозитория, файлы или чат. Обычный пароль GitHub для push не подходит.

3. В репозитории откройте **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Откройте **Actions → Publish GitHub Pages → Run workflow → main → Run workflow**. Первый автоматический запуск после push может завершиться ошибкой, если Pages ещё не включён; после шага 3 запустите его повторно.
5. Дождитесь зелёного результата. Ссылка появится в Settings → Pages и в задании deploy. Ожидаемый адрес: `https://YOUR_LOGIN.github.io/sm-dental-test/`.

Следующие push в main автоматически публикуют новую сборку dist. Дополнительные секреты не нужны. Поле Custom domain оставьте пустым, DNS не меняйте.

## Локальная работа

Нужен Node.js 22 LTS с npm. Внешних зависимостей нет, npm install не требуется.

```powershell
npm run build
npm run check
npm start
```

Адрес: http://127.0.0.1:4286/. Для проверки адреса репозитория задайте `$env:BASE_PATH='/sm-dental-test'` перед сборкой и откройте http://127.0.0.1:4286/sm-dental-test/. Для возврата к корню задайте `$env:BASE_PATH=''` и пересоберите сайт. После смены сборки перезапустите сервер.

Исходные изображения, стили, скрипты и документы находятся в public/. Не редактируйте dist: папка пересоздаётся при сборке и исключена из Git. BASE_PATH в Actions определяется автоматически по настройкам Pages. Отдельный сервер приложений и база данных не нужны. Яндекс Карты требуют интернета.

GitHub Pages публичен. robots.txt запрещает индексацию, но не ограничивает доступ. Дизайн и содержимое сохранены. Проверены сборки в корне и под /sm-dental-test/: 21 HTML-документ, 580 ссылок, 52 HTTP-адреса и ответ 404. Удалённый workflow пока не запускался: требуется GitHub-репозиторий пользователя.
