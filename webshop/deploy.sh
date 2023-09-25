#!/usr/bin/env sh

# сборка
npm run build

# переход в каталог сборки
cd dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:yults/yults.github.io.git master

cd -