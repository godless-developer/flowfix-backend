import { Request, Response } from 'express';
import { UserModel } from '../models';

export const createUser = async (req: Request, res: Response) => {
  let data = req.body;
  console.log('Creating User');
  // console.log(data);

  data = {
    ...data,
    // password: await bcrypt.hash(data.password, 10),
    email: data.email.toLowerCase(),
    first_name: data.first_name,
    last_name: data.last_name,
  };

  if (data) {
    const existingUser = await UserModel.findOne({ email: data.email });

    if (existingUser) {
      console.log('Энэ имэйл хаяг бүртгэгдсэн байна.');
      return res.status(400).json({
        success: false,
        message: 'Энэ имэйл хаяг бүртгэгдсэн байна.',
      });
    }

    try {
      const user = await UserModel.create(data);
      res.status(201).json({
        message: 'Хэрэглэгч амжилттай үүслээ',
        data: user,
      });
    } catch (error) {
      console.log('Хэрэглэгч үүсгэхэд алдаа гарлаа');
      res.status(500).json({
        success: false,
        error: error,
      });
    }
  } else {
    return res.json({
      error: 'Хэрэглэгч үүсгэхэд алдаа гарлаа error - The input field is empty',
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.find({}).lean();
    res.status(201).json(user);
  } catch (error) {
    res.status(404).json(error);
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const user = await UserModel.findOne({ email }).lean();

    res.status(200).json({
      _id: user?._id,
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      phone_number: user?.phone_number,
      profile_img: user?.profile_img,
      gender: user?.gender,
      user_role: user?.user_role,
      completeTask: user?.completedTasks,
      feedbacks: user?.feedbacks,
      address: user?.address,
      startedJobAt: user?.startedJobAt,
      department: user?.department,
      position: user?.position,
      coordinates: user?.coordinates,
      status: user?.status,
    });
  } catch (error) {
    res.status(404).json(error);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.body.id;
  console.log('Deleting User');
  console.log(id);
  try {
    await UserModel.deleteOne({ _id: id });
    const users = await UserModel.find();
    res.status(201).json({
      success: true,
      message: 'Successfully Deleted',
      data: users,
    });
  } catch (error) {
    res.status(404).json(error);
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params; // Get the user ID from request parameters
  const updateData = req.body; // Get updated data from request body

  const existingUser = await UserModel.findById(id);

  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        ...updateData,
      },
      { new: true }
    );

    if (!updatedUser) {
      // If user not found, return an error response
      return res.status(404).json({ message: 'User not found' });
    }

    // If user found and updated successfully, return a success response
    return res.status(200).json({ data: updatedUser });
  } catch (error) {
    // If an error occurs, return an error response
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
