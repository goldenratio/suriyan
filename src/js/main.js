/**
 * @author: Karthik VJ
 **/


var Main = (function()
{
    "use strict";

    var stage,
        optionsContainer,
        controlsContainer,
        canvasContainer,
        resizeTimer,
        slide,
        server,
        updateButton,
        selectedRes,
        progressBarContainer,
        statusMessage,
        displaySelectBox,
        displaySelectBoxContainer,
        displayNContainer,
        fullScreenButton,
        playButton,
        pauseButton,
        context,
        mouseTimeOut;


    /**
     * Main
     * @constructor
     */
    function Main()
    {
        context = this;
    }

    /**
     * Initialize
     * Invoked when window has finished loading
     */
    Main.prototype.init = function()
    {
        console.log("load complete!");
        stage = new createjs.Stage("slate");
        optionsContainer = document.getElementById("options");
        controlsContainer = document.getElementById("controls");
        canvasContainer = document.getElementById("canvasContainer");
        updateButton = document.getElementById("updateButton");
        progressBarContainer = document.getElementById("progressBarContainer");
        statusMessage = document.getElementById("statusMessage");
        displaySelectBox = document.getElementById("display");
        displaySelectBoxContainer = document.getElementById("displayBoxContainer");
        displayNContainer = document.getElementById("displayNValueContainer");
        fullScreenButton = document.getElementById("fullscreenButton");
        playButton = document.getElementById("playButton");
        pauseButton = document.getElementById("pauseButton");

        stage.autoClear = true;

        server = new NOAAServer();
        slide = new ImageSlide(stage, context);
        selectedRes = slide.Res.LOW;

        //slide.start(["http://sohowww.nascom.nasa.gov//data/REPROCESSING/Completed/2013/hmiigr/20130523/20130523_1800_hmiigr_512.jpg", "http://sohowww.nascom.nasa.gov//data/REPROCESSING/Completed/2013/hmiigr/20130523/20130523_1500_hmiigr_512a.jpg", "http://sohowww.nascom.nasa.gov//data/REPROCESSING/Completed/2013/hmiigr/20130523/20130523_1500_hmiigr_512.jpg"], selectedRes);

        /*var reqData = new RequestData();
        reqData.resolution = 2;
        reqData.numImg = 10;
        reqData.types = "instrument=EIT:wavelength=171";

        server.send(reqData.generatePostData(), context.serverCallback);*/

        initialDisplay();

        createjs.Ticker.addEventListener(Event.ENTER_FRAME, onLoop);
        updateButton.addEventListener(MouseEvent.CLICK, onUpdateClick, false);
        displaySelectBox.addEventListener(FormEvent.CHANGE, onDisplayBoxChange, false);
        fullScreenButton.addEventListener(MouseEvent.CLICK, onFullScreenToggle, false);
        playButton.addEventListener(MouseEvent.CLICK, onPlayClickHandler, false);
        pauseButton.addEventListener(MouseEvent.CLICK, onPauseClickHandler, false);

        document.addEventListener(Event.WEBKIT_FULLSCREEN, onFullScreenStateChange, false);
        window.addEventListener(Event.RESIZE, onWindowResize, false);

        context.resizeElements();
    };

    function onPlayClickHandler(event)
    {
        slide.play();
    }

    function onPauseClickHandler(event)
    {
        slide.pause();
    }

    function onFullScreenStateChange()
    {
        var fullScreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

        //console.log(fullscreenElement);
        if(fullScreenElement === null) {
            // stop auto mouse hide
            stopAutoMouseHide();
        }
        else {
            startAutoMouseHide();
        }

    }

    function onFullScreenToggle(event)
    {
        //console.log(event);
        var fullScreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

        //console.log(fullscreenElement);
        if(fullScreenElement === null) {
            launchFullScreen(document.documentElement); // the whole page
        }
        else {
            cancelFullScreen();
        }
    }

    function startAutoMouseHide()
    {
        window.addEventListener(MouseEvent.MOUSE_MOVE, onWindowMouseMove, false);
    }

    function stopAutoMouseHide()
    {
        window.removeEventListener(MouseEvent.MOUSE_MOVE, onWindowMouseMove, false);
        if(mouseTimeOut)
        {
            clearTimeout(mouseTimeOut);
        }
    }

    function onWindowMouseMove(event)
    {
        if(mouseTimeOut)
        {
            clearTimeout(mouseTimeOut);
        }

        // show controls
        if(optionsContainer.style.display === "none")
        {
            console.log("mouse move");
            optionsContainer.style.display = "block";
            controlsContainer.style.display = "block";
            //Mouse.show();

            context.resizeElements();
        }

        mouseTimeOut = setTimeout(function()
        {
            console.log("hide controls");

            optionsContainer.style.display = "none";
            controlsContainer.style.display = "none";
            //window.removeEventListener(MouseEvent.MOUSE_MOVE, onWindowMouseMove, false);
            //Mouse.hide();

            //startAutoMouseHide();
            context.resizeElements();

        }, 5000);
    }

    function onDisplayBoxChange(event)
    {
        var displayData = document.getElementById("display").options[document.getElementById("display").selectedIndex].value;
        if(displayData === "3")
        {
            displayNContainer.style.display = "block";
        }
        else
        {
            displayNContainer.style.display = "none";
        }
    }

    function onUpdateClick(event)
    {
        var resData = document.getElementById("resolution").options[document.getElementById("resolution").selectedIndex].value;
        if(resData === "1")
        {
            selectedRes = slide.Res.HIGH;
        }
        else if(resData === "2")
        {
            selectedRes = slide.Res.LOW;
        }

        var types = document.getElementById("types").options[document.getElementById("types").selectedIndex].value;

        var displayData = document.getElementById("display").options[document.getElementById("display").selectedIndex].value;
        var numImage = 0;
        if(displayData === "1")
        {
            numImage = 1;
        }
        else if(displayData === "2")
        {
            numImage = 10;
        }
        else if(displayData === "3")
        {
            numImage = document.getElementById("numValue").value;
        }

        var reqData = new RequestData();
        reqData.resolution = resData;
        if(numImage)
            reqData.numImg = numImage;
        reqData.types = types;

        console.log(reqData);

        context.setPending(true);
        showMessage(MessageType.FETCHING_DATA, true);
        server.send(reqData.generatePostData(), context.serverCallback);

    }

    function initialDisplay()
    {
        var resData = document.getElementById("resolution").options[document.getElementById("resolution").selectedIndex].value;
        if(resData === "1")
        {
            selectedRes = slide.Res.HIGH;
        }
        else if(resData === "2")
        {
            selectedRes = slide.Res.LOW;
        }

        var types = document.getElementById("types").options[document.getElementById("types").selectedIndex].value;

        var reqData = new RequestData();
        reqData.resolution = resData;
        reqData.numImg = 1;
        reqData.types = types;

        console.log(reqData);

        context.setPending(true);
        showMessage(MessageType.FETCHING_DATA, true);
        server.send(reqData.generatePostData(), context.serverCallback);
    }


    function showMessage(messageType, flag)
    {
        if(messageType === undefined) messageType = MessageType.FETCHING_DATA;
        if(flag === undefined) flag = false;

        if(flag === true)
        {
            statusMessage.innerHTML = MessageMap[messageType];
            statusMessage.style.display = "block";
        }
        else
        {
            statusMessage.style.display = "none";
        }

        context.resizeElements();
    }

    function onLoop(event)
    {
        stage.update();
    }

    /**
     * Invoked when window is re-sized
     * @param event
     */
    function onWindowResize(event)
    {
        if(resizeTimer)
        {
            clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(function()
        {
            console.log("resize");
            context.resizeElements();
        }, 50);

    }

    Main.prototype.serverCallback = function(data)
    {
        console.log("NOAA callback" + data);
        showMessage(false);
        if(data === MessageMap.ERROR)
        {
            showMessage(MessageType.ERROR_DATA, true);
            return;
        }

        slide.stop();
        slide.start(data, selectedRes);
    };

    Main.prototype.setPending = function(state)
    {
        if(state === undefined) state = true;
        //draw blocker
        var blocker = document.getElementById("blocker");
        if(state == true)
        {
            blocker.style.display = "block";
        }
        else
        {
            blocker.style.display = "none";
        }


    };

    /**
     * Resize all elements to fit screen
     */
    Main.prototype.resizeElements = function()
    {
        //console.log(optionsContainer.offsetHeight);
        //console.log(window.innerHeight);
        var canvasHeight = window.innerHeight - optionsContainer.offsetHeight - controlsContainer.offsetHeight - 10;
        var canvasWidth = window.innerWidth;

        stage.canvas.height =  canvasHeight;
        stage.canvas.width = canvasWidth;

        progressBarContainer.style.left = ((canvasWidth >> 1) - (progressBarContainer.offsetWidth >> 1)) + "px";
        progressBarContainer.style.top = ((canvasHeight >> 1) - (progressBarContainer.offsetHeight >> 1)) + "px";

        statusMessage.style.left = ((canvasWidth >> 1) - (statusMessage.offsetWidth >> 1)) + "px";
        statusMessage.style.top = ((canvasHeight >> 1) - (statusMessage.offsetHeight >> 1)) + "px";

        canvasContainer.style.height = canvasHeight.toString() + "px";
        canvasContainer.style.width = canvasWidth.toString() + "px";

        if(slide)
        {
            slide.resize(canvasWidth, canvasHeight);
        }

        stage.update();

    };

    /**
     * Calls Request Full Screen
     * @param element
     */
    function launchFullScreen(element)
    {
        if(element.requestFullScreen)
        {
            element.requestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        else if(element.mozRequestFullScreen)
        {
            element.mozRequestFullScreen();
        }
        else if(element.webkitRequestFullScreen)
        {
            element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    }

    /**
     * Cancels Full Screen
     */
    function cancelFullScreen()
    {
        if(document.cancelFullScreen)
        {
            document.cancelFullScreen();
        }
        else if(document.mozCancelFullScreen)
        {
            document.mozCancelFullScreen();
        }
        else if(document.webkitCancelFullScreen)
        {
            document.webkitCancelFullScreen();
        }
    }

    return Main;

}());

var main = new Main();

function onLoad(event)
{
    main.init();
}
window.addEventListener(Event.LOAD, onLoad, false);
