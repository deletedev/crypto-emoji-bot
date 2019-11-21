// Dependencies
import { Telegraf, ContextMessageUpdate, Markup as m, Extra } from 'telegraf'
import { Key, KeyModel } from '../models/Key'
import { encrypt, decrypt, decode } from '../helpers/crypto'
import { ExtraEditMessage } from 'telegraf/typings/telegram-types'
import { saveSession } from '../helpers/session'
import { GenerateRandomKey } from '../helpers/crypto'
const { match } = require('telegraf-i18n')
import * as _ from 'lodash'

export function setupCrypto(bot: Telegraf<ContextMessageUpdate>) {
  bot.hears(match('encode'), async ctx => {
    ctx.session.stage = 1
    await ctx.saveSession()
    return ctx.reply(ctx.i18n.t('just_send_message'), KeyBoard(ctx, true, true))
  })

  bot.hears(match('keys'), async ctx => {
    ctx.session.stage = 1
    await ctx.saveSession()
    await ctx.reply(ctx.i18n.t('loading_string'), KeyBoard(ctx, true, true))

    return await ctx.reply(`${ctx.i18n.t('select_key')}`, {
      reply_markup: await inlineKeyboardAllKeys(ctx),
    })
  })

  bot.action('nothing', async ctx => {
    ctx.answerCbQuery()
  })

  bot.action(/^enc_/, async ctx => {
    const message = ctx.callbackQuery.message
    const data = ctx.callbackQuery.data

    const keyid = data.slice(4)
    await ctx.answerCbQuery()
    const key = await KeyModel.findById(keyid)
    if (!key) {
      return await ctx.reply('key_not_exists')
    }
    const encrypted = await encrypt(message.text, key.key)

    if (encrypted.length > 1800) {
      ctx.deleteMessage()
      return await ctx.reply(ctx.i18n.t('too_many_emoji'))
    }

    return await ctx.editMessageText(encrypted)
  })

  bot.action(/^mng_/, async ctx => {
    const message = ctx.callbackQuery.message
    const data = ctx.callbackQuery.data

    const keyid = data.slice(4)
    await ctx.answerCbQuery()
    const key = await KeyModel.findById(keyid)
    if (!key) {
      return await ctx.reply('key_not_exists')
    }

    return await ctx.editMessageText(
      ctx.i18n.t('manage_key', { key: key.key, name: key.name }),
      {
        parse_mode: 'HTML',
        reply_markup: inlineKeyboardManageKey(ctx, key._id.toString()),
      },
    )
  })

  bot.action(/^chg_/, async ctx => {
    ctx.answerCbQuery('TODO', true)
  })

  bot.action(/^generate_key/, async ctx => {
    ctx.session.stage = 5
    await ctx.saveSession()
    await ctx.deleteMessage()
    await ctx.reply(ctx.i18n.t('new_key_input'))
  })

  bot.action(/^add_key/, async ctx => {
    ctx.session.stage = 6
    await ctx.saveSession()
    await ctx.deleteMessage()
    await ctx.reply(ctx.i18n.t('key_input'))
  })

  bot.action(/^new_key/, async ctx => {
    ctx.session.stage = 2
    await ctx.saveSession()
    await ctx.answerCbQuery()
    await ctx.reply(ctx.i18n.t('select_adding_type_string'), {
      reply_markup: inlineKeyboardKey(ctx),
    })
  })

  bot.on('text', async (ctx, next) => {
    if (ctx?.session?.stage != 5) {
      await next()
      return
    }
    if (ctx.keys.length > 9) {
      return await ctx.reply('too_many_keys_string')
    }
    const name = ctx.message.text
    if (name.length > 48) {
      return await ctx.reply('length_too_long_48')
    }
    const key = await GenerateRandomKey()
    let newkey = await KeyModel.create({
      key,
      name,
      user: ctx.dbuser._id.toString(),
    })

    ctx.reply(
      ctx.i18n.t('manage_key', { name, key: newkey.key }),
      Extra.HTML(true) as ExtraEditMessage,
    )

    ctx.session.stage = 1
    return await ctx.saveSession()
  })

  bot.on('text', async (ctx, next) => {
    if (ctx?.session?.stage != 6) {
      await next()
      return
    }
    if (ctx.keys.length > 9) {
      return await ctx.reply(ctx.i18n.t('too_many_keys_string'))
    }
    const key = _.replace(
      ctx.message.text,
      /(\u2642|\u2640|\u200D|\uFE0F)/g,
      '',
    )
    if (key.length > 300) {
      return await ctx.reply(ctx.i18n.t('too_many_keys_string'))
    }
    // TODO: VALIDATION
    ctx.reply(ctx.i18n.t('name_input'))
    ctx.session.key = key
    ctx.session.stage = 7
    return await ctx.saveSession()
  })

  bot.on('text', async (ctx, next) => {
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
    let newkey = await KeyModel.create({
      key,
      name,
      user: ctx.dbuser._id.toString(),
    })

    ctx.reply(
      ctx.i18n.t('manage_key', { name, key: newkey.key }),
      Extra.HTML(true) as ExtraEditMessage,
    )

    ctx.session.stage = 1
    return await ctx.saveSession()
  })

  bot.action(/^del_/, async ctx => {
    ctx.answerCbQuery('TODO', true)
  })

  bot.action(/^back/, async ctx => {
    ctx.editMessageText(`${ctx.i18n.t('select_key')}`, {
      reply_markup: await inlineKeyboardAllKeys(ctx),
    })
  })

  bot.action(/^dec_/, async ctx => {
    const message = ctx.callbackQuery.message
    const data = ctx.callbackQuery.data

    const keyid = data.slice(4)
    try {
      const key = await KeyModel.findById(keyid)

      const decrypted = await decrypt(message.text, key.key)

      if (decrypted.length > 1800) {
        ctx.deleteMessage()
        return await ctx.reply(ctx.i18n.t('too_many_emoji'))
      }

      return await ctx.editMessageText(decrypted)
    } catch {
      return await ctx.answerCbQuery(ctx.i18n.t('decode_error'), true)
    }
  })

  bot.on('text', async ctx => {
    if (ctx?.session?.stage != 1) {
      return
    }
    if (ctx?.keys?.length < 1) {
      return await ctx.reply(ctx.i18n.t('no_keys'), KeyBoard(ctx, false, true))
    }

    const encrypted = await decode(ctx.message.text)
    if (encrypted) {
      return await ctx.reply(ctx.message.text, {
        reply_markup: await inlineKeyboardDecryptKeys(ctx),
      })
    }

    return await ctx.reply(ctx.message.text, {
      reply_markup: await inlineKeyboardEncryptString(ctx),
    })
  })
}

export function KeyBoard(ctx: any, encrypt?: boolean, keys?: boolean) {
  const result = []
  if (!encrypt && !keys) {
    result.push(ctx.i18n.t('encode'), ctx.i18n.t('keys'))
  }
  if (encrypt) {
    result.push(ctx.i18n.t('encode'))
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
        m.callbackButton(`${k + 1}. ${i.name}`, `mng_${i._id.toString()}`),
      ])
    }),
  )
  keyboardresult.push([
    m.callbackButton(ctx.i18n.t('generate_new_key'), 'new_key'),
  ])
  return m.inlineKeyboard(keyboardresult)
}

async function inlineKeyboardDecryptKeys(ctx: any) {
  let result: string = ''
  const keyboardresult = []
  keyboardresult.push([m.callbackButton(ctx.i18n.t('decode_emoji'), 'nothing')])
  keyboardresult.push([m.callbackButton(ctx.i18n.t('select_key'), 'nothing')])
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

async function inlineKeyboardEncryptString(ctx: any) {
  const keyboardresult = []
  keyboardresult.push([m.callbackButton(ctx.i18n.t('encode_emoji'), 'nothing')])
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

function inlineKeyboardManageKey(ctx: any, key: string) {
  return m.inlineKeyboard([
    [m.callbackButton(ctx.i18n.t('change_name'), `chg_${key}`)],
    [m.callbackButton(ctx.i18n.t('delete_key'), `del_${key}`)],
    [m.callbackButton(ctx.i18n.t('back'), 'back')],
  ])
}

function inlineKeyboardKey(ctx: any) {
  return m.inlineKeyboard([
    [m.callbackButton(ctx.i18n.t('add_key'), `add_key`)],
    [m.callbackButton(ctx.i18n.t('generate_key'), `generate_key`)],
  ])
}
