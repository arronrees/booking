import { Request, Response } from 'express';
import { prismaDB } from '..';
import checkValidUuid from '../utils/checkValidUuid';

export async function getSingleUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    if (!checkValidUuid(userId)) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = await prismaDB.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err,
    });
  }
}
