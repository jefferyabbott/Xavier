import mongoose from 'mongoose';

const profileSchema = mongoose.Schema({
    PayloadDisplayName: {
        type: String,
    },
    PayloadDescription: {
        type: String,
    },
    PayloadOrganization: {
        type: String,
    },
    PayloadIdentifier: {
        type: String,
        unique: true
    },
    PayloadUUID: {
        type: String,
        unique: true
    },
    MobileConfigData: {
        type: String,
    }
}, {
    timestamps: true
});


const profile = mongoose.model('Profile', profileSchema);

export default profile;
