// Dependencies
import { Telegraf, ContextMessageUpdate, Markup as m, Extra } from 'telegraf'
import { Key, KeyModel } from '../models/Key'
import { encrypt, decrypt } from '../helpers/crypto'
const { match } = require('telegraf-i18n')

export function setupCipher(bot: Telegraf<ContextMessageUpdate>) {
  bot.hears(match('encrypt'), ctx => {
    ctx.reply(ctx.i18n.t('just_send_message'))
  })

  bot.action('nothing', async ctx => {
    ctx.answerCbQuery()
  })

  bot.action(/^enc_/, async ctx => {
    const message = ctx.callbackQuery.message
    const data = ctx.callbackQuery.data

    const keyid = data.slice(4)

    const key = await KeyModel.findById(keyid)
    if (!key) {
      return await ctx.reply('key_not_exists')
    }
    const encrypted = encrypt(message.text, key.key)

    if (encrypted.length > 1800) {
      ctx.deleteMessage()
      return await ctx.reply(ctx.i18n.t('too_many_emoji'))
    }

    return await ctx.telegram.editMessageText(
      message.chat.id,
      message.message_id,
      undefined,
      encrypted,
    )
  })

  bot.hears(match('keys'), async ctx => {
    await ctx.reply(ctx.i18n.t('loading_string'), KeyBoard(ctx, true, false))

    await ctx.reply(`${ctx.i18n.t('select_key')}`, {
      reply_markup: await inlineKeyboardAllKeys(ctx),
    })
  })

  bot.on('text', async ctx => {
    if (ctx?.keys?.length < 1) {
      return await ctx.reply(ctx.i18n.t('no_keys'), KeyBoard(ctx, false, true))
    }
    return await ctx.reply(ctx.message.text, {
      reply_markup: await inlineKeyboardEncryptString(ctx),
    })
  })
}

function KeyBoard(ctx: any, encrypt?: boolean, keys?: boolean) {
  const result = []
  if (!encrypt && !keys) {
    result.push(ctx.i18n.t('encrypt'), ctx.i18n.t('keys'))
  }
  if (encrypt) {
    result.push(ctx.i18n.t('encrypt'))
  }
  if (keys) {
    result.push(ctx.i18n.t('keys'))
  }
  return m
    .keyboard([result])
    .oneTime()
    .resize()
    .extra()
}

async function inlineKeyboardAllKeys(ctx: any) {
  let result: string = ''
  const keyboardresult = []
  await Promise.all(
    ctx.keys.map((i, k) => {
      result = `${result}${k + 1}. ${i.name} `
      keyboardresult.push([
        m.callbackButton(`${k + 1}. ${i.name}`, i._id.toString()),
      ])
    }),
  )
  keyboardresult.push([
    m.callbackButton(ctx.i18n.t('generate_new_key'), 'new_key'),
  ])
  return m.inlineKeyboard(keyboardresult)
}

async function inlineKeyboardEncryptString(ctx: any) {
  const keyboardresult = []
  keyboardresult.push([m.callbackButton(ctx.i18n.t('select_key'), 'nothing')])
  await Promise.all(
    ctx.keys.map((i, k) => {
      keyboardresult.push([
        m.callbackButton(`${i.name} 🔑`, `enc_${i._id.toString()}`),
      ])
    }),
  )
  return m.inlineKeyboard(keyboardresult)
}
