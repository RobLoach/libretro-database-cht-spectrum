const fs = require('fs')
const path = require('path')
const glob = require('glob')
const rimraf = require('rimraf')
const destinationDirectory = 'libretro-database/cht/Sinclair - ZX Spectrum +3'

// Clear out the Sinclair directory.
rimraf.sync(destinationDirectory + '/*')
if (!fs.existsSync(destinationDirectory)) {
    fs.mkdirSync(destinationDirectory);
}

// Find all the available .pok files.
glob("all-tipshop-pokes/**/*.pok", function (err, files) {
	if (err) {
		throw err
	}
	for (let file of files) {
		processPokFile(file)
	}
})

/**
 * Process the given .pok file into a .cht file.
 */
function processPokFile(inputFile) {
	let contents = fs.readFileSync(inputFile, 'utf8')
	let basename = path.basename(inputFile, '.pok')
	let destination = path.join(destinationDirectory, basename + '.cht')
	let cheats = parsePokFile(contents)
	let chtContents = pokToCht(cheats)
	if (!chtContents) {
		console.log('No cheats found: ' + inputFile)
		return
	}
	fs.writeFileSync(destination, chtContents)
}

/**
 * Parse the contents of a pok file into a cht object.
 *
 * @return An array of objects with name and codes properties.
 */
function parsePokFile(fileContents) {
	let cheats = []
	let currentCheatName = ''
	let currentCodes = []
	for (let line of fileContents.split('\n')) {
		switch (line[0]) {
			case 'N': // New code name
				currentCheatName = line.substring(1)
				break
			case 'M': // Multi-line code
				currentCodes.push(line)
				break
			case 'Z': // Last code index
				currentCodes.push(line)

				// Add the new code to the library.
				cheats.push({
					name: currentCheatName,
					codes: currentCodes
				})

				// Clear the current code.
				currentCheatName = ''
				currentCodes = []
		}
	}

	return cheats
}

/**
 * From a pok object, build the cht contents.
 */
function pokToCht(pok) {
	if (pok.length <= 0) {
		return false
	}

	let output = 'cheats = ' + pok.length + '\n\n'
	for (let i in pok) {
		let cheat = pok[i]
		output += `cheat${i}_desc = "${cheat.name}"\n`
		output += `cheat${i}_code = "${cheat.codes.join('\\n')}"\n`
		output += `cheat${i}_enable = false\n\n`
	}

	return output.trim()
}
