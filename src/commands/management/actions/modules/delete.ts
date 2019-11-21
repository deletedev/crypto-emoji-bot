// Dependencies
import { KeyModel } from '../../../../models/Key'
import { ContextMessageUpdate } from 'telegraf'
import { inlineKeyboardAllKeys } from '../../../crypto'

export async function deleteKey(ctx: ContextMessageUpdate) {
  const key = ctx.callbackQuery.data.slice(4)

  const delkey = await KeyModel.findById(key)
  if (delkey.user.toString() !== ctx.dbuser._id.toString()) {
    return ctx.answerCbQuery('403 Error', true)
  }
  await delkey.remove()

  ctx.keys = ctx.keys.filter(v => {
    return v._id.toString() != key
  })
  ctx.editMessageText(`${ctx.i18n.t('select_key')}`, {
    reply_markup: await inlineKeyboardAllKeys(ctx),
  })
  await ctx.answerCbQuery()
}
