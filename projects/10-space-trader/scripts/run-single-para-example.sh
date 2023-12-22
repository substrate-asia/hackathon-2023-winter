#!/bin/bash

export PATH="$PWD/.bin":$PATH

zombienet spawn --provider native examples/single-para-network.toml
