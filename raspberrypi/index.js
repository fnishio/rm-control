const firebase = require('firebase');
const config = require('./config')
const exec = require('child_process').exec;

firebase.initializeApp(config);

const db = firebase.database();

const irCommand = './python-broadlink/cli/broadlink_cli --device @ir_code/RM.device --send @ir_code/'

// room light
const lightPath = '/room-light';
var attached = false;
db.ref(lightPath).on("value", function(snapshot) {
    if (!attached) {
        attached = true;
        return;
    }

    var operation = snapshot.val().op;
    if (operation == 'on') {
        var date = new Date()
        if (date.getHours() < 6 || date.getHours() >= 18) {
            operation = 'fav'
        }
    }
    console.log("light: " + operation);

    switch(operation) {
        case 'on':
            exec(irCommand + 'room_light/on', (err, stdout, stderr) => {});
            break;
        case 'off':
            exec(irCommand + 'room_light/on', (err, stdout, stderr) => {});
            exec(irCommand + 'room_light/on', (err, stdout, stderr) => {});
            break;
        case 'fav':
            exec(irCommand + 'room_light/favorite', (err, stdout, stderr) => {});
            break;
        case 'bright':
            exec(irCommand + 'room_light/bright', (err, stdout, stderr) => {});
            break;
        case 'dark':
            exec(irCommand + 'room_light/dark', (err, stdout, stderr) => {});
            break;
    }
});
