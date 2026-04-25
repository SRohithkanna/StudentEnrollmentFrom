var jpdbBaseURL    = "http://api.login2explore.com:5577";
var jpdbIRL        = "/api/irl";
var jpdbIML        = "/api/iml";
var studentDBName  = "SCHOOL-DB";
var studentRelName = "STUDENT-TABLE";
var connToken      = "90935269|-31949237166904019|90958520";

$("#rollNo").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getRollNoAsJsonObj() {
    var rollNo = $("#rollNo").val();
    var jsonStr = {
        "Roll-No": rollNo
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#fullName").val(record["Full-Name"]);
    $("#cls").val(record["Class"]);
    $("#birthDate").val(record["Birth-Date"]);
    $("#address").val(record["Address"]);
    $("#enrollDate").val(record["Enrollment-Date"]);
}

function resetForm() {
    localStorage.removeItem("recno");
    $("#rollNo").val("").prop("disabled", false);
    $("#fullName").val("").prop("disabled", true);
    $("#cls").val("").prop("disabled", true);
    $("#birthDate").val("").prop("disabled", true);
    $("#address").val("").prop("disabled", true);
    $("#enrollDate").val("").prop("disabled", true);
    $("#btnSave").prop("disabled", true);
    $("#btnUpdate").prop("disabled", true);
    $("#btnReset").prop("disabled", true);
    $("#rollNo").focus();
}

function validateAndGetFormData() {
    var rollNoVal     = $("#rollNo").val().trim();
    var fullNameVal   = $("#fullName").val().trim();
    var clsVal        = $("#cls").val().trim();
    var birthDateVal  = $("#birthDate").val().trim();
    var addressVal    = $("#address").val().trim();
    var enrollDateVal = $("#enrollDate").val().trim();

    if (rollNoVal === "") { alert("Roll-No is required!"); $("#rollNo").focus(); return ""; }
    if (fullNameVal === "") { alert("Full Name is required!"); $("#fullName").focus(); return ""; }
    if (clsVal === "") { alert("Class is required!"); $("#cls").focus(); return ""; }
    if (birthDateVal === "") { alert("Birth-Date is required!"); $("#birthDate").focus(); return ""; }
    if (addressVal === "") { alert("Address is required!"); $("#address").focus(); return ""; }
    if (enrollDateVal === "") { alert("Enrollment-Date is required!"); $("#enrollDate").focus(); return ""; }

    var jsonStr = {
        "Roll-No"         : rollNoVal,
        "Full-Name"       : fullNameVal,
        "Class"           : clsVal,
        "Birth-Date"      : birthDateVal,
        "Address"         : addressVal,
        "Enrollment-Date" : enrollDateVal
    };
    return JSON.stringify(jsonStr);
}

function getRollNo() {
    var rollNoVal = $("#rollNo").val().trim();
    if (rollNoVal === "") {
        alert("Please enter Roll-No!");
        $("#rollNo").focus();
        return;
    }

    var jsonStr   = getRollNoAsJsonObj();
    var getReqStr = createGET_BY_KEYRequest(connToken, studentDBName, studentRelName, jsonStr);

    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(getReqStr, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if (resultObj.status === 400) {
        // New record — enable Save & Reset
        $("#fullName, #cls, #birthDate, #address, #enrollDate").prop("disabled", false);
        $("#btnSave").prop("disabled", false);
        $("#btnUpdate").prop("disabled", true);
        $("#btnReset").prop("disabled", false);
        $("#rollNo").prop("disabled", true);
        $("#fullName").focus();

    } else if (resultObj.status === 200) {
        // Existing record — fill form, enable Update & Reset
        fillData(resultObj);
        $("#fullName, #cls, #birthDate, #address, #enrollDate").prop("disabled", false);
        $("#btnSave").prop("disabled", true);
        $("#btnUpdate").prop("disabled", false);
        $("#btnReset").prop("disabled", false);
        $("#rollNo").prop("disabled", true);
        $("#fullName").focus();
    }
}

function saveData() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") return;

    var putReqStr = createPUTRequest(connToken, jsonStr, studentDBName, studentRelName);

    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    if (resultObj.status === 200 || resultObj.status === 201) {
        alert("Record Saved Successfully!");
        resetForm();
    } else {
        alert("Error : " + resultObj.message);
    }
}

function updateData() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") return;

    var recNo = localStorage.getItem("recno");
    var updateReqStr = createUPDATERecordRequest(connToken, jsonStr, studentDBName, studentRelName, recNo);

    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(updateReqStr, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    if (resultObj.status === 200) {
        alert("Record Updated Successfully!");
        resetForm();
    } else {
        alert("Error : " + resultObj.message);
    }
}

$(document).ready(function () {
    resetForm();
});
