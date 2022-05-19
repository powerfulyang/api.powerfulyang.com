#!/usr/bin/env bash
ssh -L 9200:localhost:9200 -L 56782:localhost:56782 \
 -L 58212:localhost:58212 -L 58211:localhost:58211 -NC dev
