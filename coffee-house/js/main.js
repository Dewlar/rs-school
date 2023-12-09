const burger = document.querySelector('.burger-button');
const headerNavigation = document.querySelector('.header__navigation');
const headerMenuButton = document.querySelector('.header-menu-button');
const headerLogo = document.querySelector('.header__logo');
const headerWrapper = document.querySelector('.header__wrapper');
const body = document.body;
const navLinks = document.querySelector('.main-navigation');

burger.addEventListener('click', () => {
    burger.classList.toggle('burger-checked');
    headerNavigation.classList.toggle('burger-checked');
    headerMenuButton.classList.toggle('burger-checked');
    headerLogo.classList.toggle('burger-checked');
    headerWrapper.classList.toggle('burger-checked');
    body.classList.toggle('burger-checked');
});
navLinks.addEventListener('click', (e) => {
    if (e.target.classList.contains('link-animation')) {
        burger.classList.remove('burger-checked');
        headerNavigation.classList.remove('burger-checked');
        headerMenuButton.classList.remove('burger-checked');
        headerLogo.classList.remove('burger-checked');
        headerWrapper.classList.remove('burger-checked');
        body.classList.remove('burger-checked');
    }
});
