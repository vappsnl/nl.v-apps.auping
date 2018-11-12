'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Homey = require('homey');
const Dongle_1 = require("./Dongle");
const Show_1 = require("./Show");
const dongle = new Dongle_1.Dongle();
const show = new Show_1.Show(dongle);
const moment = require("moment");

function Connect()
	{
		show.start();
	}
	



class MyApp extends Homey.App {
  
	onInit() {
		this.log('Show is running...');
		Connect();
   }
}

module.exports = MyApp;