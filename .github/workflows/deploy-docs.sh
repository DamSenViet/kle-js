#!/bin/bash

set -e

cd "${GITHUB_WORKSPACE}"

echo "DEPENDENCIES: INSTALLING..."
npm i
echo "DEPENDENCIES: COMPLETE"

echo "TESTS: TESTING..."
npm run test:esm
echo "TESTS: COMPLETE"

echo "BUILD: BUILDING..."
npm run build:docs
echo "BUILD: COMPLETE"

# make new repo at build directory
# have new repo overwrite-gh-pages
cd docs

echo "GIT: CONFIGURING..."
git init
git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
echo "GIT: CONFIGURED"

echo "GIT: COMMITTING..."
git add .
git commit -m "Auto deploy from GitHub Actions"
echo "GIT: COMITTED"

echo "GIT: PUSHING..."
git push -f "https://${ACCESS_TOKEN}@github.com/${GITHUB_REPOSITORY}.git" master:gh-pages
echo "GIT: PUSHED"