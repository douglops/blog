#!/bin/sh
set -e

version_tag="latest"
if [ -n "$ZOLA_VERSION" ]; then
  version_tag="tags/v${ZOLA_VERSION}"
fi

libc="${ZOLA_LIBC:-musl}"

download_url=$(curl -fsSL "https://api.github.com/repos/getzola/zola/releases/${version_tag}" \
  | grep -oP "\"browser_download_url\": ?\"\K(.+linux-${libc}\.tar\.gz)")

curl -fsSL "$download_url" | tar -xz
