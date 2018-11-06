#!/bin/bash 告诉系统要用这个解析器

# 确保脚本抛出遇到的错误
set -e

# 判断语句
str=$1

if [ ${#str} -ge 1 ];then
info=$1
else
info="fix"
fi


# 执行 git 命令 -am 后面用双引号
git add -A
git commit -am "$info"
git push

echo 'git push success...'








  