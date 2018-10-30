# bitbar-docker-ps

<p align="center">
<img src="/screenshot.png?raw=true" alt="Screenshot of BitBar" align="center" />
</p>

<p align="center">
A plugin for [BitBar](https://getbitbar.com/) to display the running Docker containers.
</p>

---

![GitHub tag (latest SemVer)](https://img.shields.io/github/tag/colbin8r/bitbar-docker-ps.svg)
![GitHub issues](https://img.shields.io/github/issues/colbin8r/bitbar-docker-ps.svg)
![node](https://img.shields.io/node/v/bitbar-docker-ps.svg)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)



## Installation

Requires Docker, for obvious reasons.

Requires Node. So far, only tested with version 10.10.

Go to your BitBar plugin directory:
```sh
$ cd "$(defaults read com.matryer.BitBar pluginsDirectory)"
```

Clone the plugin into your BitBar plugin directory:
```sh
$ git clone https://github.com/colbin8r/bitbar-docker-ps
```

Install dependencies:
```sh
$ cd bitbar-docker-ps
$ npm i
```

Activate the plugin with a symlink:
```
$ cd ..
$ ln -s bitbar-docker-ps/dockerps.10s.js
```

Refresh your BitBar to verify everything works!

### Changing the update interval

By default, the plugin refreshes every 10 seconds. You can always open the dropdown and manually refresh it if you like.

The [update interval is encoded in the name](https://github.com/matryer/bitbar#configure-the-refresh-time) of the file in the BitBar plugins directory. To change it, just change the name of the symlink:

```sh
$ cd "$(defaults read com.matryer.BitBar pluginsDirectory)"
$ mv dockerps.10s.js dockerps.1m.js # Change to 1 minute
```

### Uninstalling

Remove the symlink and plugin folder:
```
$ cd "$(defaults read com.matryer.BitBar pluginsDirectory)"
$ rm dockerps.10s.js
$ rm -rf bitbar-docker-ps
```

## Usage

## Features

- [X] Number of containers running on your Mac status bar
- [X] Container names, image, ID, and uptime
- [X] Exposed ports and their host mapping
- [X] Named volumes and bound volumes
- [X] Logs, inspect, restart, and kill
- [X] Refreshes every 10 seconds
