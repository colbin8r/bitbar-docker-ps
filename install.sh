#!/usr/bin/env bash

# <bitbar.title>Docker PS</bitbar.title>
# <bitbar.version>1.2.0</bitbar.version>
# <bitbar.author>Colby Rogness</bitbar.author>
# <bitbar.author.github>colbin8r</bitbar.author.github>
# <bitbar.desc>Show running Docker containers in your status bar.</bitbar.desc>
# <bitbar.image>https://raw.githubusercontent.com/colbin8r/bitbar-docker-ps/master/screenshot.png</bitbar.image>
# <bitbar.dependencies>node,docker</bitbar.dependencies>
# <bitbar.abouturl>https://github.com/colbin8r/bitbar-docker-ps</bitbar.abouturl>

INSTALLER_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
INSTALLER_PATH="$INSTALLER_DIR/$(basename $0)"

# Check that node is available
if ! [ -x "$(command -v node)" ]; then
	echo "node was not found!"
	exit 1
# Check that npm is available
elif ! [ "$(command -v npm)" ]; then
	echo "npm was not found!"
	exit 1

elif ! [ "$(command -v docker)" ]; then
	echo "docker was not found!"
	exit 1
fi

# Go to the BitBar plugins directory
cd "$(defaults read com.matryer.BitBar pluginsDirectory)"

if [ -d "bitbar-docker-ps" ]; then
	# If already installed, check for version updates
	cd bitbar-docker-ps
	echo "Updating bitbar-docker-ps..."
	git pull origin master --quiet
	echo "Updated successfully."
else
	# If not installed, clone the repository
	echo "Downloading bitbar-docker-ps..."
	git clone https://github.com/colbin8r/bitbar-docker-ps --quiet
	echo "Downloaded successfully."
	cd bitbar-docker-ps
fi

# Install node dependencies
echo "Installing npm dependencies..."
npm install &>/dev/null
echo "Dependencies installed."

# Create the symlink if it doesn't exist
cd ..
if ! [ -L "./dockerps.10s.js" ]; then
	echo "Linking..."
	ln -s bitbar-docker-ps/dockerps.10s.js
	echo "Linked."
fi

# Delete this script!
echo "Deleting installer..."
# rm -- "$INSTALLER_PATH"
echo "Installer deleted."
