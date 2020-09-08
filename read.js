const { NFC } = require('nfc-pcsc');
 
const nfc = new NFC(); // optionally you can pass logger
 
 module.exports = function(RED) {
		function readCard(config) {
			RED.nodes.createNode(this, config);
			this.status({fill: "blue", shape: "ring", text: "Starting..."});
			this.on("input", function (msg, send, done) {
				nfc.on('reader', reader => {
					this.status({fill: "green", shape: "dot", text: reader.reader.name});
					reader.on('card', card => {
						console.log(`${reader.reader.name}  card detected`, card);
						this.status({fill: "green", shape: "dot", text: "Card detected"});
						//let msg = {};
						msg.payload = card;
						send(msg);
						//this.send(msg);
					});
					reader.on('card.off', card => {
						console.log(`${reader.reader.name}  card removed`, card);
						this.status({fill: "green", shape: "dot", text: "Card gone"});
					});
					reader.on('error', err => {
						console.log(`${reader.reader.name}  an error occurred`, err);
						this.status({fill: "red", shape: "dot", text: "error"});
						if (done){
							done(err)
						} else {
							node.error(err, msg);
						}
					});
					reader.on('end', () => {
						console.log(`${reader.reader.name}  device removed`);
						this.status({fill: "grey", shape: "dot", text: "Device disconnected"});
					});
				});
			});
			
		}
		RED.nodes.registerType("read-card", readCard)
	 }
	 
nfc.on('error', err => {
    console.log('an error occurred', err);
    this.status({fill: "red", shape: "dot", text: "error"});
});
