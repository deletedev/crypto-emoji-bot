// Dependencies
import { Telegraf, ContextMessageUpdate, Markup as m } from 'telegraf'
const { match } = require('telegraf-i18n')
import * as _ from 'lodash'
import { encodeAction } from './crypto/encode'
import { decodeAction } from './crypto/decode'
import { textTrigger } from './crypto/textTrigger'
import { setupManagement } from './management'

export function setupCrypto(bot: Telegraf<ContextMessageUpdate>) {
  // Setup key management
  setupManagement(bot)
  // Crypto
  bot.hears(match('encode'), async ctx => {
    ctx.session.stage = 1
    await ctx.saveSession()
    return ctx.reply(ctx.i18n.t('just_send_message'), KeyBoard(ctx))
  })

  bot.hears(match('keys'), async ctx => {
    ctx.session.stage = 1
    await ctx.saveSession()
    await ctx.reply(ctx.i18n.t('loading_string'), KeyBoard(ctx))

    return await ctx.reply(`${ctx.i18n.t('select_key')}`, {
      reply_markup: await inlineKeyboardAllKeys(ctx),
    })
  })

  // For non-clickable buttons
  bot.action('nothing', async ctx => {
    ctx.answerCbQuery()
  })

  // Encode text string with key
  bot.action(/^enc_/, encodeAction)
  // Decode text string with key
  bot.action(/^dec_/, decodeAction)

  bot.on('text', textTrigger)
}

// TODO: Refactoring
export function KeyBoard(ctx: ContextMessageUpdate) {
  const result = [ctx.i18n.t('encode'), ctx.i18n.t('keys')]

  return m
    .keyboard([result])
    .oneTime()
    .resize()
    .extra()
}

export async function inlineKeyboardAllKeys(ctx: ContextMessageUpdate) {
  let result: string = ''
  const keyboardresult = []
  await Promise.all(
    ctx.keys.map((i, k) => {
      result = `${result}${k + 1}. ${i.name} `
      keyboardresult.push([
        m.callbackButton(`${k + 1}. ${i.name}`, `mng_${i._id.toString()}`),
      ])
    }),
  )
  keyboardresult.push([
    m.callbackButton(ctx.i18n.t('generate_new_key'), 'new_key'),
  ])
  return m.inlineKeyboard(keyboardresult)
}
