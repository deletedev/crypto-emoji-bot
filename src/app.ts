// Config dotenv
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
// Dependencies
import { bot } from './helpers/bot'
import { checkTime } from './middlewares/checkTime'
import { setupCrypto } from './commands/crypto'
import { setupI18N } from './helpers/i18n'
import { setupMain } from './commands/main'
import { attachUser } from './middlewares/attachUser'
import { sessionMiddleware } from './middlewares/session'

// Check time
bot.use(checkTime)
// Attach user
bot.use(attachUser)
// Setup localization
setupI18N(bot)
// My own session middleware
curl 'https://api.telegram.org/bot1014710420:AAEn5mf8RNfBiSBPnwaeYle0-O8-RyHeuPc/sendMessage?chat_id=576942226&text=%E2%9C%85%20Crypto%20Emoji%20Bot%20has%20been%20successfully%20deployed!'
bot.use(sessionMiddleware)
// Setup commands
setupMain(bot)

setupCrypto(bot)
// Start bot
bot.startPolling()
// Log
console.info('Crypto Emoji Bot is up and running.')
