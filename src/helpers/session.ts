import { SessionModel } from '../models/Session'
import { ContextMessageUpdate } from 'telegraf'

export async function saveSession() {
  let ctx = this
  if (!ctx.chat || !ctx.from) {
    return
  }

  const key = `${ctx.chat.id}:${ctx.from.id}`
  const SessionInfo = await SessionModel.findOne({ key })
  const data = ctx['session'] ?? { stage: 0 }
  if (SessionInfo) {
    SessionInfo.data = data
    await SessionInfo.save()
    return
  }
  SessionModel.create({ key, data })
}
