const baseUserModel = {
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Password is too short"],
  },
  sex: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  age: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  profilePicture: {
    imageUrl: String,
    imageId: String,
  },
  typeOfUser: {
    type: String,
    enum: ["doctor", "patient"],
    required: true,
  }
};

module.exports = baseUserModel;
