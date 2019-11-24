// Dependencies
import { ContextMessageUpdate, Telegraf } from 'telegraf'
import { UserModel } from '../models/User'
import { KeyModel } from '../models/Key'
const TelegrafBot = require('telegraf')

export const bot = new TelegrafBot(process.env.TOKEN) as Telegraf<
  ContextMessageUpdate
>

bot.telegram.getMe().then(async botInfo => {
  const anybot = bot as any
  anybot.options.username = botInfo.username
  // Users count
  const Users = await UserModel.find().count()
  // Keys count
  const Keys = await KeyModel.find().count()
  // Change UserID or remove IT
  bot.telegram.sendMessage(Number(process.env.OWNER), `Users: ${Users}\nKeys: ${Keys}`)
})
