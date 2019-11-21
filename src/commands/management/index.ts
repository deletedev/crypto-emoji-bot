// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { setupManagementActions } from './actions'
import { setupManagementTexts } from './text'
export function setupManagement(bot: Telegraf<ContextMessageUpdate>) {
  // Setup actions
  setupManagementActions(bot)
  // Setup text triggers
  setupManagementTexts(bot)
}
