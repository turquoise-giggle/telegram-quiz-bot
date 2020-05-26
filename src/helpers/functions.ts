export const bufferToStream = (buffer: Buffer) => {
	let Duplex = require('stream').Duplex

	let stream = new Duplex()
	stream.push(buffer)
	stream.push(null)
	return stream
}