const ecoji = require('ecoji-js')

import * as crypto from 'crypto'
import * as _ from 'lodash'

export async function GenerateRandomKey() {
  const CRYPTED_ECOJI = await ecoji.encode(
    crypto
      .randomBytes(40)
      .toString('hex')
      .slice(0, 32),
  )
  return CRYPTED_ECOJI as string
}

export async function encrypt(text: string, key: string) {
  key = ecoji.decode(key)
  let iv = crypto.randomBytes(16)
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv)
  let encrypted = cipher.update(text)

  encrypted = Buffer.concat([encrypted, cipher.final()])
  const toemoji = iv.toString('hex') + ':' + encrypted.toString('hex')
  return await ecoji.encode(toemoji)
}

export async function decrypt(text: string, key: string) {
  const replaceshit = _.replace(text, /(\u2642|\u2640|\u200D|\uFE0F)/g, '')
  text = await ecoji.decode(replaceshit)
  key = await ecoji.decode(key)
  let textParts = text.split(':')
  let iv = Buffer.from(textParts.shift(), 'hex')

  let encryptedText = Buffer.from(textParts.join(':'), 'hex')
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString()
}

export async function decode(emoji: string) {
  let result: any
  try {
    const replaceshit = _.replace(emoji, /(\u2642|\u2640|\u200D|\uFE0F)/g, '')
    result = await ecoji.decode(replaceshit)
  } catch (e) {
    result = false
  } finally {
    return result
  }
}
