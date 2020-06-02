import execa from 'execa';
import isPng from 'is-png';
import isStream from 'is-stream';
// @ts-ignore
import pngquant from '@mole-inc/pngquant-bin';
import ow from 'ow';
import {Options} from './options';
import {Readable} from 'stream';

const setupArgs = (options: Options) => {
	const args = ['-'];

	if (typeof options.speed !== 'undefined') {
		ow(options.speed, ow.number.integer.inRange(1, 11));
		args.push('--speed', `${options.speed}`);
	}

	if (typeof options.strip !== 'undefined') {
		ow(options.strip, ow.boolean);
		args.push('--strip');
	}

	if (typeof options.quality !== 'undefined') {
		ow(options.quality, ow.array.length(2).ofType(ow.number.inRange(0, 1)));
		const [min, max] = options.quality;
		args.push('--quality', `${Math.round(min * 100)}-${Math.round(max * 100)}`);
	}

	if (typeof options.dithering !== 'undefined') {
		ow(options.dithering, ow.any(ow.number.inRange(0, 1), ow.boolean.false));

		if (typeof options.dithering === 'number') {
			args.push(`--floyd=${options.dithering}`);
		} else if (!options.dithering) {
			args.push('--ordered');
		}
	}

	if (typeof options.posterize !== 'undefined') {
		ow(options.posterize, ow.number);
		args.push('--posterize', `${options.posterize}`);
	}

	if (typeof options.verbose !== 'undefined') {
		ow(options.verbose, ow.boolean);
		args.push('--verbose');
	}

	return args;
};

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const imageminPngquant = (options: Options = {}) => async (input: Buffer) => {
	const isBuffer = Buffer.isBuffer(input);

	if (!isBuffer) {
		throw new TypeError(`Expected a Buffer, got ${typeof input}`);
	}

	if (!isPng(input)) {
		return input;
	}

	const args = setupArgs(options);

	const result = await execa(pngquant, args, {
		encoding: null,
		maxBuffer: Infinity,
		input
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	}).catch(error => {
		return error;
	});
	if (result.exitCode === 99) {
		return input;
	}

	if (result.exitCode !== 0) {
		const execaError = result as execa.ExecaError<Buffer>;
		throw new Error(execaError.shortMessage);
	}

	return result.stdout;
};

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const pngquantStream = (options: Options = {}) => (input: Readable) => {
	if (!isStream(input)) {
		throw new TypeError(`Expected a Stream, got ${typeof input}`);
	}

	const args = setupArgs(options);

	const subprocess = execa(pngquant, args, {
		encoding: null,
		maxBuffer: Infinity,
		input
	});

	return subprocess.stdout;
};

export {imageminPngquant, pngquantStream};
