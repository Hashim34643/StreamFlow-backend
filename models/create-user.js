const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const createUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    avatar: {
        type: Buffer
    }
});

createUserSchema.pre("save", function(next) {
    if (this.isModified("password")) {
        bcrypt.hash(this.password, 8, (err, hash) => {
            if(err) return next(err);
            this.password = hash;
            next();
        })
    }
})

createUserSchema.methods.comparePassword = async function(password) {
    if (!password) {
        throw new Error("Password is missing!");
    };
    try {
        const response = await bcrypt.compare(password, this.password)
        return response;
    } catch (error) {
        console.log(error.message);
    }
}

createUserSchema.statics.isThisEmailInUse = async function(email) {
    if (!email) {
        throw new Error("Invalid email");
    }
    try {
        const user = await this.findOne({email});
        if (user) {
            return false 
        } else {
            return true
        }
    } catch(error) {
        return false;
    }
}

createUserSchema.statics.isThisUsernameInUse = async function(username) {
    if (!username) {
        throw new Error("Invalid username");
    }
    try {
        const user = await this.findOne({username});
        if (user) {
            return false 
        } else {
            return true
        }
    } catch(error) {
        return false;
    }
}

module.exports = mongoose.model("user", createUserSchema);