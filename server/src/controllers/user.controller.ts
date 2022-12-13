import { Request, Response } from 'express';
import { prismaDB } from '..';
import checkValidUuid from '../utils/checkValidUuid';

export async function getSingleUserController(req: Request, res: Response) {
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

export async function updateUserAddressController(req: Request, res: Response) {
  try {
    const { addressId } = req.params;
    const { address } = req.body;

    if (!checkValidUuid(addressId)) {
      return res
        .status(404)
        .json({ success: false, error: 'Address not found' });
    }

    const updatedAddress = await prismaDB.address.update({
      where: { id: addressId },
      data: {
        ...address,
      },
    });

    res.status(200).json({ success: true, data: updatedAddress });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err,
    });
  }
}

export async function updateUserController(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { user } = req.body;

    if (!checkValidUuid(userId)) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const updatedUser = await prismaDB.user.update({
      where: { id: userId },
      data: {
        ...user,
      },
    });

    res.status(200).json({ success: true, data: updatedUser });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err,
    });
  }
}
