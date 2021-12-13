#!/bin/bash
# from https://gist.github.com/rzane/6ef5d43c6d97db430daeebe75aff0d0d

if [ "$#" -lt 1 ]; then
  echo "Usage: wait-socket [socket_name] [timeout(optional)]"
  exit 1
fi

socket_name="$1"
timeout="${2:-0}"
waited=0
delay=1

function try () {
  if type gtimeout > /dev/null 2>&1; then
    gtimeout 1 bash -c "$1"
  else
    timeout 1 bash -c "$1"
  fi
}

until [ -e "/shared/sockets/$socket_name" ]; do
  if [ "$timeout" -gt 0 ] && [ "$waited" -ge "$timeout" ]; then
    echo "Failed to connect to socket $socket_name after ${waited}s. Giving up."
    exit 1
  fi

  echo "Waiting for socket $socket_name... ${waited}s"
  sleep "$delay"
  waited=$(($waited + $delay))
done

echo "Socket $socket_name is available after ${waited}s"
