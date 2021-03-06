/**
 * Created by serkand on 20/05/2017.
 */

$.ajaxSetup({complete: onRequestCompleted});

function onRequestCompleted(xhr,textStatus) {
    if (xhr.status == 302) {
        location.href = xhr.getResponseHeader("Location");
    }
}

function saveResume() {
    var resume       = {};
    resume.name      = $("#resumeBasics #name").val();
    resume.surname   = $("#resumeBasics #surname").val();
    resume.email     = $("#resumeBasics #email").val();
    resume.phone     = $("#resumeBasics #phone").val();
    resume.birthDate = $("#resumeBasics #birthDate").val();
    resume.language  = [];
    $("#resumeLanguage #language").each(function (index) {
        var $this = $(this);
        resume.language.push($this.text());
    });

    //Work History and Education info will be added

    resume.categories = [];
    $('#resumeExpert li').each(function() {
        if($(this).hasClass('active')){
            resume.categories.push($(this).text())
        }
    });

    resume.skills = [];
    $('#resumeSkill li').each(function () {
        if($(this).hasClass('active')){
            resume.skills.push($(this).text())
        }
    });

    $('#resumeLocation li').each(function () {
        if($(this).hasClass('active')){
            resume.location = $(this).text();
        }
    });

    resume.preferredLocation = [];
    $('#resumePreferLocation li').each(function () {
        if($(this).hasClass('active')){
            resume.preferredLocation.push($(this).text());
        }
    });

    resume.salary     = {}
    resume.salary.min = $("#resumeSalary #minSalary").val();
    resume.salary.max = $("#resumeSalary #maxSalary").val();

    resume.other = [];
    $('#resumeOther li').each(function () {
        resume.other.push($(this).text())
    })

    $.ajax({
        url: "/resume",
        data: JSON.stringify(resume),
        type: "post",
        contentType: "application/json",
        success: function (response) {
            if (response.status == "success") {
                alert("resume created!");
            } else {
                alert("resume creation failed : "+response.message);
            }
        }
    });
}

$(document).ready(function() {

    //Add Expert
    $(document).on('keypress', '#inputExpert', function(e) {
        var id = $("#inputExpert").val()
        if ( e.keyCode == 13 ) {  // detect the enter key
            $("#resumeExpert").append($("<li id="+id+" class='active' onclick='changeStatus(id)'>").text(id));
        }
    });

    //Add Skill
    $(document).on('keypress', '#inputSkill', function(e) {
        var id = $("#inputSkill").val()
        if ( e.keyCode == 13 ) {  // detect the enter key
            $("#resumeSkill").append($("<li id="+id+"   class='active' onclick='changeStatus(id)'>").text(id));
        }
    });

    //Add Location
    $(document).on('keypress', '#inputLocation', function(e) {
        var id = "n" + $("#inputLocation").val()
        if ( e.keyCode == 13 ) {  // detect the enter key
            $("#resumeLocation").append($("<li id="+id+"  class='active' onclick='changeStatus(id)'>").text(id));
        }
    });

    //Add Prefer Location
    $(document).on('keypress', '#inputPreferLocation', function(e) {
        var id = $("#inputPreferLocation").val()
        if ( e.keyCode == 13 ) {  // detect the enter key
            $("#resumePreferLocation").append($("<li id="+id+"  class='active' onclick='changeStatus(id)'>").text(id));
        }
    });

});

function addLanguage() {
    $("#resumeLanguage").append($("<li id=\"language\">").text($("#newLanguage").val()));
}

function addOther(){
    $("#resumeOther").append($("<li id=\"other\" class='active'>").text($("#inputOther").val()));
}

function changeStatus(id){
    if($("#" + id).hasClass('active')){
        $("#" + id).removeClass('active')
    } else{
        $("#" + id).attr('class', 'active')
    }
}

function uploadFile() {
    var files = $("#cvUpload").get(0).files;
    if (files.length > 0){
        var formData = new FormData();
        formData.append("uploadFile", files[0]);

        $.ajax({
            url: "/upload",
            type: "post",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status == "success") {
                    alert("file uploaded!");
                } else {
                    alert("file uploading failed : "+response.message);
                }
            }
        });
    }
};

//Jquery UI Date Picker
$( function() {
    $( "#birthDate" ).datepicker();
} );