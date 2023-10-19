#!/usr/bin/env sh

# остановить публикацию при ошибках
set -e

# сборка
npm run build

# переход в каталог сборки
cd dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:yults/29-java-spring-js-vue-nyultsova.git master:gh-pages
# если вы публикуете по адресу https://<USERNAME>.github.io/<REPO>

cd -