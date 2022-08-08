#!/bin/sh

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 profile expo-token"
  exit 1
fi

PROFILE=$1
EXPO_TOKEN=$2
BRANCH=`git rev-parse --abbrev-ref HEAD`
CHANNEL=`cat eas.json|jq -r ".build.$PROFILE.releaseChannel"`
VERSION=`cat app.config.ts|grep const\ version|sed 's/["; =]//g'|sed 's/constversion//'`

echo 
echo "-----------------------------------------------------------------------------------------------"
echo "This will force publish new version of the application."
echo 
echo "    Profile             : $PROFILE"
echo "    Version number      : $VERSION"
echo "    Release Channel     : $CHANNEL"
echo "    Current Git branch  : $BRANCH"
echo "-----------------------------------------------------------------------------------------------"
echo 
read -p "Are you sure? [y/N]:" -n 1 -r
echo 

if [[ $REPLY =~ ^[Yy]$ ]]
then
    docker run --rm -v "${PWD}":"${PWD}" -w "${PWD}" -e EXPO_TOKEN=$EXPO_TOKEN node:16-stretch bash -c "npx eas-cli build --auto-submit --platform all --non-interactive --no-wait --profile=$PROFILE"
else
    echo "Cancelling..."
fi