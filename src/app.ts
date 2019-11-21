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
bot.use(sessionMiddleware)
// Setup commands
setupMain(bot)

setupCrypto(bot)
// Start bot
bot.startPolling()
// Log
console.info('Bot is up and running')
