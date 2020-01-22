#!/bin/bash
for f in $(cd ./src && ls *.mjs)
do
  npx terser --compress --mangle --comments /@license/ --ecma 8 --module --output ./dist/"$f" -- "./src/"$f
done

for f in $(cd ./src && ls *.js)
do
  npx terser --compress --mangle --comments /@license/ --ecma 8 --module --output ./dist/"$f" -- "./src/"$f
done
