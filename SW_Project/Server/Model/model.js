const mongoose = require('mongoose');


var StudentSchema = new mongoose.Schema({
    firstname : String,
    middlename : String,
    lastname : String,
    stud_id : String,
    phoneNo : String,
    Gender : String,
    DOB : Date,
    Email_id : String,
    Address : String,
    Parent_Email_Id : String,
    Passward : String,
    Batch : String,
    Blood_Group : String,
    Profile_image : Buffer,
    ProgramRegister : { type : mongoose.Schema.type.ObjectID , ref: "Program"}
})

var FacultySchema = new mongoose.Schema({
    firstname : String,
    middlename : String,
    lastname : String,
    Faculty_id : String,
    phoneNo : String,
    Gender : String,
    Email_id : String,
    Address : String,
    Passward : String,
    Faculty_block : String,
    Profile_image : Buffer,   
})

var AdminSchema = new mongoose.Schema({
    Email_id : String,
    Passward : String
})

var DegreeSchema = new mongoose.Schema({
    Degree_name : String
})

var BranchSchema = new mongoose.Schema({
    Branch_name: String,
})

var CourseSchema = new mongoose.Schema({
    Course_Name : String,
    Course_code : Number,
    Course_credit : Number
})

var ProgramSchema = new mongoose.Schema({
    DegreeOffered : { type : mongoose.Schema.type.ObjectId, ref: "Degree"},
    BranchOffered : { type : mongoose.Schema.type.ObjectId, ref: "Branch"},
    CourseOffered : [{ type : mongoose.Schema.type.ObjectId, ref: "Course"}],
})

var SemesterSchema = new mongoose.Schema({
    Sem_name : String,
    ProgramOffered : [{ type : mongoose.Schema.type,ObjectID, ref: "Program"}]
})

var fee_structureSchema = new mongoose.Schema({
    program_fee : { type : mongoose.Schema.type.ObjectID, ref : "Program"},
    Fee_structure : Map,
})

var fee_historySchema = new mongoose.Schema({
    SrudentEnroll : { type : mongoose.Schema.type.ObjectID, ref : "Student"},
    SemesterFee : { type : mongoose.Schema.type.ObjectID, ref : "Semester"},
    Feestatus : Boolean,
    Fee_paid : Map,
    Date_Of_payment : Date
})

var TranscriptSchema = new mongoose.Schema({
    Student_detials : {type : mongoose.Schema.type.ObjectID, ref : "Student"},
    Course : [
        {
            Course_Name : String,
            Grade : String
        },
    ],
    Totalcredit : Number,
    CPI : Number,
})

var AnnouncementSchema = new mongoose.Schema({
    Title : String,
    Description : String,
    Created_Date : Date
})

var Course_AllotmentSchema = new mongoose.Schema({
    
})

var ResultSchema = new mongoose.Schema({
    student : { type : mongoose.Schema.type.ObjectID, ref : "Student"},
    Semester : String,
    Grade : [{
        Course : {type : mongoose.Schema.type.ObjectID, ref : "Course"},

    }]
})



const Student = mongoose.model("Student", StudentSchema);
const Admin = mongoose.model("Admin", AdminSchema);
const Faculty = mongoose.model("Faculty", FacultySchema);
const Degree = mongoose.model("Degree", DegreeSchema);
const Branch = mongoose.model("Branch", BranchSchema);
const Course = mongoose.model("Course", CourseSchema);
const Program = mongoose.model("Program", ProgramSchema);
const Semester = mongoose.model("Semester", SemesterSchema);
const fee_structure = mongoose.model("fee_structure", fee_structureSchema);
const fee_history = mongoose.model("fee_history", fee_historySchema);
const Transcript = mongoose.model("Transcript", TranscriptSchema);
const Announcement = mongoose.model("Announcement", AnnouncementSchema);
const Course_Allotment = mongoose.model("Course_Allotment", Course_AllotmentSchema);
const Result = mongoose.model("Result", ResultSchema);


module.exports = {Student,Admin,Faculty,Degree,Branch,Course,Program,Semester,fee_structure,fee_history,
    Transcript,Announcement,Course_Allotment,Result};
