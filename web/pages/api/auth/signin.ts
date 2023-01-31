import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../../utils/iron/withSession';

export default withSessionRoute(signInUser);

async function signInUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    // send request to api to login user
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      req.session.destroy();
      return res.status(401).json({ error: data.error });
    }

    // if response ok update session
    req.session.user = data.data;
    await req.session.save();

    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    req.session.destroy();

    return res
      .status(500)
      .json({ error: 'Something went wrong, please try again' });
  }
}
