# libretro-database-cht-spectrum

ZX-Spectrum cheats for [libretro-database](https://github.com/libretro/libretro-database) from [all-tipshop-pokes](https://github.com/eklipse2009/all-tipshop-pokes).

This parses the .pok files from [.pok format](http://www.worldofspectrum.org/POKformat.txt) into RetroArch .cht files in libretro-database.

## Requirements

1. Node.js
2. git

## Usage

To build the .cht files, run the following...

```
npm it
```

To update the .pok files, run the following...

```
git pull --recurse-submodules
git submodule update --remote --recursive
```
