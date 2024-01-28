




export const getSender = (loggedinuser, users) => {
  if (users[0]._id === loggedinuser._id) {
    return users[1].name;
  } else {
    return users[0].name;
  }
};



export const getSenderfull = (loggedinuser, users) => {
  if (users[0]._id === loggedinuser._id) {
    return users[1];
  } else {
    return users[0];
  }
};