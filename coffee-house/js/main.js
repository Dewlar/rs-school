const burger = document.querySelector('.burger-button');
const navLinks = document.querySelector('.main-navigation');
const burgerElements = document.querySelectorAll('.head-bg');

burger.addEventListener('click', () => {
    burgerElements
        .forEach(e => e.classList.toggle('burger-checked'));
});
navLinks.addEventListener('click', (e) => {
    if (e.target.classList.contains('link-animation')) {
        burgerElements
            .forEach(e => e.classList.remove('burger-checked'));
    }
});
