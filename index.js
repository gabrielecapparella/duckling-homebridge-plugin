var Service, Characteristic;
 
module.exports = function (homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-agricoltura", "Agricoltura", myGreenhouse);
};

const request = require('request');

function myGreenhouse(log, config) {
	this.log = log;
	//this.url = config['url'];
	//this.api_key = config['api_key'];
	this.config = config 
	

}

function get_set_request(url, method, data, callback) {
	request({
		url: url,
		method: method,
		body: data,
		json: true
	},
	callback);
}

myGreenhouse.prototype = {

	getHeat: function (callback) {
		this.log('getHeat')
		get_set_request(this.config['url']+'getActuator', 'POST', {"name": this.config['heating_name'], "api_key": this.config['api_key']}, 
			function(error, response, body) {
				if(error) { callback(error); }
				else{ callback(null, body[0]); }
			}.bind(this));
	},

	setHeat: function (on, callback) {
		this.log('setHeat: '+on)
		get_set_request(this.config['url']+'setActuator', 'POST', {"name": this.config['heating_name'], "targetState": [on], "api_key": this.config['api_key']}, 
			function(error, response, body) {
				if(error) {callback(error);}
				else {callback();}
			}.bind(this));
	},

	getLight: function (callback) {
		this.log('getLight')
		get_set_request(this.config['url']+'getActuator', 'POST', {"name": this.config['light_name'], "api_key": this.config['api_key']}, 
			function(error, response, body) {
				if(error) { callback(error); }
				else{ callback(null, body[0]); }
			}.bind(this));
	},

	setLight: function (on, callback) {
		this.log('setLight: '+on)
		get_set_request(this.config['url']+'setActuator', 'POST', {"name": this.config['light_name'], "targetState": [on], "api_key": this.config['api_key']}, 
			function(error, response, body) {
				if(error) {callback(error);}
				else {callback();}
			}.bind(this));
	},

	getWater: function (callback) {
		this.log('getWater')
		get_set_request(this.config['url']+'getActuator', 'POST', {"name": this.config['irrigation_name'], "api_key": this.config['api_key']}, 
			function(error, response, body) {
				if(error) { callback(error); }
				else{ callback(null, body[0]); }
			}.bind(this));
	},

	setWater: function (on, callback) {
		this.log('setWater: '+on)
		get_set_request(this.config['url']+'setActuator', 'POST', {"name": this.config['irrigation_name'], "targetState": [on], "api_key": this.config['api_key']}, 
			function(error, response, body) {
				if(error) {callback(error);}
				else {callback();}
			}.bind(this));
	},

	getFan: function (callback) {
		this.log('getFan')
		get_set_request(this.config['url']+'getActuator', 'POST', {"name": this.config['ventilation_name'], "api_key": this.config['api_key']}, 
			function(error, response, body) {
				if(error) { callback(error); }
				else{ callback(null, body[0]); }
			}.bind(this));
	},

	setFan: function (on, callback) {
		this.log('setFan: '+on)
		get_set_request(this.config['url']+'setActuator', 'POST', {"name": this.config['ventilation_name'], "targetState": [on], "api_key": this.config['api_key']}, 
			function(error, response, body) {
				if(error) {callback(error);}
				else {callback();}
			}.bind(this));
	},
	
	getFanSpeed: function (callback) {
		this.log('getFanSpeed')
		get_set_request(this.config['url']+'getActuator', 'POST', {"name": this.config['ventilation_name'], "api_key": this.config['api_key']}, 
			function(error, response, body) {
				if(error) { callback(error); }
				else{ callback(null, body[1]); }
			}.bind(this));
	},

	setFanSpeed: function (speed, callback) {
		this.log('setFanSpeed: '+speed)
		if(speed==0) {on=false;}
		else {on=true;}
		
		get_set_request(this.config['url']+'getActuator', 'POST', {"name": this.config['ventilation_name'], "targetState": [on, speed], "api_key": this.config['api_key']}, 
			function(error, response, body) {
				if(error) {callback(error);}
				else {callback();}
			}.bind(this));
	},

	getTemp: function (callback) {
		this.log('getTemp')
		get_set_request(this.config['url']+'getLastReading', 'POST', {"api_key": this.config['api_key']}, 
			function(error, response, body) {
				if(error) { 
					this.log(error);
					callback(error); 
				}
				else{ callback(null, body[1]); }
			}.bind(this));
	},

	getRpiTemp: function (callback) {
		this.log('getRpiTemp')
		get_set_request(this.config['url']+'getSystemStatus', 'POST', {"api_key": this.config['api_key']}, 
			function(error, response, body) {
				if(error) { 
					this.log(error);
					callback(error); 
				}
				else{ callback(null, body['cpu_temp']); }
			}.bind(this));
	},

	getHum: function (callback) {
		this.log('getHum')
		get_set_request(this.config['url']+'getLastReading', 'POST', {"api_key": this.config['api_key']}, 
			function(error, response, body) {
				if(error) { callback(error); }
				else{ callback(null, body[2]); }
			}.bind(this));
	},

	getMoist: function (callback) {
		this.log('getMoist')
		get_set_request(this.config['url']+'getLastReading', 'POST', {"api_key": this.config['api_key']}, 
			function(error, response, body) {
				if(error) { callback(error); }
				else{ callback(null, body[3]); }
			}.bind(this));
	},
	
	getServices: function () {
		let informationService = new Service.AccessoryInformation();
		informationService
			.setCharacteristic(Characteristic.Manufacturer, "Gabriele@AraneumGroup")
			.setCharacteristic(Characteristic.Model, "1")
			.setCharacteristic(Characteristic.SerialNumber, "314-159-265");
	 
	 
		let lightService = new Service.Lightbulb("Grow Light");
		lightService
			.getCharacteristic(Characteristic.On)
				.on('get', this.getLight.bind(this))
				.on('set', this.setLight.bind(this));

		let heatService = new Service.Lightbulb("Heating");
		heatService
			.getCharacteristic(Characteristic.On)
				.on('get', this.getHeat.bind(this))
				.on('set', this.setHeat.bind(this));


		let fanService = new Service.Fan("Ventilation");
		fanService
			.getCharacteristic(Characteristic.On)
				.on('get', this.getFan.bind(this))
				.on('set', this.setFan.bind(this));	
				
		fanService		 
			.addCharacteristic(Characteristic.RotationSpeed)
				.on('get', this.getFanSpeed.bind(this))
				.on('set', this.setFanSpeed.bind(this));	 	
	 	
		let waterService = new Service.Switch("Irrigation");
		waterService
			.getCharacteristic(Characteristic.On)
				.on('get', this.getWater.bind(this))
				.on('set', this.setWater.bind(this));		 	 


		let tempService = new Service.TemperatureSensor("Temperature", "amb");
		tempService
			.getCharacteristic(Characteristic.CurrentTemperature)
				.on('get', this.getTemp.bind(this));	 

		let rpiService = new Service.TemperatureSensor("RPi Temperature", "rpi");
		rpiService
			.getCharacteristic(Characteristic.CurrentTemperature)
				.on('get', this.getRpiTemp.bind(this));

		let humService = new Service.HumiditySensor("Humidity", "hum");
		humService
			.getCharacteristic(Characteristic.CurrentRelativeHumidity)
				.on('get', this.getHum.bind(this));	
				
				
		let moistService = new Service.HumiditySensor("Soil Moisture", "moist");
		moistService
			.getCharacteristic(Characteristic.CurrentRelativeHumidity)
				.on('get', this.getMoist.bind(this));				
				 
		return [informationService, lightService, heatService, fanService, waterService, tempService, humService, moistService, rpiService];
	}
};

