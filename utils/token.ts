import jwt from "jsonwebtoken";

if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables.");
}

const SECRET = process.env.ACCESS_TOKEN_SECRET;

export function generateAccessToken(userId: string) {
  return jwt.sign(
    {
      sub: userId,
      type: "access"
    },
    SECRET,
    { expiresIn: "15m" }
  );
}

export function validateAccessToken(token: string) {
  try {
    const payload = jwt.verify(token, SECRET) as {
      sub: string;
      type: "access";
      iat: number;
      exp: number;
    };

    if (payload.type !== "access") return null;

    return payload;
  } catch (e) {
    return null;
  }
}
