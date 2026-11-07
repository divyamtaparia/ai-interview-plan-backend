const mongoose = require('mongoose');

/**
 * INPUTS
 * - job description schema
 * - resume text
 * - self description
 * 
 * OUTPUTS
 * - matchScore
 * - technical questions
 * - behavioral questions
 * - skill gaps
 * - preparation plan
 */

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    intention: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    }
}, {
     _id: false 
});

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    intention: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    }
}, {
     _id: false 
});

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: true,
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true,
    },
}, {
    _id: false
});   

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: true,
    },
    focus: {
        type: String,
        required: true,
    },
    tasks: [{
        type: String,
        required: true,
    }],
});

const interviewReportSchema = new mongoose.Schema({
    
    //inputs
    jobDescription: {
        type: String,
        required: true,
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },

    //outputs
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    title: {
        type: String,
        required: [true, "Title is required for the interview report."]
    }
}, {
    timestamps: true,
});    

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;