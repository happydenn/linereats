#!/bin/sh
export FIREBASE_AUTH_EMULATOR_HOST="localhost:9099"
firebase emulators:start --only auth,firestore --import=./_data --export-on-exit
