import asyncHandler from 'express-async-handler';
import complianceCardPrefs from '../models/complianceCard.js';

// @desc    Get compliance card prefs
// @route   GET /complianceCardPrefs
// @access  Private
const getComplianceCardPrefs = asyncHandler(async (req, res) => {
    const prefs = await complianceCardPrefs.find({ consoleUser: req.user.id });
    return res.status(200).json(prefs);
});

// @desc    Set compliance card prefs
// @route   POST /complianceCardPrefs
// @access  Private
const setComplianceCardPrefs = asyncHandler(async (req, res) => {
    const prefs = await complianceCardPrefs.updateOne(
        { consoleUser: req.user.id },
        { 
            consoleUser: req.user.id,
            complianceCardPrefs: req.body.complianceCardPrefs
        }, { upsert: true }
    );
    return res.status(200).json(prefs);
});

export {
    getComplianceCardPrefs,
    setComplianceCardPrefs,
}