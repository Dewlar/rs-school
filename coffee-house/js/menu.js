// burger menu
const infoIconURL = './assets/icons/info-empty.svg';
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

//////////////////////////////////////////////////
let gridItems = [];
const gridPreview = document.querySelector('.preview__grid');
gridPreview.addEventListener('click', (e) => {
    // console.log(e.target.closest('.card'));
    renderModalToDom(e.target.closest('.card').getAttribute('data-id'));
});
window.onload = function () {

    //tabs handler
    addTabsClickHandler();
    renderCardsToDom();
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

const renderCardsToDom = async () => {
    await loadData();
    // console.log(gridItems[0].name);
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
    constructor({id, name, description, price, image, category}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.category = category;
    }

    // menu card-item generator
    generateMenuItem() {
        let template = '';
        let card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = this.id;

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

const renderModalToDom = async (id) => {
    await loadData();
    const bodyDom = document.querySelector('body');
    const modalOverlay = new Modal(gridItems.find(card => card.id === +id));
    bodyDom.append(modalOverlay.generateModalOverlay());
    // console.log('renderModalToDom', id);
    // console.log(gridItems.find(card => card.id == id)); // получаем объект с данными карточки по которой кликнули
    bindModalCloseEvents();
};
const bindModalCloseEvents = () => {
    const overlay = document.querySelector('body')
    overlay.addEventListener('click', closeModal)
}
const closeModal = (e) => {
    let eventClasses = e.target.classList;
    if (eventClasses.contains('overlay') || eventClasses.contains('modal-close-button')){
        document.querySelector('.overlay').remove();
    }
}
class Modal {
    constructor({id, name, description, price, category, image, sizes, additives}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.category = category;
        this.sizes = sizes;
        this.additives = additives;
    }

    // menu modal generator
    generateModalOverlay() {
        let template = '';
        let overlay = document.createElement('div');
        overlay.className = 'overlay';

        template += `<div class="modal-card">`;

        template += `<div class="modal-img">`;
        template += `<img src="assets/menu/${this.image}" alt="card image">`;
        template += `</div>`; //modal img

        template += `<div class="modal-description">`;

        template += `<div class="modal-title">`;
        template += `<h3>${this.name}</h3>`;
        template += `<p>${this.description}</p>`;
        template += `</div>`; //modal-title

        template += `<div class="modal-size">`;
        template += `<p>Size</p>`;

        template += `<div class="modal-size-buttons">`;
        template += `<div class="tab active tab-no-clickable">`;
        template += `<div class="tab-icon">S</div>`;
        template += `<p>${this.sizes.s.size}</p>`;
        template += `</div>`; // tab
        template += `<div class="tab">`;
        template += `<div class="tab-icon">M</div>`;
        template += `<p>${this.sizes.m.size}</p>`;
        template += `</div>`; // tab
        template += `<div class="tab">`;
        template += `<div class="tab-icon">L</div>`;
        template += `<p>${this.sizes.l.size}</p>`;
        template += `</div>`; // tab
        template += `</div>`;// modal-size-buttons

        template += `</div>`; //momdal-size

        template += `<div class="modal-additives">`;
        template += `<p>Additives</p>`;

        template += `<div class="modal-additives-buttons">`;
        template += `<div class="tab">`;
        template += `<div class="tab-icon">1</div>`;
        template += `<p>${this.additives[0].name}</p>`;
        template += `</div>`; // tab
        template += `<div class="tab">`;
        template += `<div class="tab-icon">2</div>`;
        template += `<p>${this.additives[1].name}</p>`;
        template += `</div>`; // tab
        template += `<div class="tab">`;
        template += `<div class="tab-icon">3</div>`;
        template += `<p>${this.additives[2].name}</p>`;
        template += `</div>`; // tab
        template += `</div>`; //momdal-additives-buttons

        template += `</div>`; //momdal-additives

        template += `<div class="modal-total">`;
        template += `<h3>Total:</h3>`;
        template += `<h3 class="modal-price">&#36;${this.price}</h3>`;
        template += `</div>`; //modal-total

        template += `<div class="modal-info">`;
        template += `<img src="${infoIconURL}" alt="info">`;
        template += `<p>The cost is not final. Download our mobile app to see the final price and place your order. Earn
                    loyalty points and enjoy your favorite coffee with up to 20% discount.</p>`;
        template += `</div>`; //modal-info

        template += `<div class="modal-close-button">Close</div>`;

        template += `</div>`; //modal description
        template += `</div>`; //modal card

        overlay.innerHTML = template;
        return overlay;
    }
}
