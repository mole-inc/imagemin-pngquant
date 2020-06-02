const fs = require('fs');
const path = require('path');
const test = require('ava');
const getStream = require('get-stream');
const isPng = require('is-png');
const {imageminPngquant, pngquantStream} = require('../lib');

test('optimize a PNG', async t => {
	const buffer = fs.readFileSync(path.join(__dirname, 'fixtures', 'fixture.png'));
	const data = await imageminPngquant()(buffer);
	t.true(data.length < buffer.length);
	t.true(isPng(data));
});

test('support pngquant options', async t => {
	const buffer = fs.readFileSync(path.join(__dirname, 'fixtures', 'fixture.png'));
	const data = await imageminPngquant({
		speed: 10,
		quality: [0.8, 1]
	})(buffer);
	t.true(data.length > 30000);
	t.true(isPng(data));
});

test('support streams', async t => {
	const buffer = fs.readFileSync(path.join(__dirname, 'fixtures', 'fixture.png'));
	const stream = fs.createReadStream(path.join(__dirname, 'fixtures', 'fixture.png'));
	const data = await getStream.buffer(pngquantStream()(stream));
	t.true(data.length < buffer.length);
	t.true(isPng(data));
});

test('skip optimizing a non-PNG file', async t => {
	const buffer = fs.readFileSync(__filename);
	const data = await imageminPngquant()(buffer);
	t.is(data.length, buffer.length);
});

test('skip optimizing a fully optimized PNG', async t => {
	const buffer = fs.readFileSync(path.join(__dirname, 'fixtures', 'fixture-no-compress.png'));
	const data = await imageminPngquant({quality: [0.8, 1]})(buffer);
	t.is(data.length, buffer.length);
	t.true(isPng(data));
});
