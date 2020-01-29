//
// Notifier.js  --  show OSX Notifications from MQTT Notification messages.
//
// John D. Allen
// Sept 2016
//
// Node-Notifier:  https://github.com/mikaelbr/node-notifier
//
// Jan 2020: This file was modified to just use Growl for my Raspberry Pi
//

var mqtt = require('mqtt');
var Growl = require('node-notifier').Growl;

var BROKER = "mqtt://10.1.1.28";

var copts = {
  clientId: "Growl_Notifier",
  keepalive: 20000
};

var notify = new Growl({
  name: "Notifier",
  host: 'localhost',
  port: 23053
});

var client = mqtt.connect(BROKER, copts);

client.on('connect', function() {
  //console.log("MQTT Notification daemon Connected...");
  client.subscribe('alert/#');
});

client.on('message', function(topic, msg) {
  if (topic != 'alert/batty/Out2') {
    notify.notify({
      title: '--ALERT!--  ' + topic,
      message: msg.toString(),
      wait: false
    }, function(err,resp) {
      //'resp' is any response from the notification system.
      //console.log(resp);
    });
  }
});

process.on('SIGINT', function() {     // catch CTRL-C for exiting program
  console.log('Exiting...');
  client.unsubscribe('alert/+');
  client.end();
  process.exit();
});

