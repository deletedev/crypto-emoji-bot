import { ContextMessageUpdate, Markup as m } from 'telegraf'
import { IsEncoded } from '../../helpers/crypto'
import { KeyBoard } from '../crypto'

export async function textTrigger(ctx: ContextMessageUpdate) {
  if (ctx?.session?.stage != 1) {
    return
  }
  if (ctx?.keys?.length < 1) {
    return await ctx.reply(ctx.i18n.t('no_keys'), KeyBoard(ctx))
  }

  const encrypted = await IsEncoded(ctx.message.text)
  if (encrypted) {
    return await ctx.reply(ctx.message.text, {
      reply_markup: await inlineKeyboardDecryptKeys(ctx),
    })
  }

  return await ctx.reply(ctx.message.text, {
    reply_markup: await inlineKeyboardEncryptString(ctx),
  })
}

// TODO: Refactoring
async function inlineKeyboardEncryptString(ctx: ContextMessageUpdate) {
  const keyboardresult = [
    [m.callbackButton(ctx.i18n.t('encode_emoji'), 'nothing')],
    [m.callbackButton(ctx.i18n.t('select_key'), 'nothing')],
  ]
  await Promise.all(
    ctx.keys.map((i, k) => {
      keyboardresult.push([
        m.callbackButton(`${i.name} 🔑`, `enc_${i._id.toString()}`),
      ])
    }),
  )
  return m.inlineKeyboard(keyboardresult)
}

async function inlineKeyboardDecryptKeys(ctx: ContextMessageUpdate) {
  let result: string = ''
  const keyboardresult = [
    [m.callbackButton(ctx.i18n.t('decode_emoji'), 'nothing')],
    [m.callbackButton(ctx.i18n.t('select_key'), 'nothing')],
  ]
  await Promise.all(
    ctx.keys.map((i, k) => {
      result = `${result}${k + 1}. ${i.name} `
      keyboardresult.push([
        m.callbackButton(`${k + 1}. ${i.name}`, `dec_${i._id.toString()}`),
      ])
    }),
  )
  keyboardresult.push([
    m.callbackButton(ctx.i18n.t('generate_new_key'), 'new_key'),
  ])
  return m.inlineKeyboard(keyboardresult)
}
