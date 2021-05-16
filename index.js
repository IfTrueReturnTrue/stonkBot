console.log("Init message (passed syntax).");

const Discord = require('discord.js');

const fs = require("fs");
const jsonfile = require("jsonfile")
const bot = new Discord.Client();
const { int } = require('random');
const keepAlive = require('./server');
if (fs.existsSync("publicstats.json")) {
  publicStats = jsonfile.readFileSync('publicstats.json')
} else {
  var publicStats = {}
}
if (fs.existsSync("memberStats.json")) {
  memberstats = jsonfile.readFileSync("memberStats.json")
} else {
  var memberstats = {}
}
if (fs.existsSync("serverStats.json")) {
  serverStats = jsonfile.readFileSync("serverStats.json")
} else {
  var serverStats = {
    nutsprice: 6,
    shallotprice: 70,
    nutsOutstanding: 10000000,
    shallotOutstanding: 1000000,
    nutsPendingRelease: 0,
    shallotPendingRelease: 0

  }
}
if (fs.existsSync("listOfMembers.json")) {
  listOfMembers = jsonfile.readFileSync("listOfMembers.json")
} else {
  listOfMembers = [0]
}


const cmds = ["help","buy", "sell", "shop", "stonks", "balance"]
const cmdDescs = ["This is pretty self-explanatory","`stonks buy <whichStock> <amount>`You can use this command to buy stocks, only after a certain cooldown.\nE.g `stonks buy shallot`\nCooldowns: 10 minutes.","`stonks sell <whichStock> <amount>`\nPlace your stock on the market and it'll sell somewhere between within 30 minutes and 1 hour. Note that you can place multiple stocks on the market. ","`stonks shop`\nShows the stonk shop, including current price of each stock. It also shows your current cooldowns and which of your stocks are on the market.","`stonks stonks`\nShows the descriptions of the stocks you can buy.", "`stonks balance`\nShows your profile, including balance, some quick stats, and other stuff."]


bot.on('message', (message)=> {
  if (fs.existsSync("publicstats.json")) {
    publicStats = jsonfile.readFileSync('publicstats.json')
  }
  if (fs.existsSync("memberStats.json")) {
    memberstats = jsonfile.readFileSync("memberStats.json")
  }
  if (fs.existsSync("serverStats.json")) {
    serverStats = jsonfile.readFileSync("serverStats.json")
  }
  if (fs.existsSync("listOfMembers.json")) {
    serverStats = jsonfile.readFileSync("listOfMembers.json")
  }
  if (message.author.id === bot.user.id) {
    return
  }
  if (message.author.id in memberstats === false) {
    listOfMembers.push(message.author.id)
    memberstats[message.author.id] = {
      balance: 5000,
      stocksOwned: [0,0],
      stockBuyCooldown: {
        shallot: 0,
        nuts: 0
      },
      stockSellTime: {
        shallot: 0,
        nuts: 0
      },
      stockPendingSell: {
        shallot: 0,
        nuts: 0
      },
      currentSellPrice: [6, 70],
      numOfSuccessfulBuys: 0,
      numOfSuccessfulSells: 0,
      totalBuyValue: 0,
      totalSellValue: 0,
      lastSevenDaysBuy:0,
      lastSevenDaysSell: 0

    }
  }
  userStats = memberstats[message.author.id]
  parts = message.content.toLowerCase().split(" ")
  if (parts[0]=== "stonks") {
    if (parts[1] === "help") {
      if (parts.length < 3) {

      
        const helpEmbed = new Discord.MessageEmbed()
          .setTitle("Stonk Bot Help:")
          .setDescription("Here is the list of commands that you can use:")
          .addFields(
            {name: "`stonks buy `", value: "Allows you to buy stock, only after a certain cooldown though!"},
            {name: "`stonks sell`", value: "Allows you to buy stock!"},
            {name: "`stonks shop`", value: "Allows you to view the shop!"},
            {name: "`stonks stonks`", value: "View some stonks!"}
          )
        
        message.channel.send(helpEmbed)
      } else {
        const helpSpec = new Discord.MessageEmbed()
          .setTitle("Command help: "+parts[2])
          
        
        
        
        foo = 0
        for (var x = 0; x < cmds.length; x++) {
          if (parts[2]===cmds[x]) {
            helpSpec.setDescription(cmdDescs[x])
            message.channel.send(helpSpec)
          } else {
            
            foo += 1
          }
          
        }
        if (foo === cmds.length) {
          message.channel.send("The command '"+parts[2]+"' doesn't exist!")
        }
          
        
       
        
      }
    }
    if (parts[1]==="buy") {
      if (parts.length < 3) {
        message.channel.send("You gotta give me something to buy my guy!")

      } else {
        if (parts[2]==="nuts" || parts[2]==="n" || parts[2]==="killmyselfiwantsomenutsrightnowgiveme") {
          if (serverStats.nutsOutstanding < 1) {
            message.channel.send("There are no more of this stock on the market!")
          } else {

          
            if (userStats.stockBuyCooldown.nuts <= Date.now()) {
              if (parts.length < 4) {
                if (userStats.balance < serverStats.nutsprice) {
                  const failBuyEmbed = new Discord.MessageEmbed()
                    .setTitle("Unsuccessful purchase :x:")
                    .setDescription("You don't have enough money to buy nuts!")
                  message.channel.send(failBuyEmbed)
                
                } else {
                  const successBuyEmbed = new Discord.MessageEmbed()
                    .setTitle("Successful purchase :white_check_mark:")
                    .setDescription(`You successfully bought 1x nuts for $${serverStats.nutsprice}`)
                  message.channel.send(successBuyEmbed)
                  userStats.balance -= serverStats.nutsprice
                  userStats.stocksOwned[0] += 1
                  serverStats.nutsOutstanding -= 1
                  userStats.totalBuyValue += serverStats.nutsprice
                  userStats.numOfSuccessfulBuys += 1
                  userStats.stockBuyCooldown.nuts = Date.now() + 600000
                } 
              } else {
                if (parseInt(parts[3])*serverStats.nutsprice > userStats.balance) {
                  const failBuyEmbed = new Discord.MessageEmbed()
                    .setTitle("Unsuccessful purchase :x:")
                    .setDescription(`You don't have enough money to buy ${parts[3]}x nuts! That costs $${parseInt(parts[3])*serverStats.nutsprice}`)
                  message.channel.send(failBuyEmbed)                
                } else {
                  const successBuyEmbed = new Discord.MessageEmbed()
                    .setTitle("Successful purchase :white_check_mark:")
                    .setDescription(`You successfully bought ${parts[3]}x nuts for $${serverStats.nutsprice*parseInt(parts[3])}`)
                  message.channel.send(successBuyEmbed)
                  userStats.balance -= parseInt(parts[3])*serverStats.nutsprice
                  userStats.stocksOwned[0] += parseInt(parts[3])
                  serverStats.nutsOutstanding -= parseInt(parts[3])
                  userStats.totalBuyValue += parseInt(parts[3])*serverStats.nutsprice
                  userStats.numOfSuccessfulBuys += 1
                  userStats.stockBuyCooldown.nuts = Date.now() + 600000
                }
              }
            } else {
              message.channel.send("Your still on cooldown! Wait "+Math.round((userStats.stockBuyCooldown.nuts-Date.now())/60000, 2)+" minutes until you can buy nuts again!")
            }
          }
        }
        if (parts[2]==="shallot" || parts[2]==="shilan" || parts[2]==="killmyselfiwantsomeshallotsrightnowgiveme") {
          if (serverStats.shallotOutstanding < 1) {
            message.channel.send("There is no more of this stock left on the market!")
          } else {

          
            if (userStats.stockBuyCooldown.shallot <= Date.now()) {
              if (parts.length < 4) {
                if (userStats.balance < serverStats.shallotprice) {
                  const failBuyEmbed = new Discord.MessageEmbed()
                    .setTitle("Unsuccessful purchase :x:")
                    .setDescription("You don't have enough money to buy shallots!")
                  message.channel.send(failBuyEmbed)
                
                } else {
                  const successBuyEmbed = new Discord.MessageEmbed()
                    .setTitle("Successful purchase :white_check_mark:")
                    .setDescription(`You successfully bought 1x shallots for $${serverStats.shallotprice}`)
                  message.channel.send(successBuyEmbed)
                  userStats.balance -= serverStats.shallotprice
                  userStats.stocksOwned[1] += 1
                  serverStats.shallotOutstanding -= 1
                  userStats.totalBuyValue += serverStats.shallotprice
                  userStats.numOfSuccessfulBuys += 1
                  userStats.stockBuyCooldown.shallot = Date.now() + 600000
                } 
              } else {
                if (parseInt(parts[3])*serverStats.nutsprice > userStats.balance) {
                  const failBuyEmbed = new Discord.MessageEmbed()
                    .setTitle("Unsuccessful purchase :x:")
                    .setDescription(`You don't have enough money to buy ${parts[3]}x shallots! That costs $${parseInt(parts[3])*serverStats.shallotprice}`)
                  message.channel.send(failBuyEmbed)                
                } else {
                  const successBuyEmbed = new Discord.MessageEmbed()
                    .setTitle("Successful purchase :white_check_mark:")
                    .setDescription(`You successfully bought ${parts[3]}x shallots for $${serverStats.shallotprice*parseInt(parts[3])}`)
                  message.channel.send(successBuyEmbed)
                  userStats.balance -= serverStats.shallotprice
                  userStats.stocksOwned[1] += parseInt(parts[3])
                  serverStats.shallotOutstanding -= parseInt(parts[3])
                  userStats.totalBuyValue += parseInt(parts[3])*serverStats.shallotprice
                  userStats.numOfSuccessfulBuys += 1
                  userStats.stockBuyCooldown.shallot = Date.now() + 600000
                }
              }
            } else {
              message.channel.send("Your still on cooldown! Wait "+Math.round((userStats.stockBuyCooldown.shallot-Date.now())/60000,2)+" minutes until you can buy shallots again!")
            }
          }
        }
      }
    }
    if (parts[1]==="inv"||parts[1]==="profile"||parts[1]==="inventory"||parts[1]==="bal"||parts[1]==="balance") {
      const invEmbed = new Discord.MessageEmbed()
        .setTitle(`${message.author.username}'s profile: Balance: $${userStats.balance}'`)
        .setDescription(`Quick Stats: \n**Number Of Successful Buys:** ${userStats.numOfSuccessfulBuys}\n**Number Of Successful Sells:** ${userStats.numOfSuccessfulSells}\n**Total Buy Value: **$${userStats.totalBuyValue}\n**Total Sell Value: **$${userStats.totalSellValue}\n**Total Profit: **$${userStats.totalSellValue-userStats.totalBuyValue}`)
        .addFields(
          {name: "Shallots:", value: `**Amount: **${userStats.stocksOwned[1]}  **Current Price: **${serverStats.shallotprice}  **Total value: **${userStats.stocksOwned[1]*serverStats.shallotprice}`},
          {name: "Nuts:", value: `**Amount: **${userStats.stocksOwned[0]}  **Current Price: **${serverStats.nutsprice}  **Total value: **${userStats.stocksOwned[0]*serverStats.nutsprice}`}
          
        )
        .setFooter("stonks")
      if (userStats.stockBuyCooldown.nuts < Date.now()) {
        invEmbed.addField("Nuts Buy Cooldown: ", "**READY**")

      } else {
        invEmbed.addField("Nuts Buy Cooldownn: ", `${Math.round((userStats.stockBuyCooldown.nuts - Date.now())/60000)} minutes left`)
      }
      if (userStats.stockBuyCooldown.shallot < Date.now()) {
        invEmbed.addField("Shallot Buy Cooldown: ", "**READY**")

      } else {
        invEmbed.addField("Shallot Buy Cooldownn: ", `${Math.round((userStats.stockBuyCooldown.shallot - Date.now())/60000)} minutes left`)
      }
      invEmbed.addField("Price to ", "be added later.")
      message.channel.send(invEmbed)
    }
  }
  if (parts[1] === "shop") {
    const shopEmbed = new Discord.MessageEmbed()
      .setTitle("Stonk Shop")
      .setDescription("This is where you can check out the prices of each stock, and how much stock is left outstanding, and how much stock is pending release (from other sellers). You can also see how much of your stock is pending to be sold. ")
      .addFields(
        {name: "Stock Prices: ", value: `**Nuts Price: **$${serverStats.nutsprice}\n*Shallot Price: **$${serverStats.shallotprice}`},
        {name: "Shares Outstanding: ", value: `**Nuts Shares: **${serverStats.nutsOutstanding}\n**Shallot Shares: **${serverStats.shallotOutstanding}`},
        {name: "Stocks Pending Release: ", value: `**Nuts: **${serverStats.nutsPendingRelease}\n**Shallot: **${serverStats.shallotPendingRelease}`},
        {name: "Your stocks pending release: ", value: `**Nuts: **${userStats.stockSellTime.nuts}\n**Shallot: **${userStats.stockSellTime.shallot}`}
      )
    message.channel.send(shopEmbed)
  }
  if (parts[1] === "sell") {
    if (parts.length < 3) {
      message.channel.send("Give me something to sell?")

    } else {
      if (parts[2] === "nuts") {
        if (userStats.stockSellTime.nuts > 0) {
          message.channel.send("You already have a nuts transaction pending sell!")
        } else {

        
          if (parts.length < 4) {
            if (userStats.stocksOwned[0] <1) {
              message.channel.send("You literally don't have any of these.")
              
            } else {
              userStats.stockSellTime.nuts = Date.now() + Math.random()*60000
              message.channel.send(`Successfully sent 1x nuts into the market at $${serverStats.nutsprice}. Wait ${Math.round((userStats.stockSellTime.nuts - Date.now())/60000)} minutes for transaction to be complete.`)
              userStats.stockPendingSell.nuts += 1 
              userStats.stocksOwned[0] -= 1
              userStats.currentSellPrice[0] = serverStats.nutsprice
            }
          } else {
            if (userStats.stocksOwned[0] < parseInt(parts[3])) {
              message.channel.send("You literally don't have any of these.")

            } else {
              
              userStats.stockSellTime.nuts = Date.now() + Math.random()*60000
              const sellEmbed = new Discord.MessageEmbed()
                .setTitle("Successful transaction: inv => pending :white_check_mark:")
                .setDescription(`You have successfully moved ${parseInt(parts[3])}x nuts into pending sell. Wait ${Math.round((userStats.stockSellTime.nuts - Date.now())/60000)} minutes for transaction to be complete.`)
                userStats.stockPendingSell.nuts += parseInt(parts[3]) 
                userStats.stocksOwned[0] -= parseInt(parts[3])
                userStats.currentSellPrice[0] = serverStats.nutsprice
              message.channel.send(sellEmbed)

            }
          }
        }
      }
      if (parts[2] === "shallot") {
        if (userStats.stockSellTime.shallot > 0) {
          message.channel.send("You already have a shallot transaction pending sell!")
        } else {

        
          if (parts.length < 4) {
            if (userStats.stocksOwned[1] <1) {
              message.channel.send("You literally don't have any of these.")
              
            } else {
              userStats.stockSellTime.shallot = Date.now() + Math.random()*60000
              message.channel.send(`Successfully sent 1x shallot into the market at $${serverStats.shallotprice}. Wait ${Math.round((userStats.stockSellTime.shallot - Date.now())/60000)} minutes for transaction to be complete.`)
              userStats.stockPendingSell.shallot += 1 
              userStats.stocksOwned[1] -= 1
              userStats.currentSellPrice[1] = serverStats.shallotprice
            }
          } else {
            if (userStats.stocksOwned[1] < parseInt(parts[3])) {
              message.channel.send("You literally don't have any of these.")

            } else {
              
              userStats.stockSellTime.shallot = Date.now() + Math.random()*60000
              const sellEmbed = new Discord.MessageEmbed()
                .setTitle("Successful transaction: inv => pending :white_check_mark:")
                .setDescription(`You have successfully moved ${parseInt(parts[3])}x nuts into pending sell. Wait ${Math.round((userStats.stockSellTime.shallot - Date.now())/60000)} minutes for transaction to be complete.`)
                userStats.stockPendingSell.shallot += parseInt(parts[3]) 
                userStats.stocksOwned[1] -= parseInt(parts[3])
                userStats.currentSellPrice[1] = serverStats.shallotprice
              message.channel.send(sellEmbed)

            }
          }
        }
      }
    }
  }
  if (message.author.id in listOfMembers === false) {
    message.channel.send(listOfMembers)
    
  }
  jsonfile.writeFileSync("publicstats.json", publicStats)
  jsonfile.writeFileSync("memberStats.json", memberstats)
  jsonfile.writeFileSync("serverStats.json", serverStats)
  jsonfile.writeFileSync("listOfMembers.json", listOfMembers)

})
bot.on("ready", (ready)=>{
  console.log("Second check message (passed ready)")
  checkStockDone = setInterval(() => {
    for (var x = 0; x < listOfMembers.length; x++) {
      message.channel.send("ready")
      if (Date.now() >= memberstats[listOfMembers[x]].stockSellTime) {
        memberstats[listOfMembers].balance += memberstats[listOfMembers[x]].stockPendingSell.shallot * memberstats[listOfMembers[x]].currentSellPrice[1]
        memberstats[listOfMembers].balance += memberstats[listOfMembers[x]].stockPendingSell.nuts * memberstats[listOfMembers[x]].currentSellPrice[0]
        memberstats[listOfMembers].stockPendingSell = {
          shallot: 0,
          nuts: 0
        }
        
        memberstats[listOfMembers].stockSellTime = {
          shallot: 0,
          nuts: 0
        }

      }
    }
    
  }, 5000)
})
keepAlive()























bot.login(process.env.sucknutsyournotseeingthetokenhaha)