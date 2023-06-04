const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  username: {
    type: String,
    unique: true,
    required: true,
    validate(value) {
      if (!validator.isAscii(value)) {
        throw new Error("Usernmae contains invalid characters. All Ascii characters are available for use.");
      }
      if (value.length < 4) {
        throw new Error("Username must be at least 4 characters.");
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (value.length < 7) {
        throw new Error("Password must be larger than 7 characters");
      }
      if (!validator.isAscii(value)) {
        throw new Error("Password can only contain acii 2 characters");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  charactersIds: [
    {
      type: String,
    },
  ],
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  // TODO: Replace secret phrase
  const token = jwt.sign({ _id: user._id.toString() }, "secretphrase");

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

// Hash plaintext password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
