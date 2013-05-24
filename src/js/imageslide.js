var ImageSlide = (function()
{
    "use strict";

    var stage,
        container,
        selectedRes,
        queue,
        context,
        progressBar,
        progressBarContainer,
        canvasProp,
        currentImageCount = 0,
        totalImages = 0,
        timeDelay = 100,
        timer,
        timeLine,
        thisObject;


    function ImageSlide(stageRef, contextRef)
    {
        if(stageRef === undefined)
        {
            console.log("stage ref is required");
            return;
        }

        this.Res = {
            LOW : 512,
            HIGH : 1024
        };

        thisObject = this;

        canvasProp = new Rectangle();
        progressBarContainer = document.getElementById("progressBarContainer");
        progressBar = document.getElementById("progressBar");
        progressBar.value = 0;

        timeLine = document.getElementById("timeLine");
        context = contextRef;

        stage = stageRef;
        console.log("slide");

        container = new createjs.Container();
        stage.addChild(container);

        timeLine.addEventListener(FormEvent.CHANGE, onSliderChange, false);

    }

    function onSliderChange(event)
    {
        //console.log(event);
        //console.log(timeLine.value);
        thisObject.pause();
        if(totalImages > 1)
            showImage(timeLine.value - 1);

    }


    ImageSlide.prototype.start = function(imageList, res)
    {
        context.setPending(true);
        clearImage();

        progressBarContainer.style.display = "block";
        progressBarContainer.style.left = ((canvasProp.width >> 1) - (progressBarContainer.offsetWidth >> 1)) + "px";
        progressBarContainer.style.top = ((canvasProp.height >> 1) - (progressBarContainer.offsetHeight >> 1)) + "px";

        currentImageCount = 0;
        totalImages = imageList.length;
        timeLine.min = 1;
        timeLine.max = totalImages;
        timeLine.value = 1;

        selectedRes = res;
        queue = new createjs.LoadQueue(true);
        queue.addEventListener(Event.COMPLETE, handleComplete);
        queue.addEventListener(Event.PROGRESS, onProgress);
        queue.addEventListener(Event.ERROR, onError);
        var i;
        for(i = 0; i < imageList.length; i++)
        {
            queue.loadManifest([
                {id: "image_" + i, src: imageList[i]}
            ], false);
        }

        queue.load();

    };

    ImageSlide.prototype.stop = function()
    {
        clearImage();
        if(timer)
        {
            clearTimeout(timer);
        }

        totalImages = 0;
        currentImageCount = 0;
    };

    ImageSlide.prototype.pause = function()
    {
        if(timer)
        {
            clearTimeout(timer);
        }
    };

    ImageSlide.prototype.play = function()
    {
        if(totalImages > 1)
            showImage();
    };

    function clearImage()
    {
        if(timer)
        {
            clearTimeout(timer);
        }

        container.removeAllChildren();
    }

    function onError()
    {
        console.log(queue.type);
        console.log(queue.item);
        console.log(queue.error);
    }

    function handleComplete()
    {
        console.log("all load complete");
        progressBarContainer.style.display = "none";
        context.setPending(false);

        currentImageCount = 0;
        showImage();
    }

    function showImage(index)
    {
        clearImage();
        if(index !== undefined) currentImageCount = index;

        if(currentImageCount >= totalImages)
        {
            currentImageCount = 0;
        }
        var result = queue.getResult("image_" + currentImageCount);
        if(!result)
        {
            console.log("image not loaded");
            // next image
            currentImageCount++;
            showImage();
            return;
        }
        var image = new createjs.Bitmap(result);
        container.addChild(image);

        if(index === undefined)
            timeLine.value = currentImageCount + 1;

        thisObject.resize();

        if(totalImages > 1 && index === undefined)
            startTimer();
    }

    function startTimer()
    {
        //console.log("timer");

        timer = setTimeout(function()
        {
            currentImageCount++;
            showImage();
        }, timeDelay);
    }

    function onProgress()
    {
        console.log("loading.. " + queue.progress);
        var percent = Math.floor(queue.progress * 100);
        progressBar.value = percent;
    }

    ImageSlide.prototype.resize = function(canvasWidth, canvasHeight)
    {
        //var selectedRes = Res.HIGH;
        if(canvasHeight !== undefined && canvasHeight !== undefined)
        {
            canvasProp.width = canvasWidth;
            canvasProp.height = canvasHeight;
        }


        if(canvasProp.width < selectedRes || canvasProp.height < selectedRes)
        {
            var val = canvasProp.width < canvasProp.height ? canvasProp.width : canvasProp.height;
            var percent = (val / selectedRes) * 1;

            container.scaleX = percent;
            container.scaleY = container.scaleX;

            container.x = (canvasProp.width >> 1) - (val >> 1);
            container.y = (canvasProp.height >> 1) - (val >> 1);
        }
        else
        {
            container.scaleX = 1;
            container.scaleY = container.scaleX;

            container.x = (canvasProp.width >> 1) - (selectedRes >> 1);
            container.y = (canvasProp.height >> 1) - (selectedRes >> 1);
        }


    };


    return ImageSlide;
}());