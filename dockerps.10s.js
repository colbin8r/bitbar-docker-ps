#!/usr/bin/env node

// Include BitBar metadata like this at the top of the file
// (commented out, of course):

// <bitbar.title>Docker ps</bitbar.title>
// <bitbar.version>1.0.0</bitbar.version>
// <bitbar.author>Colby Rogness</bitbar.author>
// <bitbar.author.github>colbin8r</bitbar.author.github>
// <bitbar.desc>Show running Docker containers in your status bar.</bitbar.desc>
// <bitbar.image>https://camo.githubusercontent.com/5cec3248a9fc4eede235ead682a65f977577f670/68747470733a2f2f7261772e6769746875622e636f6d2f6d6174727965722f6269746261722f6d61737465722f446f63732f4269744261722d4578616d706c652d4d656e752e706e67</bitbar.image>
// <bitbar.dependencies>node,docker</bitbar.dependencies>
// <bitbar.abouturl>https://github.com/matryer/bitbar-plugins/blob/master/Tutorial/cycle_text_and_detail.sh</bitbar.abouturl>

// Text above --- will be cycled through in the menu bar,
// whereas text underneath will be visible only when you
// open the menu.

const bitbar = require('bitbar')
const Docker = require('dockerode')

const SHOW_ONLY_TOP_X_CONTAINERS = 15
const ID_TRUNC_LENGTH = 12
const VOLUME_TRUNC_LENGTH = 12

// Embed base64 PNG icons
// These are just colored circles made from SVGs
const GREEN_CIRCLE_SOLID = 'GREEN_CIRCLE_SOLID'
const GREEN_CIRCLE_HOLLOW = 'GREEN_CIRCLE_HOLLOW'
const RED_CIRCLE_SOLID = 'RED_CIRCLE_SOLID'
const iconsAqua = {
	GREEN_CIRCLE_SOLID: 'iVBORw0KGgoAAAANSUhEUgAAAA4AAAAWCAMAAADHE10VAAAAUVBMVEUAAAAzzDMr1VUk20kgv0AnzkUm0EIozUAnzkInzEIpzUAnzEApzUEozUEozUEozUAozUEozUEozUInzEEozUEozUEozUEozUEozUEozUH///8FYGyeAAAAGXRSTlMABQYHCBobZ2hpa29xx8jKy83Oz9Hu8vT4UoXYxQAAAAFiS0dEGnVn5DIAAABQSURBVBjTtc45FoAgFENRBOcJHFD+/jdqRA8pKD2+7laJUp/SrfPeNsWjepXYUt0qd3nbDDhKagAdOYMneeS05AT2ZAcaDun8RjwZQjr5VxegtwrJq1lqSwAAAABJRU5ErkJggg==',
	GREEN_CIRCLE_HOLLOW: 'iVBORw0KGgoAAAANSUhEUgAAAA4AAAAWCAMAAADHE10VAAAAe1BMVEUAAAAzzDMr1VUk20kr1UAnxDskyEkwz0At0jwmzEAnzkUm0EInz0EpzEApzUIozUEnzkIozUInzEEnzEAozEAozEIozUEozUAozUEozUEozUInzEEozUEozUEozUEozEEozUEozUEozUEozUEozUEozUEozUEozUH////jvg26AAAAJ3RSTlMABQYHDA0OEBEUGhtPUFFmaGxub3N0yMrLzM7P0NHX2dvu8fLz9Pht+jWqAAAAAWJLR0QovbC1sgAAAGdJREFUGNO1jsUOgEAMRIu7uzvz/3/IwmYTAkfCHNq82pTok5SsnaYmlTk5NS5V9tXrMHiW5Y+oFYYReuMsmwMSlgq4fMlHzuIKjaOOmcUNqsDlPXw7FQsjTRdGjzeI5LDc9zKQ6FcdtTgJdd1VHHEAAAAASUVORK5CYII=',
	RED_CIRCLE_SOLID: 'iVBORw0KGgoAAAANSUhEUgAAAA4AAAAWCAMAAADHE10VAAAAUVBMVEUAAAD/MzP/Kyv/SST/QED/OzH/OS//Oy//OzH/OjH/PDD/PDD/Oy//Oy//OzD/OzD/OzD/OjH/OzD/OzD/OzD/OzD/OzD/OzD/OzD/OzD///+hkPpqAAAAGXRSTlMABQYHCBobZ2hpa29xx8jKy83Oz9Hu8vT4UoXYxQAAAAFiS0dEGnVn5DIAAABQSURBVBjTtc45FoAgFENRBOcJHFD+/jdqRA8pKD2+7laJUp/SrfPeNsWjepXYUt0qd3nbDDhKagAdOYMneeS05AT2ZAcaDun8RjwZQjr5VxegtwrJq1lqSwAAAABJRU5ErkJggg=='
}
const iconsDark = {
	GREEN_CIRCLE_SOLID: 'iVBORw0KGgoAAAANSUhEUgAAAA4AAAAWCAMAAADHE10VAAAAUVBMVEUAAAAzzDMr1VUk20lA30Ax2E4v2Uwy10ox2Ewz2Esy1koz2Ewy1koy10wy10sy10oy10sy10sy10wz2Esy10oy10sy10sy10sy10sy10v////D0rJNAAAAGXRSTlMABQYHCBobZ2hpa29xx8jKy83Oz9Hu8vT4UoXYxQAAAAFiS0dEGnVn5DIAAABQSURBVBjTtc45FoAgFENRBOcJHFD+/jdqRA8pKD2+7laJUp/SrfPeNsWjepXYUt0qd3nbDDhKagAdOYMneeS05AT2ZAcaDun8RjwZQjr5VxegtwrJq1lqSwAAAABJRU5ErkJggg==',
	GREEN_CIRCLE_HOLLOW: 'iVBORw0KGgoAAAANSUhEUgAAAA4AAAAWCAMAAADHE10VAAAAe1BMVEUAAAAzzDMr1VUk20kr1VU72E4320kwz1At0ksz2U0x2E4v2Uww2Eoz1k0y1kwy10sx2Ewy10wz2Eoz2Ewz10sz10sy10sy10oy10sy10sy10wz2Esy10sy10oy10sz10sy10sy10sy10sy10sy10sy10sy10sy10v/////95spAAAAJ3RSTlMABQYHDA0OEBEUGhtPUFFmaGxub3N0yMrLzM7P0NHX2dvu8fLz9Pht+jWqAAAAAWJLR0QovbC1sgAAAGdJREFUGNO1jsUOgEAMRIu7uzvz/3/IwmYTAkfCHNq82pTok5SsnaYmlTk5NS5V9tXrMHiW5Y+oFYYReuMsmwMSlgq4fMlHzuIKjaOOmcUNqsDlPXw7FQsjTRdGjzeI5LDc9zKQ6FcdtTgJdd1VHHEAAAAASUVORK5CYII=',
	RED_CIRCLE_SOLID: 'iVBORw0KGgoAAAANSUhEUgAAAA4AAAAWCAMAAADHE10VAAAAUVBMVEUAAAD/MzP/VSv/SUn/QED/RTv/Qjn/RTn/RTv/RDr/RTn/RTn/Rjv/RTr/RTn/RTr/RTr/RDr/RTr/RTr/Rjv/RTr/RDr/RTn/RTr/RTr///9Wml2BAAAAGXRSTlMABQYHCBobZ2hpa29xx8jKy83Oz9Hu8vT4UoXYxQAAAAFiS0dEGnVn5DIAAABQSURBVBjTtc45FoAgFENRBOcJHFD+/jdqRA8pKD2+7laJUp/SrfPeNsWjepXYUt0qd3nbDDhKagAdOYMneeS05AT2ZAcaDun8RjwZQjr5VxegtwrJq1lqSwAAAABJRU5ErkJggg=='
}

// Apple design guideline colors
// const GREEN = 'GREEN'
const YELLOW = 'YELLOW'
const RED = 'RED'
const BLUE = 'BLUE'
const colorsAqua = {
	// GREEN: '#28CD41',
	YELLOW: '#FFCC00',
	RED: '#FF3B30',
	BLUE: '#007AFF'
}
const colorsDark = {
	// GREEN: '#32D74B',
	YELLOW: '#FFD60A',
	RED: '#FF453A',
	BLUE: '#0A84FF'
}
// Choose the icon and color set based on dark mode or non-dark (aqua) mode
const icons = bitbar.darkMode ? iconsDark : iconsAqua
const colors = bitbar.darkMode ? colorsDark : colorsAqua

// Returns a "Refresh" BitBar element
const refresh = () => {
	return {
		text: ':arrows_counterclockwise:  Refresh',
		refresh: true
	}
}

// Returns a "Kill all" BitBar element
const killAll = numContainers => {
	return {
		text: `Kill ${numContainers ? numContainers : 'all'} containers...`,
		bash: 'docker stop $(docker ps -aq)',
		color: colors[RED]
	}
}

const containerFormatter = container => {
	// Build basic submenu (i.e. container details)
	const submenu = [
		{text: `Image: ${container.Image}`},
		{text: `Command: ${container.Command}`},
		{text: `ID: ${container.Id.substring(0, ID_TRUNC_LENGTH)}`},
		{text: `Status: ${container.Status}`}
	]

	// Handle port mappings (HOST:CONTAINER)
	// PublicPort = HOST
	// PublicPort = CONTAINER
	// Sometimes the client only gives a private port, meaning the public/private are the same
	if (container.Ports.length > 0) {
		submenu.push(bitbar.separator)
	}
	container.Ports.forEach(port => submenu.push(`Port ${port.PublicPort || port.PrivatePort} -> ${port.PrivatePort}`))

	// Handle bind and volume mounts
	if (container.Mounts.length > 0) {
		submenu.push(bitbar.separator)
	}
	container.Mounts.forEach(mount => {
		let text = ''
		let name = ''
		switch (mount.Type) {
			case 'bind':
				text = `Bind ${mount.Source} -> ${mount.Destination}`
				break
			case 'volume':
				name = mount.Name
				// Anonymous volumes have a name of 64 random characters
				if (name.length === 64) {
					name = name.substring(0, VOLUME_TRUNC_LENGTH)
				}
				text = `Volume ${name} -> ${mount.Destination}`
				break
			default:
				text = 'Volume (unknown)'
				break
		}
		submenu.push(text)
	})

	// Handle container actions (kill, restart, inspect, logs)
	const containerAction = ({text, cmd, showWindow = true, refresh = true, color}) => {
		const action = {
			text,
			bash: 'docker',
			param1: cmd,
			param2: container.Id,
			terminal: showWindow,
			refresh
		}
		if (color) {
			action.color = color
		}
		return action
	}
	const actions = [
		{text: 'Logs...', cmd: 'logs', refresh: false},
		{text: 'Inspect...', cmd: 'inspect', refresh: false, color: colors[BLUE]},
		{text: 'Restart...', cmd: 'restart', color: colors[YELLOW]},
		{text: 'Kill...', cmd: 'kill', color: colors[RED]}
	]
	submenu.push(bitbar.separator)
	actions.forEach(action => submenu.push(containerAction(action)))

	// This removes a leading '/' in a container name (it's added by the client)
	// It also combines multiple container names (if there are multiple), separating with ', '
	const names = container.Names.map(name => name.substring(1)).join(', ')

	return {
		text: names,
		submenu
	}
}

async function dockerps() {
	try {
		const docker = new Docker()

		// Get a list of containers from Docker
		// https://github.com/apocas/dockerode
		const containerList = await docker.listContainers()

		// Stop if there's no containers running
		if (containerList.length === 0) {
			bitbar([
				{
					text: '0',
					image: icons[GREEN_CIRCLE_HOLLOW]
				},
				bitbar.separator,
				refresh()
			])
			return
		}

		// Format the containers in a way we can display in BitBar
		let containers = containerList.map(containerFormatter)

		// Truncate the container list (if it's long)
		containers = (containers.length > SHOW_ONLY_TOP_X_CONTAINERS ? containers.slice(0, SHOW_ONLY_TOP_X_CONTAINERS) : containers)

		// Update the BitBar status
		bitbar([
			// Summary shown in the bar
			{
				text: `${containers.length}`,
				image: icons[GREEN_CIRCLE_SOLID]
			},
			// Separator puts the rest in a dropdown
			bitbar.separator,
			// Individual container status in the dropdown
			...containers,
			bitbar.separator,
			killAll(containers.length),
			bitbar.separator,
			refresh()
		])
	} catch (error) {
		// Couldn't get list of containers from Docker
		// Perhaps Docker isn't running?
		bitbar([
			{
				text: ' ',
				image: icons[RED_CIRCLE_SOLID]
			},
			bitbar.separator,
			'Couldn\'t get list of Docker containers.',
			'Maybe Docker isn\'t running?',
			bitbar.separator,
			`Error code: ${error.code}`,
			`Error no.: ${error.errno}`,
			`Docker socket: ${error.address}`,
			bitbar.separator,
			refresh()
		])
	}
}

dockerps()
