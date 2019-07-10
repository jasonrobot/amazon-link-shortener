#!/usr/bin/env bash

zip -FS -r AmazonLinkShortener.zip * -i "popup/*" -i manifest.json -i "icons/*" -i LICENSE -x "*.xcf"

