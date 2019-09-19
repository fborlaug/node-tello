const dgram = require('dgram');

const say = require('say');

say.speak('I am sorry Dave. I am afraid I can’t do that');

const DRONE_PORT = 8889;
const DRONE_HOST = '192.168.10.1';
const drone = dgram.createSocket('udp4')
drone.bind(DRONE_PORT);

const commandDelays = {
   command: 500,
   takeoff: 5000,
   land: 5000,
   up: 7000,
   down: 7000,
   left: 5000,
   go: 7000,
   right: 5000,
   forward: 5000,
   back: 5000,
   cw: 5000,
   ccw: 5000,
   'flip f': 3000,
   speed: 3000,
   'battery?': 500,
   'speed?': 500,
   'time?': 500
};

function wait(time = 0) {
   return new Promise(resolve => setTimeout(resolve, time));
}

drone.on('message', message => {
   message = message.toString().replace(/(\r\n|\n|\r)/gm,'');
   console.log(`> Incoming message from drone: ${message}`);
});

function handleMessageSendt(err) {
   if (err) {
      console.log(`> Error while trying to send message: ${err}`);
   }
}

function runCommand(commands, i) {
   if (i >= commands.length) {
      console.log('> Finished test');
      process.exit();
   }
   console.log(`> Running command: ${commands[i]}`)
   drone.send(commands[i], 0, commands[i].length, DRONE_PORT, DRONE_HOST, handleMessageSendt);
   (async () => {
      await wait(commandDelays[commands[i]]);
      runCommand(commands, ++i);
   })();
}

function runCommands(commands) {
   runCommand(commands, 0);
}

function exit() {
   console.log('> Finished test');
   process.exit();
}

(function main() {
   console.log('> Starting test');
   const commands = ['command', 'battery?', 'takeoff', 'flip f','land'];
   runCommands(commands);
})();