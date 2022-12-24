import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../../utils/iron/withSession';

export default withSessionRoute(updateUserSession);

async function updateUserSession(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = req.session.user;

    if (!user) {
      req.session.destroy();
      return res.status(400).json({ error: 'No user in session' });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`
    );

    const data = await response.json();

    if (response.ok) {
      req.session.user = data.data;
      await req.session.save();
    }

    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    req.session.destroy();

    return res
      .status(500)
      .json({ error: 'Something went wrong, please try again' });
  }
}
