import { ContextMessageUpdate } from 'telegraf'
import { SessionModel } from '../models/Session'
import { saveSession } from '../helpers/session'

export async function sessionMiddleware(
  ctx: ContextMessageUpdate,
  next: () => any,
) {
  // Setup Defaults
  ctx.session = { stage: 0, name: '', key: '' }
  if (!ctx.chat || !ctx.from) {
    await next()
    return
  }

  const key = `${ctx.chat.id}:${ctx.from.id}`
  const SessionInfo = await SessionModel.findOne({ key })

  if (SessionInfo?.data) {
    ;(ctx as any).session = SessionInfo?.data
  }
  // And then just await ctx.saveSession() where necessary
  ctx.saveSession = saveSession
  await next()
}
