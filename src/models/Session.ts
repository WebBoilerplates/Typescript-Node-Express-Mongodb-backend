import mongoose, { model, Schema, Document, Model } from 'mongoose';
import Authorization from '@util/Authorization';
import error from '@error';
import jwt from 'jsonwebtoken';
import Assets from '@util/Assets';

export interface SessionInterface {
  jwtid: string;
  user: Schema.Types.ObjectId;
  expire: number;
}

const SessionSchema: Schema = new Schema({
  jwtid: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  expire: { type: Number, required: true },
});

export interface SessionDocument extends Document, SessionInterface {
  registerToken(token: string): Promise<void>;
}

SessionSchema.methods.registerToken = async function (
  token: string,
): Promise<void> {
  await Authorization.token.verify.manual(token, 'refresh', true);
  try {
    const tokenValue: any = jwt.decode(token);
    if (!tokenValue._id || !tokenValue.exp || !tokenValue.jwtid) {
      throw error.authorization.tokeninvalid();
    }
    await SessionModel.create({
      jwtid: tokenValue.jwtid,
      user: tokenValue._id,
      expire: tokenValue.exp,
    });
  } catch (e) {
    throw error.db.create('Session');
  }
};

const SessionModel = model<SessionDocument>('Session', SessionSchema);

export default SessionModel;
