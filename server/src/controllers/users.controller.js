import usersDatabase from "../models/users.model.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await usersDatabase.findById(id);

    if (!user) {
      return res.status(404).json({ message: "The user does not exist" });
    } else {
      return res.status(200).json(user);
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await usersDatabase.findById(id);

    if (!user) {
      return res.status(404).json({ message: "The user does not exist" });
    } else {
      // const friends = await user.friends.map(async (id) => {
      //     return await usersDatabase.findById(id);
      // });

      const friends = await Promise.all(
        user.friends.map((id) => usersDatabase.findById(id))
      );

      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return {
            _id,
            firstName,
            lastName,
            occupation,
            location,
            picturePath,
          };
        }
      );

      return res.status(200).json(formattedFriends);
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;

    if (id === friendId) {
      return getUserFriends(req, res);
    }

    // console.log(id, friendId);

    const user = await usersDatabase.findById(id); // <--
    const friend = await usersDatabase.findById(friendId);

    // console.log(user);
    // console.log(friend);

    if (user.friends.includes(friendId)) {
      // filter returns new array containing shallow copy of
      // elements that pass the test
      // map returns new array containing the elements returned
      // by the callback function
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((_id) => _id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    console.log(user);
    console.log(friend);

    return getUserFriends(req, res);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
