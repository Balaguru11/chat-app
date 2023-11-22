const ChatRoom = require("../model/ChatRoom.Model");

exports.leaveRoom = async (userId, roomUsers, room) => {
  const imLeaving = await ChatRoom.findByIdAndUpdate(
    { _id: room },
    {
      $pull: { usersChatting: userId },
    }
  );
  console.log(imLeaving);
  return roomUsers.filter((user) => user._id != userId);
};

exports.joinRoom = async (userId, room) => {
  const isUserInRoom = await ChatRoom.find({
    _id: room,
    usersChatting: { $in: [userId] },
  });
  console.log("joinRoom", isUserInRoom);

  if (isUserInRoom.length) {
    return true;
  } else if (!isUserInRoom.length) {
    const addMe = await ChatRoom.findByIdAndUpdate(
      { _id: room },
      { $push: { usersChatting: userId } }
    );
    console.log("addme", addMe);
    return true;
  } else {
    return false;
  }
};
