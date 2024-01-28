const mongoose = require("mongoose");
const { Schema } = mongoose;

const ChatSchema = new Schema(
  {
    chatname: {
      type: String,
      trim: true,
    },
    isgroupchat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestmessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    // So, in summary, the groupadmin field is expected to store MongoDB ObjectIds that reference documents in the 'User' collection, representing the group administrator. This is a common pattern in MongoDB to establish relationships between documents in different collections.
    groupadmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
