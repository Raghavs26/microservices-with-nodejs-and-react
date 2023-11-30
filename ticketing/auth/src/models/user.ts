import { Model, Schema, model, Document } from "mongoose";
import { Password } from "../utils/password";

interface UserAttributes {
  email: string;
  password: string;
}

interface UserModel extends Model<UserDoc> {
  buildUser(attributes: UserAttributes): UserDoc;
}

interface UserDoc extends Document {
  email: string;
  password: string;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.buildUser = (attributes: UserAttributes) => {
  return new User(attributes);
};

const User = model<UserDoc, UserModel>("User", userSchema);

// for types checking
const buildUser = (attributes: UserAttributes) => {
  return new User(attributes);
};

export { User, buildUser };
