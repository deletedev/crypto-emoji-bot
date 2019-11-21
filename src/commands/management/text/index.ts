import { keyGeneration } from './modules/keyGeneration'
import { keyAddingInputKey } from './modules/keyAddingInputKey'
import { keyAddingInputName } from './modules/keyAddingInputName'

export function setupManagementTexts(bot) {
  // Key generation after name input
  bot.on('text', keyGeneration)
  // Key adding key input
  bot.on('text', keyAddingInputKey)
  // Key name input and adding
  bot.on('text', keyAddingInputName)
}
