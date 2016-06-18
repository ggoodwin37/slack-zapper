const https = require('https');

// paste values in here if you want this to work
const token = '';
const user = '';
const channel = '';

// non-user-specific constants
const protocol = 'https:';
const hostname = 'slack.com';
const batchSize = 10;   // up to 1000
const modifyText = 'lol im a spy';

function getMessages(cb) {
    const path = '/api/im.history?token=' + token + '&channel=' + channel + '&count=' + batchSize;
    const options = {
        protocol: protocol,
        hostname: hostname,
        path: path,
        method: 'GET'
    };
    const debugPath = protocol + '//' + hostname + path;
    console.log('getting messages, path is: "' + debugPath + '"');
    const req = https.request(options, (res) => {
        console.log('Status: ' + res.statusCode);
        const dataBuf = [];
        res.on('data', (d) => {
            dataBuf.push(d.toString());
        }).on('end', () => {
            cb(JSON.parse(dataBuf.join('')));
        });
    }).on('error', (e) => {
        console.log('failed');
    });
    req.end();
}

function modifyMessage(timestamp, cb) {
    const path = '/api/chat.update?token=' + token + '&ts=' + timestamp + '&channel=' + channel + '&text=' + encodeURIComponent(modifyText);
    const options = {
        protocol: protocol,
        hostname: hostname,
        path: path,
        method: 'GET'
    };
    const debugPath = protocol + '//' + hostname + path;
    console.log('modifying message, path is: "' + debugPath + '"');
    const req = https.request(options, (res) => {
        const dataBuf = [];
        res.on('data', (d) => {
            dataBuf.push(d.toString());
        }).on('end', () => {
            cb && cb(JSON.parse(dataBuf.join('')));
        });
    }).on('error', (e) => {
        console.log('modify message failed');
    });
    req.end();
}

function deleteMessage(timestamp, cb) {
    const path = '/api/chat.delete?token=' + token + '&ts=' + timestamp + '&channel=' + channel + '&as_user=false';
    const options = {
        protocol: protocol,
        hostname: hostname,
        path: path,
        method: 'GET'
    };
    const debugPath = protocol + '//' + hostname + path;
    console.log('deleting message, path is: "' + debugPath + '"');
    const req = https.request(options, (res) => {
        const dataBuf = [];
        res.on('data', (d) => {
            dataBuf.push(d.toString());
        }).on('end', () => {
            cb && cb(JSON.parse(dataBuf.join('')));
        });
    }).on('error', (e) => {
        console.log('delete message failed');
    });
    req.end();
}

getMessages((d) => {
    // TODO: handroll async.parallelLimit?
    //    modifyMessage(d.messages[5].ts);
//    deleteMessage(d.messages[5].ts);
});
