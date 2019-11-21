// Dependencies
import { findUser } from '../models'
import { KeyModel, Key } from '../models/Key'
import { ContextMessageUpdate } from 'telegraf'
import { DocumentType } from '@typegoose/typegoose'

export async function attachUser(ctx: ContextMessageUpdate, next) {
  const dbuser = await findUser(ctx.from.id)
  const keys = (await KeyModel.find({ user: dbuser })) as DocumentType<Key>[]
  ctx.dbuser = dbuser
  ctx.keys = keys
  await next()
}
