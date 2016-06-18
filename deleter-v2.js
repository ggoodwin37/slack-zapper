// TODO: do getMessages repeatedly until there's nothing left, rather than requiring to run this script multiple times.
const https = require('https');
const async = require('async');
const fs = require('fs');

// read keys from a json file on disk
const keyObj = JSON.parse(fs.readFileSync('keys.json', 'utf8'));
const token = keyObj.token;
const user = keyObj.user;
const channel = keyObj.channel;

// non-user-specific constants
const protocol = 'https:';
const hostname = 'slack.com';
const batchSize = 1000;
const modifyText = 'lol im a spy';
const parallelLimitCount = 5;

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
            cb && cb();
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
            cb && cb();
        });
    }).on('error', (e) => {
        console.log('delete message failed');
    });
    req.end();
}

getMessages((d) => {
    async.parallelLimit(d.messages.map((oneMessage) => {
        return (cb) => {
            modifyMessage(oneMessage.ts, cb);
        };
    }), parallelLimitCount, () => {
        async.parallelLimit(d.messages.map((oneMessage) => {
            return (cb) => {
                deleteMessage(oneMessage.ts, cb);
            };
        }), parallelLimitCount);
    });
});
