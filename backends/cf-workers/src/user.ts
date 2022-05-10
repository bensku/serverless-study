import * as jose from 'jose';
import * as bcrypt from 'bcryptjs';

interface UserDetails {
  pwHash: string;
}

export async function createAccount(jwtSecret: Uint8Array, users: KVNamespace,
    user: string, password: string): Promise<string | null> {
  const existing = await users.get(user, 'json');
  if (existing) {
    return null;
  }
  const newDetails: UserDetails = {
    pwHash: await bcrypt.hash(password, await bcrypt.genSalt())
  }
  await users.put(user, JSON.stringify(newDetails));
  return login(jwtSecret, users, user, password);
}

export async function login(jwtSecret: Uint8Array, users: KVNamespace,
    user: string, password: string): Promise<string | null> {
  // Validate credentials
  const userDetails: UserDetails | null = await users.get(user, 'json');
  if (!userDetails) {
    return null;
  }

  const match = await bcrypt.compare(password, userDetails.pwHash);
  if (!match) {
    return null;
  }

  // Sign a JWT token
  return await new jose.SignJWT({})
    .setProtectedHeader({alg: 'HS512'})
    .setSubject(user)
    .sign(jwtSecret);
}

export async function validateLogin(jwtSecret: Uint8Array, token: string | null): Promise<string> {
  if (!token) {
    throw new Error();
  }
  const result = await jose.jwtVerify(token, jwtSecret, {
    algorithms: ['HS512']
  });
  const user = result.payload.sub;
  if (!user) {
    throw new Error();
  }
  return user;
}
