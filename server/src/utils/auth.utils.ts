import { genSalt, hash, compare } from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt();

  const hashedPassword = await hash(password, salt);

  return hashedPassword;
}

export async function comparePassword(
  inputPassword: string,
  passwordToCompare: string
): Promise<boolean> {
  const passwordsMatch = await compare(inputPassword, passwordToCompare);

  return passwordsMatch;
}
