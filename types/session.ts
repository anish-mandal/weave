import type { Types } from "mongoose"

export default interface ISession {
  userId: Types.ObjectId,
  prefix: string,
  secretHash: string,
  expiresAt: Date,
  revokedAt: Date
}
