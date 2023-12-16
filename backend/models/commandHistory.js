import mongoose from 'mongoose';

const commandSchema = mongoose.Schema({
    CommandUUID: {
        type: String
    },
    RequestType: {
        type: String
    },
    Response: {
        type: String
    },
    Requester: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'ConsoleUser'
    },
    Approver: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ConsoleUser'
    },
    DeviceUDID: {
        type: String
    }
}, {
    timestamps: true
});


const command = mongoose.model('Command', commandSchema);

export default command;
