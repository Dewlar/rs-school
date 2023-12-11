// burger menu
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
//////////////////////////////////////////////////
let gridItems = [];

window.onload = function () {

    //tabs handler
    addTabsClickHandler();
    renderArticlesToDom();
};

const loadData = async () => {
    const response = await fetch("./db/products.json");
    gridItems = await response.json();
    // console.log(gridItems[0].name);
};
// await loadData();

const tabBtn = document.querySelectorAll('.offer__tabs .tab');
const addTabsClickHandler = () => {
    tabBtn.forEach(button => button.addEventListener('click', switchTab));
};
const switchTab = (e) => {
    removeActiveTabStyle();
    e.currentTarget.classList.add('active');
    e.currentTarget.classList.add('tab-no-clickable');
};
const removeActiveTabStyle = () => {
    tabBtn.forEach(button => {
        if (button.classList.contains('active')) {
            button.classList.remove('active');
            button.classList.remove('tab-no-clickable');
        }
    });
};

const renderArticlesToDom = async () => {
    await loadData();
    let previewGrid = getPreviewGrid();
    generateCards(gridItems).forEach(card => {
        previewGrid.append(card.generateMenuItem());
    });
};

const getPreviewGrid = () => {
    const gridContainer = document.querySelector('.preview__grid');
    gridContainer.innerHTML = ''; // todo: remove this when card will be generated
    return gridContainer;
};


const generateCards = (data) => {
    let cards = [];
    data.forEach(card => {
        // console.log(card.category); // todo: можно разделить на категории
        cards.push(new MenuCard(card));
    });
    return cards;
};

class MenuCard {
    constructor({name, description, price, image, category, ...rest}) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.category = category;
        this.rest = [...rest];
    }

    // menu card-item generator
    generateMenuItem() {
        let template = '';
        let card = document.createElement('div');
        card.className = 'card';
        // card.dataset.id = 1;

        template += `<div class="card__photo">`;
        template += `<img src="assets/menu/${this.image}" alt="coffee preview">`;
        template += `</div>`;
        template += `<div class="card__description">`;
        template += `<h3>${this.name}</h3>`;
        template += `<p>${this.description}</p>`;
        template += `<h3>${this.price}</h3>`;
        template += `</div>`;

        card.innerHTML = template;
        return card;
    }
}
