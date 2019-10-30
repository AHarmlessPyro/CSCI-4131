var file = require('fs');

var items = [];

file.readFile('./places.txt', function (err, data) {
    if (!err) {
        console.log(Buffer.from(data, 'base64').toString('binary'));
        items.push(data.split(/(.*)\n.*/));
        //console.log(atob(data));
        write();
    }
});

function write() {
    file.writeFile('./converted.json', items, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}