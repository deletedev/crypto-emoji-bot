// Dependencies
import { KeyModel } from '../../../../models/Key'
import { ContextMessageUpdate, Markup as m } from 'telegraf'

export async function manageKey(ctx: ContextMessageUpdate) {
  const data = ctx.callbackQuery.data
  const keyid = data.slice(4)
  await ctx.answerCbQuery()
  const key = await KeyModel.findById(keyid)
  if (!key) {
    return await ctx.reply('key_not_exists')
  }
  if (key.user.toString() !== ctx.dbuser._id.toString()) {
    return ctx.reply('403 Error')
  }

  const keyboard = m.inlineKeyboard([
    [m.callbackButton(ctx.i18n.t('change_name'), `chg_${key}`)],
    [m.callbackButton(ctx.i18n.t('delete_key'), `del_${key}`)],
    [m.callbackButton(ctx.i18n.t('back'), 'back')],
  ])

  return await ctx.editMessageText(
    ctx.i18n.t('manage_key', { key: key.key, name: key.name }),
    {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    },
  )
}
