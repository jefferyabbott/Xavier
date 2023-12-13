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
    },
    userType: {
        type: String,
        required: [true, 'user must be set to either consoleAdministrator or consoleAuditor']
    }
}, {
    timestamps: true
});


const consoleUser = mongoose.model('ConsoleUser', consoleUserSchema);

export default consoleUser;
