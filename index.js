console.log("Init message (passed syntax).");

const Discord = require('discord.js');

const fs = require("fs");
const jsonfile = require("jsonfile")
const bot = new Discord.Client();
const { int } = require('random');
const keepAlive = require('./server');

var publicStats = {}

/*
class Stock {
    name;
}
class nuts extends Stock {
    nuts() {
        this.name = "nuts";
    }
}
class Shallot extends Stock {
    Shallot() {
        this.name = "Shallot";
    }
}
class StockRecord {
    static record = [];
}
*/
bot.on('message', (message)=> {
  if (message.author.id === bot.user.id) {
    return
  }

  message.channel.send(`Hey ${message.author.username}, kill yourself!`)
})
bot.on("ready", (ready)=>{
  console.log("Second check message (passed ready)")
})
keepAlive()























bot.login(process.env.sucknutsyournotseeingthetokenhaha)