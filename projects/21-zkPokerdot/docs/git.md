```
git remote add icer git@github.com:wizicer/zkPokerdot.git
git subtree add --prefix projects/21-zkPokerdot icer main --squash
git fetch icer main
git subtree pull --prefix projects/21-zkPokerdot icer main --squash
```