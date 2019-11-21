import { ContextMessageUpdate, Markup as m } from 'telegraf'
import { KeyModel } from '../../models/Key'
import { DecodeToString } from '../../helpers/crypto'

export async function decodeAction(ctx: ContextMessageUpdate) {
  const message = ctx.callbackQuery.message
  const data = ctx.callbackQuery.data

  const keyid = data.slice(4)
  try {
    const key = await KeyModel.findById(keyid)
    if (key.user.toString() !== ctx.dbuser._id.toString()) {
      return ctx.reply('403 Error')
    }
    const decrypted = await DecodeToString(message.text, key.key)

    if (decrypted.length > 1800) {
      ctx.deleteMessage()
      return await ctx.reply(ctx.i18n.t('too_many_emoji'))
    }

    return await ctx.editMessageText(decrypted)
  } catch {
    return await ctx.answerCbQuery(ctx.i18n.t('decode_error'), true)
  }
}
