#!/bin/bash

echo 'Starting ninjabot'

echo 'Deleting dist folder'
rm -r dist

echo 'Typescript compiling'
npx tsc

echo 'Starting node'
node .