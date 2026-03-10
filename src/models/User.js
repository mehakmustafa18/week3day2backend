const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


// USER SCHEMA — blueprint for every user in DB

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // removes extra spaces
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // no two users can have same email
      lowercase: true, // always saved as lowercase
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);


// PRE-SAVE HOOK — runs BEFORE saving to database
// This automatically hashes password before saving

UserSchema.pre("save", async function (next) {
  // Only hash if password was changed (or new user)
  if (!this.isModified("password")) return next();

  // bcrypt.hash(password, saltRounds)
  // saltRounds = 10 means it runs the hash 10 times — more secure
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// METHOD — compare entered password with hashed
// Called during login to verify password

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
