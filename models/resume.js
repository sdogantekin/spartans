var mongoose = require("mongoose");

// this defines the document schema
var workInfoSchema = mongoose.Schema({
    name : {type: String, required: true},
    title: {type: String, required: true},
    start: {type: Date, required: true},
    end  : {type: Date, required: false},
});

var educationInfoSchema = mongoose.Schema({
    school: {type: String, required: true},
    degree: {type: String, required: true},
    start : {type: Date, required: true},
    end   : {type: Date, required: false},
});

var salaryInfoSchema = mongoose.Schema({
    min: {type: Number, required: true},
    max: {type: Number, required: true}
});

var resumeSchema = mongoose.Schema({
    name             : {type: String, required: true},
    surname          : {type: String, required: true},
    email            : {type: String, required: true},
    phone            : {type: String, required: true},
    contactInfo      : {type: String, required: false},
    birthDate        : {type: Date, required: false},
    experience       : {type: Number, required: false},
    language         : {type: [String], required: false},
    categories       : {type: [String], required: false},
    skills           : {type: [String], required: false},
    location         : {type: String, required: false},
    preferredLocation: {type:[String], required:false},
    workHistory      : {type: [workInfoSchema], required: false},
    educationHistory : {type: [educationInfoSchema], required: false},
    salary           : {type: salaryInfoSchema, required: false},
    other            : {type:[String], required:false},
    createdAt        : {type: Date, default: Date.now()},
    createdBy        : {type:mongoose.Schema.ObjectId, ref: "User", required: true},
    assigned         : {type:mongoose.Schema.ObjectId, ref: "User", required:false}

});

resumeSchema.statics.findResume = function (userId,callback) {
    var resumes = []
    this.find({userId : userId}).sort({createdAt: -1}).exec(function (err,users) {
        users.forEach(function(user){
            resumes.push(user);
        });
        callback(resumes);
    })
}

resumeSchema.methods.findSuitableRecruitan = function () {
    return;
}

// methods must be added to the schema before compiling it with mongoose.model()
// the first parameter is the singular name of collection --> collection name is db is plural --> resumes!
var Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;