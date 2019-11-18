// Dependencies
import { prop, index, Ref, getModelForClass } from '@typegoose/typegoose'
import { User } from './User'

@index({ user: 1, key: 1 }, { unique: true })
export class Key {
  @prop({ required: true, ref: 'User' })
  user: Ref<User>

  @prop({ required: true })
  key: string

  @prop({ required: true })
  name: string
}

// Get User model
export const KeyModel = getModelForClass(Key, {
  schemaOptions: { timestamps: true },
})
