export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};




export const getSender = (loggedinuser, users) => {
  if (users[0]._id === loggedinuser._id) {
    return users[1].name;
  } else {
    return users[0].name;
  }
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSenderfull = (loggedinuser, users) => {
  if (users[0]._id === loggedinuser._id) {
    return users[1];
  } else {
    return users[0];
  }
};



export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    // (messages[i + 1].sender._id !== m.sender._id ||
    //   messages[i + 1].sender._id === undefined) &&
    messages[i + 1].sender._id !== m.sender._id &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};