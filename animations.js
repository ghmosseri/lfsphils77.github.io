(() => {

"use strict";


/* =====================================================
   GET ELEMENTS
===================================================== */

const canvas =
    document.getElementById(
        "videoTextCanvas"
    );


const video =
    document.getElementById(
        "paxSilicaVideo"
    );


if (!canvas || !video) {

    console.error(
        "LFS animation elements were not found."
    );

    return;
}


const ctx =
    canvas.getContext(
        "2d"
    );


const text =
    "Shut Down Pax Silica!";


/* =====================================================
   DEVICE PIXEL RATIO
===================================================== */

let pixelRatio =
    window.devicePixelRatio || 1;


/* =====================================================
   RESIZE CANVAS
===================================================== */

function resizeCanvas() {

    pixelRatio =
        window.devicePixelRatio || 1;


    const width =
        canvas.parentElement
            .clientWidth;


    /*
        Give the text enough vertical space.
    */

    const height =
        Math.max(
            150,
            width * 0.21
        );


    canvas.width =
        Math.round(
            width * pixelRatio
        );


    canvas.height =
        Math.round(
            height * pixelRatio
        );


    canvas.style.width =
        `${width}px`;


    canvas.style.height =
        `${height}px`;


    ctx.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
    );
}


/* =====================================================
   DRAW VIDEO INSIDE TEXT
   
   IMPORTANT:
   
   We do NOT use ctx.clip().

   Instead:

   1. Draw the video.
   2. Switch to destination-in.
   3. Draw the text.

   destination-in keeps the video only
   where the text exists.
===================================================== */

function drawVideoText() {

    const width =
        canvas.clientWidth;


    const height =
        canvas.clientHeight;


    if (
        width <= 0 ||
        height <= 0
    ) {

        requestAnimationFrame(
            drawVideoText
        );

        return;
    }


    /* ---------------------------------------------
       CLEAR PREVIOUS FRAME
    --------------------------------------------- */

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /* ---------------------------------------------
       DRAW VIDEO
    --------------------------------------------- */

    if (
        video.readyState >= 2 &&
        video.videoWidth > 0
    ) {

        const videoRatio =
            video.videoWidth /
            video.videoHeight;


        const canvasRatio =
            width /
            height;


        let drawWidth;
        let drawHeight;


        /*
            "cover" behavior
        */

        if (
            videoRatio >
            canvasRatio
        ) {

            drawHeight =
                height;


            drawWidth =
                height *
                videoRatio;

        } else {

            drawWidth =
                width;


            drawHeight =
                width /
                videoRatio;
        }


        const x =
            (
                width -
                drawWidth
            ) / 2;


        const y =
            (
                height -
                drawHeight
            ) / 2;


        ctx.drawImage(
            video,
            x,
            y,
            drawWidth,
            drawHeight
        );


        /* -----------------------------------------
           TURN VIDEO INTO TEXT MASK
        ----------------------------------------- */

        ctx.globalCompositeOperation =
            "destination-in";


        const fontSize =
            Math.min(
                width * 0.105,
                134.59
            );


        ctx.font =
            `800 ${fontSize}px "Masonries"`;


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillStyle =
            "#ffffff";


        ctx.fillText(
            text,
            width / 2,
            height / 2
        );


        /*
            Return canvas to normal drawing mode.
        */

        ctx.globalCompositeOperation =
            "source-over";
    }


    /*
        Continue animation.
    */

    requestAnimationFrame(
        drawVideoText
    );
}


/* =====================================================
   FONT LOADING
   
   This is especially important for canvas.

   CSS may know about Masonries while canvas
   tries to render before the font has loaded.
===================================================== */

async function loadFonts() {

    try {

        await document.fonts.load(
            '800 100px "Masonries"'
        );


        await document.fonts.load(
            '700 100px "Inktera"'
        );


        console.log(
            "LFS fonts loaded."
        );

    } catch (error) {

        console.warn(
            "Could not load custom fonts:",
            error
        );
    }
}


/* =====================================================
   START VIDEO
===================================================== */

async function startVideo() {

    try {

        await video.play();

        console.log(
            "LFS video started."
        );

    } catch (error) {

        console.warn(
            "Video autoplay was blocked.",
            error
        );
    }
}


/* =====================================================
   INITIALIZATION
===================================================== */

async function init() {

    resizeCanvas();


    /*
        Wait specifically for the fonts
        before drawing canvas text.
    */

    await loadFonts();


    /*
        Start the video.
    */

    await startVideo();


    /*
        Begin canvas animation.
    */

    requestAnimationFrame(
        drawVideoText
    );
}


/* =====================================================
   RESIZE HANDLER
===================================================== */

let resizeTimer;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimer
        );


        resizeTimer =
            setTimeout(
                resizeCanvas,
                100
            );
    }
);


/* =====================================================
   START
===================================================== */

init();

})();
