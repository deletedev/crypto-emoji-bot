// Config dotenv
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
// Dependencies
import { bot } from './helpers/bot'
import { checkTime } from './middlewares/checkTime'
import { setupCipher } from './commands/crypto'
import { setupI18N } from './helpers/i18n'
import { setupStart } from './commands/main'
import { attachUser } from './middlewares/attachUser'

// Check time
bot.use(checkTime)
// Attach user
bot.use(attachUser)
// Setup localization
setupI18N(bot)
// Setup commands
setupStart(bot)
setupCipher(bot)
// Start bot
bot.startPolling()

// Log
console.info('Bot is up and running')
