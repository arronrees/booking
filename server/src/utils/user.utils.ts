import { User } from '@prisma/client';
import { prismaDB } from '..';
import checkValidUuid from './checkValidUuid';

type FieldToCheck = 'id' | 'email';

export async function checkIfUserExists(
  fieldToCheck: FieldToCheck,
  fieldValue: string
): Promise<{
  userExists: boolean;
  userData: null | User;
}> {
  let userExists = false;
  let userData = null;

  switch (fieldToCheck) {
    case 'id':
      if (!checkValidUuid(fieldValue)) {
        return { userExists, userData };
      }

      const userFoundById = await prismaDB.user.findUnique({
        where: {
          id: fieldValue,
        },
      });

      if (userFoundById) {
        userExists = true;
        userData = userFoundById;
      }

      break;

    case 'email':
      const userFoundByEmail = await prismaDB.user.findUnique({
        where: {
          email: fieldValue,
        },
      });

      if (userFoundByEmail) {
        userExists = true;
        userData = userFoundByEmail;
      }

      break;

    default:
      break;
  }

  return { userExists, userData };
}
