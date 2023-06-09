import MongoDBConnect from '../../utils/mongoDBConnection';
import UserModel from '../../Models/UserModel';
import bcrypt from 'bcryptjs';
const jwt = require('jsonwebtoken');

const LoginHandle = async (req, res) => {
  if (req.method !== 'POST') {
    res.json({ message: 'Only POST requests allowed' })
  }
  try {
    await MongoDBConnect();
    const responseData = await UserModel.findOne({ email: req.body.email })
    if (responseData) {
      const checkPassword = await bcrypt.compareSync(req.body.password, responseData.password)
      if (!checkPassword) {
        res.json({ message: 'Invalid email or password...' })
      }
      else {
        const token = await jwt.sign({ id: responseData._id, email: responseData.email, }, process.env.JWT);
        res.json({ message: 'User Login...', acccessToken: token })
      }
    }
    else {
      res.json({ message: 'User not registered...' })
    }

  } catch (error) {
    res.json({ message: 'Error, Please try again...' })
  }
}


export default LoginHandle;