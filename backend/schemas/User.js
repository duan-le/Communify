const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    communitiesOwned: { type: [String], required: true },
    communitiesFollowed: { type: [String], required: true },
    admin: { type: Boolean },
    // postIds: { type: [String], required: true },
    // commentIds: { type: [String], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
