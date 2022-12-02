import { validate as uuidValidate } from 'uuid';

export default function checkValidUuid(id: string) {
  return uuidValidate(id);
}
