// Dependencies
import { ContextMessageUpdate, Markup as m } from 'telegraf'

export async function newKey(ctx: ContextMessageUpdate) {
  ctx.session.stage = 2
  await ctx.saveSession()
  await ctx.answerCbQuery()

  const keyboard = m.inlineKeyboard([
    [m.callbackButton(ctx.i18n.t('add_key'), `add_key`)],
    [m.callbackButton(ctx.i18n.t('generate_key'), `generate_key`)],
  ])

  await ctx.reply(ctx.i18n.t('select_adding_type_string'), {
    reply_markup: keyboard,
  })
}
