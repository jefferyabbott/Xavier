import mongoose from 'mongoose';

const complianceCardPrefsSchema = mongoose.Schema({
    consoleUser: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'ConsoleUser'
    },
    complianceCardPrefs: [
        {
            type: {
                type: String,
                required: [true, 'the type of compliance card is required']
            },
            title: {
                type: String,
                required: [true, 'the title for the compliance card is required']
            },
            arg: {
                type: String
            },
            platform: {
                type: String,
                required: [true, 'the platform for the compliance card is required']
            }
        }
    ]
}, {
    timestamps: true
});


const complianceCardPrefs = mongoose.model('ComplianceCardPrefs', complianceCardPrefsSchema);

export default complianceCardPrefs;
