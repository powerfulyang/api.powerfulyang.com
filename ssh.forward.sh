#!/usr/bin/env bash
ssh \
  -L 9200:localhost:9200   -L 56782:localhost:56782 \
  -L 58212:localhost:58212 -L 58211:localhost:58211 \
  -L 39200:localhost:39200 -L 35672:localhost:35672 \
  -L 36379:localhost:36379 -L 5432:localhost:5432 \
  -NC dev
