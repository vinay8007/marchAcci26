const fs = require('fs');

//Create a read stream
const readStream = fs.createReadStream('input.txt','utf-8');

//Create a write stream
const writeStream = fs.createWriteStream('output.txt');

readStream.pipe(writeStream);

readStream.on('end', () => {  //after reading this will fire
    console.log('File has been read successfully.');
})

readStream.on('error', (err) => {
    console.error('Error reading file', err);
})

writeStream.on('error', (err) => {
    console.error('Error writing file', err);
});

writeStream.on('finish', () => {
    console.log('File has been written successfully');
});