#!/bin/bash

dir=`pwd`
deploy_dir="/Users/carlo/dev/heroku/hashstrat"

echo "build project"
npm run build

retVal=$?
if [ $retVal -ne 0 ]; then
    echo "exiting.."
    exit $retVal
fi


rm -rf $deploy_dir/web/*
cp -R  $dir/build/* $deploy_dir/web/

mv $deploy_dir/web/index.html $deploy_dir/web/home.html


cd $deploy_dir
git restore ./web/app.json
git restore ./web/index.php
git add .
git commit -m "Some changes"
git push heroku main

cd $dir

