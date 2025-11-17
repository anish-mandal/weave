import { createSession, revokeSession, validateSession } from "./models/session";
import { userGetById, userGetByEmail, userGetByUserName, createUser, userConfirm } from "./models/user";

const db = {
  user: {
    create: createUser,
    getById: userGetById,
    getByEmail: userGetByEmail,
    getByUserName: userGetByUserName,
    confirm: userConfirm
  },
  session: {
    create: createSession,
    validate: validateSession,
    revoke: revokeSession
  }
}

export default db;
