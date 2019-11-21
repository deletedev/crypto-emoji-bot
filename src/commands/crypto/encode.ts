import { ContextMessageUpdate, Markup as m } from 'telegraf'
import { KeyModel } from '../../models/Key'
import { EncodeToEmoji } from '../../helpers/crypto'

export async function encodeAction(ctx: ContextMessageUpdate) {
  const message = ctx.callbackQuery.message
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
  const encrypted = await EncodeToEmoji(message.text, key.key)

  if (encrypted.length > 1800) {
    ctx.deleteMessage()
    return await ctx.reply(ctx.i18n.t('too_many_emoji'))
  }

  return await ctx.editMessageText(encrypted)
}
