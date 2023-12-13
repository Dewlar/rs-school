const switchSlideDelay = 5000;
const sliderControls = document.querySelectorAll('.control');

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
        e.target.classList.contains('btn-right') && slideShifter('right');
        e.target.classList.contains('btn-left') && slideShifter('left');
    });


// delay for first slide change
let timeout = setTimeout(() => {
    slideShifter('right');
}, switchSlideDelay);


// show control animation for the first slide
sliderControls[0].classList.toggle('active');


const mediaQuery = window.matchMedia('(max-width: 700px)');
mediaQuery.addEventListener('change', changeMediaQuery);


function changeMediaQuery() {
    resetSliderOffset();
}

function resetSliderOffset() {
    clearTimeout(timeout);
    sliderControls.forEach(control => control.classList.remove('active'));
    sliderControls[0].classList.toggle('active');
    sliderShift = 0;
    sliderFrame.style.translate = sliderShift + 'px';
    timeout = setTimeout(() => {
        slideShifter('right');
    }, switchSlideDelay);
}

function slideShifter(direction) {
    const [firstOffset,
        secondOffset,
        thirdOffset,
        endOffset] = mediaQuery.matches ? [0, -448, -896, -1344] : [0, -580, -1160, -1740];

    clearTimeout(timeout);
    sliderControls.forEach(control => control.classList.remove('active'));

    if (direction === 'right') {
        sliderShift = sliderShift + secondOffset > endOffset ? sliderShift + secondOffset : 0;
    }
    if (direction === 'left') {
        sliderShift = sliderShift - secondOffset > 0 ? thirdOffset : sliderShift - secondOffset;
    }
    sliderFrame.style.translate = sliderShift + 'px';

    sliderShift === firstOffset && sliderControls[0].classList.toggle('active');
    sliderShift === secondOffset && sliderControls[1].classList.toggle('active');
    sliderShift === thirdOffset && sliderControls[2].classList.toggle('active');
    timeout = setTimeout(() => {
        slideShifter('right');
    }, switchSlideDelay);
}

// swiper for touch screen
let x1 = null;
let x2 = null;
document.querySelector('.slider-content').addEventListener('touchstart', (event) => {
    x1 = event.changedTouches[0].screenX;
});
document.querySelector('.slider-content').addEventListener('touchend', (event) => {
    x2 = event.changedTouches[0].screenX;
    handleTouchEnd();
});

function handleTouchEnd() {
    x2 - x1 < 0 ? slideShifter('right') : slideShifter('left');
}
