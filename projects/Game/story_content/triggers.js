function ExecuteScript(strId)
{
  switch (strId)
  {
      case "6ZuYIIjLJ4b":
        Script1();
        break;
      case "6DvynEqLPKs":
        Script2();
        break;
      case "6kTFOX5vyxl":
        Script3();
        break;
      case "5evCH9jmzVG":
        Script4();
        break;
      case "6dFvGFrF4lw":
        Script5();
        break;
  }
}

window.InitExecuteScripts = function()
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
};
