#!/bin/bash
cd ./client && 
npm i &&
# npm run test&&
npm run build && 
cp -a ./build/. ../public &&
cd ../ && 
npm i