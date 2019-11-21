import { deleteKey } from './modules/delete'
import { manageKey } from './modules/manage'
import { newKey } from './modules/newKey'
import { inlineKeyboardAllKeys } from '../../crypto'

export function setupManagementActions(bot) {
  // Delete Key Action
  bot.action(/^del_/, deleteKey)

  // Back to key list Action
  bot.action(/^back/, async ctx => {
    ctx.editMessageText(`${ctx.i18n.t('select_key')}`, {
      reply_markup: await inlineKeyboardAllKeys(ctx),
    })
  })

  // Generate new Key action
  bot.action(/^generate_key/, async ctx => {
    ctx.session.stage = 5
    await ctx.saveSession()
    await ctx.deleteMessage()
    await ctx.reply(ctx.i18n.t('new_key_input'))
  })

  // Add new Key action
  bot.action(/^add_key/, async ctx => {
    ctx.session.stage = 6
    await ctx.saveSession()
    await ctx.deleteMessage()
    await ctx.reply(ctx.i18n.t('key_input'))
  })

  // New Key adding choice action
  bot.action(/^new_key/, newKey)

  // Key management action
  bot.action(/^mng_/, manageKey)

  // Key change name action TODO
  bot.action(/^chg_/, async ctx => {
    ctx.answerCbQuery('TODO', true)
  })
}
