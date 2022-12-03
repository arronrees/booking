import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../../utils/iron/withSession';

export default withSessionRoute(signOutUser);

async function signOutUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    req.session.destroy();
    res.status(200).json({ data: 'Logout success' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong, please try again' });
  }
}
