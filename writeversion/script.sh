#! /usr/bin/bash

revision=$(git rev-parse HEAD | cut -c1-8)
branch=$(git rev-parse --abbrev-ref HEAD)
revisionDate=$(git show -s --format=%ci HEAD | cut -c1-16)

conteudo='export const versions = {
  revisionDate: "'$revisionDate'",
  revision: "'$revision'",
  branch: "'$branch'"
};'

echo $conteudo
