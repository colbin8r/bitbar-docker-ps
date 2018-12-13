# bitbar-docker-ps

<p align="center">
<img src="/screenshot.png?raw=true" alt="Screenshot of BitBar" align="center" />
</p>

<p align="center">
A plugin for <a href="https://getbitbar.com/">BitBar</a> to display the running Docker containers.
</p>

<p align="center">
	<a href="https://github.com/colbin8r/bitbar-docker-ps/releases"><img src="https://img.shields.io/github/tag/colbin8r/bitbar-docker-ps.svg" alt="GitHub tag (latest SemVer)" /></a>
	<a href="https://github.com/colbin8r/bitbar-docker-ps/issues"><img src="https://img.shields.io/github/issues/colbin8r/bitbar-docker-ps.svg" alt="GitHub issues" /></a>
	<img src="https://img.shields.io/node/v/bitbar-docker-ps.svg" alt="node version" />
	<a href="http://commitizen.github.io/cz-cli/"><img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen friendly" /></a>
</p>

<p align="center">
	<strong><a href="bitbar://openPlugin?src=https://raw.githubusercontent.com/colbin8r/bitbar-docker-ps/master/install.sh
">:sparkles: Install with BitBar</a></strong>
</p>

---

## Features

- [X] Number of containers running on your Mac status bar
- [X] Container names, image, ID, and uptime
- [X] Exposed ports and their host mapping
- [X] Named volumes and bound volumes
- [X] Logs, inspect, restart, and kill
- [X] Refreshes every 10 seconds

## Installation

### Easy Installation

**[:sparkles: Install with BitBar](bitbar://openPlugin?src=https://raw.githubusercontent.com/colbin8r/bitbar-docker-ps/master/install.sh
)**

---

Make sure you have `node`, `npm`, and `docker, then install with the bundled install script:
```sh
$ curl https://raw.githubusercontent.com/colbin8r/bitbar-docker-ps/master/install.sh | bash
```

Don't forget to refresh BitBar to see the plugin immediately.

### Manual Installation

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

## Status Bar Circle

**Solid Green:** `bitbar-docker-ps` connected to Docker on your machine and is listing your running containers! :100:

**Hollow Green Circle:** `bitbar-docker-ps` connected to Docker on your machine, but there aren't any containers running.

**Red Circle:** `bitbar-docker-ps` couldn't connect to Docker on your machine. Open the dropdown to see error information.

## Troubleshooting

**Problems finding `node`**: You may have to monkey-patch `dockerps.10s.js` to point to your node binary. You can find your node binary with `which -a node`. Change the shebang at the top of `dockerps.10s.js` to point to your node binary path.
