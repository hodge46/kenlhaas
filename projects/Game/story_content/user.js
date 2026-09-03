window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var once = player.once;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
var update = player.update;
var pointerX = player.pointerX;
var pointerY = player.pointerY;
var showPointer = player.showPointer;
var hidePointer = player.hidePointer;
var slideWidth = player.slideWidth;
var slideHeight = player.slideHeight;
var getKeyDown = player.getKeyDown;
var keydown = player.keydown;
var keyup = player.keyup;
window.Script1 = function()
{
  var player = GetPlayer();

function findLMSAPI(win) {
// look in this window
if (win.hasOwnProperty("GetStudentID")) return win;

// all done if no parent
else if (win.parent == win) return null;

// climb up to parent window & look there
else return findLMSAPI(win.parent);
}

//get the users name from the LMS
var lmsAPI = findLMSAPI(this);
var myName = lmsAPI.GetStudentName();
var array = myName.split(',');
var name = array[1] + ' ' + array[0];
player.SetVar("name", name);


//get the users ID from the LMS
var nameID = lmsAPI.GetStudentID();
player.SetVar("nameID", nameID);
}

window.Script2 = function()
{
  // Retrive the player instance so we can retrieve stored variables
var player = GetPlayer();

// These are variables saved within your Storyline module
var nameID = player.GetVar("nameID");
var score = player.GetVar("score"); 
//hard coded variables for testing only
//var nameID = 6054417;
//var score = 43; 

//sets up a form with post method to pass the variables
var sHTML = "";
sHTML += "<form id='formYourScore' method='post' target='_blank' action='https://FMleaderboard.azurewebsites.net/topscores.php'>";
sHTML += "<input type='hidden' id='nameID' name='nameID' value= " + nameID + ">";
sHTML += "<input type='hidden' id='score' name='score' value= " + score + ">";
sHTML += "<br><input type='submit'><br>";
sHTML += "<form>";

//creates img object to append the post to
var newDiv = document.createElement("div");
var currentBody=document.getElementsByTagName('body')[0];
newDiv.id="urlPost" ;
newDiv.style.cssText = 'display:none;';
currentBody.appendChild(newDiv);

//appends the form to the img object and submits
document.getElementById("urlPost").innerHTML = sHTML;
document.getElementById("formYourScore").submit();
}

window.Script3 = function()
{
  // Retrive the player instance so we an retrieve stored variables
var player = GetPlayer();

// These are variables saved within your Storyline module
var name = player.GetVar("name");
var nameID = player.GetVar("nameID");
var score = player.GetVar("score"); 

// This creates a URL with the variable data using GET
var url = "https://FMleaderboard.azurewebsites.net/scoresave.php?name="+encodeURIComponent(name)+"&nameID="+encodeURIComponent(nameID)+"&score="+encodeURIComponent(score);

//This submits the url/variables to the leaderboard
var i = document.createElement("img");
i.src = url;
}

window.Script4 = function()
{
  var currentTime = new Date()
var month = currentTime.getMonth() + 1
var day = currentTime.getDate()
var year = currentTime.getFullYear()
var dateString=month + "/" + day + "/" + year
var player = GetPlayer();
player.SetVar("SystemDate",dateString);
}

window.Script5 = function()
{
  // Retrive the player instance so we can retrieve stored variables
var player = GetPlayer();

// These are variables saved within your Storyline module
var nameID = player.GetVar("nameID");
var score = player.GetVar("score"); 
//hard coded variables for testing only
//var nameID = 6054417;
//var score = 43; 

//sets up a form with post method to pass the variables
var sHTML = "";
sHTML += "<form id='formYourScore' method='post' target='_blank' action='https://FMleaderboard.azurewebsites.net/topscores.php'>";
sHTML += "<input type='hidden' id='nameID' name='nameID' value= " + nameID + ">";
sHTML += "<input type='hidden' id='score' name='score' value= " + score + ">";
sHTML += "<br><input type='submit'><br>";
sHTML += "<form>";

//creates img object to append the post to
var newDiv = document.createElement("div");
var currentBody=document.getElementsByTagName('body')[0];
newDiv.id="urlPost" ;
newDiv.style.cssText = 'display:none;';
currentBody.appendChild(newDiv);

//appends the form to the img object and submits
document.getElementById("urlPost").innerHTML = sHTML;
document.getElementById("formYourScore").submit();
}

};
