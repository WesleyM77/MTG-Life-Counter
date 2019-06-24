/*
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function(reg) {
        if (reg.installing) {
            console.log('Service worker installing');
        } else if (reg.waiting) {
            console.log('Service worker installed');
        } else if (reg.active) {
            console.log('Service worker active');
        }
    }).catch(function(error) {
        console.log('Registration failed with ' + error);
    });
}
*/
function playerLayoutDefault(activeDivs) {
    // sizes for the default vertical layout
    var defaultVerticalSizes = [null,   "100%", "50%", "33.3%", "25%", "20%", "16.6%", "14.28%", "12.5%"];
    // set the height and display of the active player rows
    for (var i = 0; i < activeDivs.length; i++) {
        activeDivs[i].style.height = defaultVerticalSizes[activeDivs.length];
        activeDivs[i].style.display = "block";
    }
}
function playerLayoutHelper(activeDivs, arrClassNames) {
    for (var i = 0; i <  activeDivs.length; i++) {
        var currentClass = activeDivs[i].className;
        activeDivs[i].className = currentClass + " " + arrClassNames[i];
    }
}
function playerLayoutTwo(activeDivs) {
    activeDivs[0].className = activeDivs[0].className + " two-t";
    activeDivs[1].className = activeDivs[1].className + " two-b";
}
function playerLayoutThree(activeDivs) {
    var classNames = ["four-t-l", "four-t-r", "four-b-l"];
    playerLayoutHelper(activeDivs, classNames);
}
function playerLayoutFour(activeDivs) {
    var classNames = ["four-t-l", "four-t-r", "four-b-l", "four-b-r"];
    playerLayoutHelper(activeDivs, classNames);
}
function playerLayoutFive(activeDivs) {
    var classNames = Array(5).fill("five");
    playerLayoutHelper(activeDivs, classNames);
}
function playerLayoutSix(activeDivs) {
    var classNames = ["six-t-l", "six-t-r", "six-m-l", "six-m-r", "six-b-l", "six-b-r"];
    playerLayoutHelper(activeDivs, classNames);
}
function playerLayoutSeven(activeDivs) {
    var classNames = Array(7).fill("seven");
    playerLayoutHelper(activeDivs, classNames);
}
function playerLayoutEight(activeDivs) {
    var classNames = Array(8).fill("eight");
    playerLayoutHelper(activeDivs, classNames);
}
function setPlayerlayout(numberPlayers) {
    // these are the player rows we want to display
    var activeDivs = document.getElementsByClassName("active");
    // select the layout for the total number of players
    switch (numberPlayers) {
        case 2:
            playerLayoutTwo(activeDivs);
            break;
        case 3:
            playerLayoutThree(activeDivs);
            break;
        case 4:
            playerLayoutFour(activeDivs);
            break;
        case 5:
            playerLayoutFive(activeDivs);
            break;
        case 6:
            playerLayoutSix(activeDivs);
            break;
        case 7:
            playerLayoutSeven(activeDivs);
            break;
        case 8:
            playerLayoutEight(activeDivs);
            break;
        default:
            playerLayoutDefault(activeDivs);
            break;
    }
}
function setBackgroundAndActive(elem, colorIndex) {
    // these are the player colors in order
    var colorClasses = ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"];
    // mark as active and set the background color clas7
    elem.className = "row active noise " + colorClasses[colorIndex];
}
function setStartingLifeTotal(startingLife) {
    var life = null;
    if (startingLife != null) {
        life = startingLife;
    } else {
        // get the select element for the starting life total
        var selectStartingLife = document.getElementById("startLife");
        // get the selected value
        var life = selectStartingLife.options[selectStartingLife.selectedIndex].value;
        if (life == null || life == "") {
            // default to 20 life points if we were not able to get the value from the select element
            life = "20";
        }
    }
    // set the value in the life divs
    var lifeDivs = document.getElementsByClassName("life");
    for (var i = 0; i < lifeDivs.length; i++) {
        lifeDivs[i].innerText = life;
    }
}
function displayRows(numberPlayers, startingLife) {
    // get a collection of all the player rows
    var divs = document.getElementsByClassName("row");
    // for each player row until we reach the total number of players
    for (var i = 0; i < numberPlayers; i++) {
        setBackgroundAndActive(divs[i], i);
    }
    // set the right layout for the number of players
    setPlayerlayout(numberPlayers);
    // set the starting life total
    setStartingLifeTotal(startingLife);
    // hide the choose number of players container
    var choose = document.getElementById("choose");
    choose.className = "choose hidden";
    // show the players container
    var play = document.getElementById("play");
    play.className = "play";
}
function death(id, elem) {
    // clear the life total because there is no more life
    elem.innerText = "";
    // disable the plus and minus buttons for this player
    var buttons  = document.getElementsByClassName(id);
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
    // add the dead class so we can see the skull
    elem.className = "life dead";
    // display the resurrection button
    var backFromTheDeadButton = elem.nextElementSibling.children[2];
    backFromTheDeadButton.className = "animate";
    // we need to change the bg of the parent element
    // this is needed for the six player layout
    elem.parentElement.style.backgroundColor = "#000000";
    elem.parentElement.classList.remove("noise");
}
function animateDead(id, elem, btn) {
    // remove the dead class
    elem.className = "life";
    // you start again with 1 life
    elem.innerText = "1";
    // enable the plus and minus buttons
    var buttons  = document.getElementsByClassName(id);
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
    }
    // hide the resurrection button
    btn.className = "animate hidden";
    // change the background color back from black
    elem.parentElement.classList.add("noise");
    elem.parentElement.removeAttribute("style");
}
function displayLife(id, elem, intTotal) {
    // is the player dead yet?
    if (intTotal <= 0) {
        // yes, they drink with the gods in Valhalla
        death(id, elem);
    } else {
        // no, they are not dead yet, they feel happy
        // display their remaining life total
        elem.innerText = intTotal.toString();
    }
}
function changeLife(id, change) {
    // get the div element which has the life total for this player
    var totalDiv = document.getElementById(id);
    // get the text content (their current life total)
    var strCurrentTotal = totalDiv.innerText;
    if (strCurrentTotal != null && strCurrentTotal != "") {
        // convert the text to an integer
        var intCurrentTotal = parseInt(strCurrentTotal);
        // the amount of change should be an integer too
        var intChange = parseInt(change);
        // maths is hard
        var intNewTotal = intCurrentTotal + intChange;
        // display the new life total
        displayLife(id, totalDiv, intNewTotal);
    }
}
function plusLife(id) {
    // add one to the life total
    changeLife(id, 1);
}
function minusLife(id) {
    // subtract one from the life total
    changeLife(id, -1);
}
function mousedownChangeValue(elem) {
    // get the data-id from the button
    var id = elem.dataset.id;
    // the button class tells us if we need to add or subtract from the life total
    if (elem.className.includes("plus")) {
        plusLife(id);
    } else if (elem.className.includes("minus")) {
        minusLife(id);
    }
}
function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;
    // look for the available fullscreen properties for the browser
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
    // if we are not in fullscreen mode then just do it
    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
    } else {
        // we are already in fullscreen mode so close it
        cancelFullScreen.call(doc);
    }
}
function replay() {
    alert("todo");
}
// TODO: press will open a flyout menu for
// that player and not change the life total
var g_pressTimer = null;
function runPressTimer(e) {
    // change the life total unless it is 2 or less
    // just to be certain the user should manually click
    // the remaining life out of the poor bastard
    var id = e.target.dataset.id;
    var lifeTotalElement = document.getElementById(id);
    var intLifeTotal = parseInt(lifeTotalElement.innerText);
    if (e.target.value == "-" && intLifeTotal <= 2) {
        finishPress(e);
    } else {
        mousedownChangeValue(e.target);
        // if we have a timer already destroy it
        if (g_pressTimer != null) {
            clearPressTimer();
        }
        // take another turn
        g_pressTimer = window.setTimeout(function() {
            runPressTimer(e);
        }, 250);
    }
}
function clearPressTimer() {
    // remove target timer from the game
    window.clearTimeout(g_pressTimer);
    g_pressTimer = null;
}
var g_pressed = false;
function handlePress(e) {
    g_pressed = true;
    // start an infinite combo
    g_pressTimer = window.setTimeout(function() {
        runPressTimer(e);
    }, 500);
}
function handlePressUp(e) {
    finishPress(e);
}
function handlePanEnd(e) {
    finishPress(e);
}
function finishPress(e) {
    if (g_pressed) {
        clearPressTimer();
        g_pressed = false;
    }
}
function getParamAndValidate(urlParams, paramName, rangeBottom, rangeTop) {
    var returnValue = null;
    var paramValue = urlParams.get(paramName);
    if (paramValue != null) {
        var intParam = parseInt(paramValue);
        if (intParam != null && !isNaN(intParam)) {
            returnValue = intParam;
            if (returnValue > rangeTop) {
                returnValue = rangeTop;
            } else if (returnValue < rangeBottom) {
                returnValue = rangeBottom;
            }

        } else if (isNaN(intParam)) {
            intParam = null;
        }
    }
    return returnValue;
}
function handleQueryString()
{
    var urlParams = new URLSearchParams(location.search);
    if (urlParams.has("p") || urlParams.has("l")) {
        var numberPlayers = getParamAndValidate(urlParams, "p", 2, 8);
        var startingLife = getParamAndValidate(urlParams, "l", 1, 999);
        if (numberPlayers != null) {
            displayRows(numberPlayers, startingLife);
        }
    }
}
function handleSwipeLeft(e) {
    if (g_slideOutMenu != null) {
        g_slideOutMenu.close();
    }
}
function handleSwipeRight(e) {
    if (g_slideOutMenu != null) {
        g_slideOutMenu.open();
    }
}
function initTouchyFeelyHandsyStuff(elem) {
    // you can touch this, it's hammer time
    var hammerTime = new Hammer(elem);
    hammerTime.on("swipeleft", function(e) {
        e.preventDefault();
        handleSwipeLeft(e);
    });
    hammerTime.on("swiperight", function(e) {
        e.preventDefault();
        handleSwipeRight(e);
    });
    hammerTime.get("pan").set({ direction: Hammer.DIRECTION_ALL });
    hammerTime.on("press", function(e) {
        e.preventDefault();
        handlePress(e);
    });
    hammerTime.on("pressup", function(e) {
        e.preventDefault();
        handlePressUp(e);
    });
    hammerTime.on("panend", function(e) {
        e.preventDefault();
        handlePanEnd(e);
    });
}
var g_slideOutMenu = null;
function closeSlideMenu(e) {
  e.preventDefault();
  if (g_slideOutMenu != null) {
      g_slideOutMenu.close();
  }
}
window.addEventListener("DOMContentLoaded", function(e) {
    // add listener to the number of player buttons
    var numberPlayersButtons  = document.getElementsByClassName("button");
    for (var i = 0; i < numberPlayersButtons.length; i++) {
        numberPlayersButtons[i].addEventListener("click", function(e) {
            var numberPlayers = parseInt(e.srcElement.value);
            displayRows(numberPlayers, null);
        }, false);
    }
    // for each of the plus and minus buttons
    var buttonClasses = ["plus", "minus"];
    for (var i = 0; i < buttonClasses.length; i++) {
        // get all of the buttons by type (plus or minus)
        var buttons  = document.getElementsByClassName(buttonClasses[i]);
        for (var j = 0; j < buttons.length; j++) {
            // for each button we need to add the mouse event handlers
            var btn = buttons[j];
            btn.addEventListener("click", function(e) {
                mousedownChangeValue(e.srcElement);
            }, false);
            // init the touch event handlers
            initTouchyFeelyHandsyStuff(btn);
        }
    }
    // add handler for the animate dead buttons
    var animateDeadButtons  = document.getElementsByClassName("animate");
    for (var i = 0; i < animateDeadButtons.length; i++) {
        animateDeadButtons[i].addEventListener("click", function(e) {
            var btn = e.srcElement;
            var id = btn.dataset.id;
            var elem = document.getElementById(id);
            animateDead(id, elem, btn);
        }, false);
    }
    // handle params
    handleQueryString();
    // init slide menu
    g_slideOutMenu = new Slideout({
        "panel": document.getElementById("panel"),
        "menu": document.getElementById("menu"),
        "padding": 256,
        "tolerance": 70
    });
    g_slideOutMenu.enableTouch();
    var toggleButtons = document.getElementsByClassName("toggle-button");
    for (var i = 0; i < toggleButtons.length; i++) {
        toggleButtons[i].addEventListener("click", function(e) {
            g_slideOutMenu.toggle();
        }, false);
    }
    g_slideOutMenu.on("beforeopen", function() {
        this.panel.classList.add("panel-open");
    });
    g_slideOutMenu.on("open", function() {
        this.panel.addEventListener("click", closeSlideMenu);
    });
    g_slideOutMenu.on("beforeclose", function() {
        this.panel.classList.remove("panel-open");
        this.panel.removeEventListener("click", closeSlideMenu);
    });
    // add handler for the fullscreen button
    var fullscreenButton = document.getElementById("fullscreen");
    fullscreenButton.addEventListener("click", function(e) {
        toggleFullScreen();
    }, false);
    // add handler for the replay button
    var replayButton = document.getElementById("replay");
    replayButton.addEventListener("click", function(e) {
        replay();
    }, false);
});


/* todo
 * don't show top menu button when on choose screen, only on players screen
 * change orientation on 7 and 8 player layouts (top two are 180deg middle 2 onright 90deg, middle 2 left -90deg etc)
 * need to change css values width heightt for lanscape orientation
*/
