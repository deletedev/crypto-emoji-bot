// Dependencies
import { ContextMessageUpdate, Extra } from 'telegraf'
import { ExtraEditMessage } from 'telegraf/typings/telegram-types'
import { KeyModel } from '../../../../models/Key'

export async function keyAddingInputName(ctx: ContextMessageUpdate, next) {
  if (ctx?.session?.stage != 7) {
    await next()
    return
  }

  if (ctx.keys.length > 9) {
    return await ctx.reply(ctx.i18n.t('too_many_keys_string'))
  }
  const name = ctx.message.text
  if (name.length > 48) {
    return await ctx.reply(ctx.i18n.t('length_too_long_48'))
  }
  const key = ctx.session.key
  try {
    let newkey = await KeyModel.create({
      key,
      name,
      user: ctx.dbuser._id.toString(),
    })

    ctx.reply(
      ctx.i18n.t('manage_key', { name, key: newkey.key }),
      Extra.HTML(true) as ExtraEditMessage,
    )
  } catch {
    ctx.reply(ctx.i18n.t('key_exists'))
  } finally {
    ctx.session.stage = 1
    return await ctx.saveSession()
  }
}
