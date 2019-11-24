// Dependencies
import { ContextMessageUpdate, Telegraf } from 'telegraf'
import { UserModel } from '../models/User'
const TelegrafBot = require('telegraf')

export const bot = new TelegrafBot(process.env.TOKEN) as Telegraf<
  ContextMessageUpdate
>

bot.telegram.getMe().then(async botInfo => {
  const anybot = bot as any
  anybot.options.username = botInfo.username
  const Users = await UserModel.find().count()
  // Change UserID or remove IT
  bot.telegram.sendMessage(576942226, `Users: ${Users}`)
})
