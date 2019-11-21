// Dependencies
import { prop, index, Ref, getModelForClass } from '@typegoose/typegoose'

@index({ key: 1 }, { unique: true })
export class Session {
  @prop({ required: true })
  public key: string

  @prop({ required: true, default: {} })
  public data: object
}

// Get User model
export const SessionModel = getModelForClass(Session, {
  schemaOptions: { timestamps: true },
})
