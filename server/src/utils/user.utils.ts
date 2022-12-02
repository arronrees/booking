import { prismaDB } from '..';
import checkValidUuid from './checkValidUuid';

type FieldToCheck = 'id' | 'email';

export async function checkIfUserExists(
  fieldToCheck: FieldToCheck,
  fieldValue: string
) {
  switch (fieldToCheck) {
    case 'id':
      if (!checkValidUuid(fieldValue)) return false;

      const userFoundById = await prismaDB.user.findUnique({
        where: {
          id: fieldValue,
        },
      });

      if (userFoundById) return true;

      break;

    case 'email':
      const userFoundByEmail = await prismaDB.user.findUnique({
        where: {
          email: fieldValue,
        },
      });

      if (userFoundByEmail) return true;

      break;

    default:
      break;
  }

  return false;
}
