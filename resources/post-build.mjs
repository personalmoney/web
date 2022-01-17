import { writeFile, readFile } from 'fs';

readFile('./src/assets/errors.json', (readErr, data) => {
    if (data) {
        var minified = JSON.stringify(JSON.parse(data));

        writeFile('./www/assets/errors.json', minified, 'utf8', (err) => {
            if (err) {
                return console.log(err);
            }
        });
    }
    else {
        return console.log(readErr);
    }
});
