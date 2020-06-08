const http = require('http');
const fs = require('fs');
const csv = require('csv-parser');
const zlib = require('zlib');


//create empty arrays for male and female results to be used in csv conversion;
const maleResults = [];
const femaleResults = [];

const writeStreamMales = fs.createWriteStream(__dirname + '/males.json', 'utf8');
const writeStreamFemales = fs.createWriteStream(__dirname + '/females.json', 'utf8');

fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (data) => {
        if(data.Gender === 'M' || data.Gender === 'm') {
            maleResults.push(data);
        } else if (data.Gender === 'F' || data.Gender === 'm') {
            femaleResults.push(data);
        }
    })
    .on('end', () => {
        writeStreamMales.write(JSON.stringify(maleResults));
        writeStreamFemales.write(JSON.stringify(femaleResults));
    });

const gzip = zlib.createGzip();
const rwriteStreamMalesZipped = fs.createReadStream(__dirname + '/males.json');
const wwriteStreamMalesZipped = fs.createWriteStream(__dirname + '/males.json.gz');
rwriteStreamMalesZipped
    .pipe(gzip)
    .pipe(wwriteStreamMalesZipped)
    .on('finish', () => console.log('done compressing'))

const rwriteStreamFemalesZipped = fs.createReadStream(__dirname + '/females.json');
const wwriteStreamFemalesZipped = fs.createWriteStream(__dirname + '/females.json.gz');
rwriteStreamFemalesZipped
    .pipe(gzip)
    .pipe(wwriteStreamFemalesZipped)
    .on('finish', () => console.log('done compressing'))


const server = http.createServer((req, res) => {

    if (req.url === '/') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        });
        const readStream = fs.createReadStream(__dirname + '/index.html', 'utf8');
        readStream.pipe(res);
    } else if (req.url === '/males') {
            res.writeHead(200, { 
                'Content-Type': 'application/json' 
            });
            const readStream = fs.createReadStream(__dirname + '/males.json', 'utf8');
            readStream.pipe(res);
    } else if (req.url === '/females') {
            res.writeHead(200, { 
                'Content-Type': 'application/json'
            });
            const readStream = fs.createReadStream(__dirname + '/females.json', 'utf8');
            readStream.pipe(res);
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
        });
        res.end('No Route')
        
    }
    console.log(req.url);
})





//server listen plus console log in terminal
server.listen(3000, () => {
    console.log(`Listening on port 3000`)
});