# imagemin-pngquant ![Node CI](https://github.com/mole-inc/imagemin-pngquant/workflows/Node%20CI/badge.svg)

> [Imagemin](https://github.com/imagemin/imagemin) plugin for [`pngquant`](https://github.com/mole-inc/pngquant)

[![Downloads](https://badgen.net/npm/dm/@mole-inc/imagemin-pngquant)](https://www.npmjs.com/package/@mole-inc/imagemin-pngquant)
[![Version](https://badgen.net/npm/v/@mole-inc/imagemin-pngquant)](https://www.npmjs.com/package/@mole-inc/imagemin-pngquant)
[![codecov](https://codecov.io/gh/mole-inc/imagemin-pngquant/branch/master/graph/badge.svg)](https://codecov.io/gh/mole-inc/imagemin-pngquant)

## Install

```
$ npm install @mole-inc/imagemin-pngquant
```


## Usage

```js
const imagemin = require('imagemin');
const imageminPngquant = require('@mole-inc/imagemin-pngquant');

(async () => {
	await imagemin(['images/*.png'], 'build/images', {
		plugins: [
			imageminPngquant()
		]
	});

	console.log('Images optimized');
})();
```

```js
const fs = require('fs');
const {pngquantStream} = require('@mole-inc/imagemin-pngquant');

const src = fs.createReadStream('foo.png');
const dest = fs.createWriteStream('bar.png');
pngquantStream({quality: [0.3, 0.5]})(src).pipe(dest);
```


## API

### imageminPngquant(options?)(input)

Returns `Promise<Buffer>`.

#### options

Type: `object`

##### speed

Type: `number`<br>
Default: `4`<br>
Values: `1` (brute-force) to `11` (fastest)

Speed `10` has 5% lower quality, but is about 8 times faster than the default. Speed `11` disables dithering and lowers compression level.

##### strip

Type: `boolean`<br>
Default: `false`

Remove optional metadata.

##### quality

Type: `Array<min: number, max: number>`<br>
Values: `Array<0...1, 0...1>`<br>
Example: `[0.3, 0.5]`

Instructs pngquant to use the least amount of colors required to meet or exceed
the max quality. If conversion results in quality below the min quality the
image won't be saved.

Min and max are numbers in range 0 (worst) to 1 (perfect), similar to JPEG.

##### dithering

Type: `number | boolean`<br>
Default: `1` (full)<br>
Values: `0...1`

Set the dithering level using a fractional number between 0 (none) and 1 (full).

Pass in `false` to disable dithering.

##### posterize

Type: `number`

Truncate number of least significant bits of color (per channel). Use this when image will be output on low-depth displays (e.g. 16-bit RGB). pngquant will make almost-opaque pixels fully opaque and will reduce amount of semi-transparent colors.

##### verbose

Type: `boolean`<br>
Default: `false`

Print verbose status messages.

#### input

Type: `Buffer | Stream`

Buffer or stream to optimize.

### pngquantStream(options?)(input)

Returns `Readable`.

## License

This is a fork of [imagemin/imagemin-pngquant](https://github.com/imagemin/imagemin-pngquant).

see license file.
