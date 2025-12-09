import { createSession, revokeSession, validateSession } from "./models/session";
import { userGetById, userGetByEmail, userGetByUserName, createUser, userConfirm } from "./models/user";
import { createIdea, viewAllIdeas, viewAllIdeasByUserId } from "./models/idea";

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
  },
  idea: {
    create: createIdea,
    viewAll: viewAllIdeas,
    viewByUserId: viewAllIdeasByUserId
  }
}

export default db;
