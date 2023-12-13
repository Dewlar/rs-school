const switchSlideDelay = 5000;
const sliderControls = document.querySelectorAll('.control');
let timerStart = Date.now();
let remainingTime = 5000;
let activeControlWidth = 0;
let controlInterval;
//burger
const burger = document.querySelector('.burger-button');
const burgerWrapper = document.querySelector('.burger-wrapper');

burger.addEventListener('click', () => {
    window.scroll(0, 0);
    burgerCloseHandler();
});
document.querySelector('.burger-wrapper').addEventListener('click', (e) => {
    e.target.closest('.link-animation') && burgerCloseHandler();
});

function burgerCloseHandler() {
    document.querySelector('body').classList.toggle('collapsed');
    document.querySelector('.burger-button').classList.toggle('collapsed');
    burgerWrapper.classList.toggle('collapsed');
    if (burgerWrapper.classList.contains('collapsed')) {
        burgerWrapper.style.left = '0';
        burgerWrapper.style.opacity = '1';
    } else {
        burgerWrapper.style.left = '110vw';
        burgerWrapper.style.opacity = '0';
    }
}

////////////////media listeners//////////////////////////////////
window.matchMedia('(max-width: 740px)').addEventListener('change', mainMediaChanger);
window.matchMedia('(max-width: 768px)').addEventListener('change', mainMediaChanger);

function mainMediaChanger() {
    document.querySelector('body').classList.contains('collapsed') && burgerCloseHandler();
}

//////////////////////////////////////////////////
// slider
const sliderFrame = document.querySelector('.slide-frame');
let sliderShift = 0;
//slider buttons
document
    .querySelector('.slide-wrapper')
    .addEventListener('click', (e) => {
        remainingTime = 5000;
        e.target.classList.contains('btn-right') && slideShifter('right');
        e.target.classList.contains('btn-left') && slideShifter('left');
    });


// delay for first slide change
timerStart = Date.now();
let timeout = setTimeout(() => {
    slideShifter('right');
}, switchSlideDelay);
sliderControls[0].classList.toggle('active');

// show control animation for the first slide
// sliderControls.forEach(control => control.style.width = '0px')
// let controlInterval = setInterval(() => {
//     sliderControls[0].style.width = activeControlWidth++ + 'px';
// }, 125);
function controlFillInterval(i = 0, width = 0) {
    sliderControls.forEach(control => control.style.width = '0px');
    controlInterval = setInterval(() => {
        sliderControls[i].style.width = width++ + 'px';
    }, 125);
}

// activeControlWidth = 0;

controlFillInterval(0);

const mediaQuery = window.matchMedia('(max-width: 700px)');
mediaQuery.addEventListener('change', changeMediaQuery);


function changeMediaQuery() {
    resetSliderOffset();
}

function resetSliderOffset() {
    // remainingTime = Date.now() - timerStart;
    clearTimeout(timeout);
    sliderControls.forEach(control => control.classList.remove('active'));
    sliderControls[0].classList.toggle('active');
    sliderShift = 0;
    sliderFrame.style.translate = sliderShift + 'px';
    timerStart = Date.now();
    timeout = setTimeout(() => {
        slideShifter('right');
    }, remainingTime);
}

function slideShifter(direction) {
    // console.log(remainingTime);
    const [firstOffset,
        secondOffset,
        thirdOffset,
        endOffset] = mediaQuery.matches ? [0, -448, -896, -1344] : [0, -580, -1160, -1740];

    // remainingTime = Date.now() - timerStart;
    clearInterval(controlInterval);
    clearTimeout(timeout);
    sliderControls.forEach(control => control.classList.remove('active'));

    if (direction === 'right') {
        sliderShift = sliderShift + secondOffset > endOffset ? sliderShift + secondOffset : 0;
    }
    if (direction === 'left') {
        sliderShift = sliderShift - secondOffset > 0 ? thirdOffset : sliderShift - secondOffset;
    }
    sliderFrame.style.translate = sliderShift + 'px';

    sliderShift === firstOffset && sliderControls[0].classList.toggle('active') && controlFillInterval(0, 0);
    sliderShift === secondOffset && sliderControls[1].classList.toggle('active') && controlFillInterval(1, 0);
    sliderShift === thirdOffset && sliderControls[2].classList.toggle('active') && controlFillInterval(2, 0);
    timerStart = Date.now();
    timeout = setTimeout(() => {
        slideShifter('right');
    }, remainingTime);
}

// swiper for touch screen
let x1 = null;
let x2 = null;
let deltaX = 0;
document.querySelector('.slider-content').addEventListener('touchstart', (event) => {
    x1 = event.changedTouches[0].screenX;
    slidePause();
});
document.querySelector('.slider-content').addEventListener('touchend', (event) => {

    x2 = event.changedTouches[0].screenX;
    deltaX = x2 - x1;
    slideResume();
    // handleTouchEnd();
});

function handleTouchEnd() {
    // deltaX = x2 - x1;
    // console.log(Math.abs(deltaX));
    // slideResume();
    // if (x2 - x1 === 0) {
    //     slideResume();
    // } else {
    Math.abs(deltaX) > 100 ? slideShifter('right') : slideShifter('left');
    // }
}

document.querySelector('.slide-container').addEventListener('mouseenter', slidePause);
document.querySelector('.slide-container').addEventListener('mouseleave', slideResume);
//
// document.querySelector('.slide-container').addEventListener('touchmove', slidePause);

function slidePause() {
    const activeControl = document.querySelector('.control.active');
    activeControlWidth = getComputedStyle(activeControl).width;
    remainingTime = 5000 - Date.now() + timerStart;
    clearTimeout(timeout);
    clearInterval(controlInterval);
    // console.log(activeControlWidth);
    // console.log('pause', remainingTime);
}

function slideResume() {
    // console.log(Math.abs(deltaX));
    if (Math.abs(deltaX) > 50) {
        remainingTime = 5000;
        if (deltaX > 0) slideShifter('left');
        if (deltaX < 0) slideShifter('right');
    } else {
        slideShifterCall('right');
    }

}

function slideShifterCall(direction = 'right') {
    timerStart = Date.now();
    // console.log(activeControlWidth);
    sliderControls.forEach((control, index) => {
        if (control.classList.contains('active')) controlFillInterval(index,parseFloat(activeControlWidth));
    });
    timeout = setTimeout(() => {
        slideShifter(direction);
    }, remainingTime);
    remainingTime = 5000;
}
