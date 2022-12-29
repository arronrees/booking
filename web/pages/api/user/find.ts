import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../../utils/iron/withSession';

export default withSessionRoute(findUserSession);

async function findUserSession(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = req.session.user;

    if (!user) {
      req.session.destroy();
      return res.status(400).json(null);
    }

    res.status(200).json(user);
  } catch (err) {
    console.log(err);

    req.session.destroy();

    return res.status(500).json(null);
  }
}
