import mongoose from 'mongoose';

const consoleUserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password is required']
    }
}, {
    timestamps: true
});


const consoleUser = mongoose.model('ConsoleUser', consoleUserSchema);

export default consoleUser;
