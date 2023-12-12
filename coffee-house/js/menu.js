const infoIconURL = './assets/icons/info-empty.svg';
//burger
const burger = document.querySelector('.burger-button');

burger.addEventListener('click', () => {
    document.querySelector('body').classList.toggle('collapsed');
    document.querySelector('.burger-button').classList.toggle('collapsed');
    const burgerWrapper = document.querySelector('.burger-wrapper');
    burgerWrapper.classList.toggle('collapsed');
    if (burgerWrapper.classList.contains('collapsed')) {
        burgerWrapper.style.left = '0';
        burgerWrapper.style.opacity = '1';
    }else {
        burgerWrapper.style.left = '110vw';
        burgerWrapper.style.opacity = '0';
    }
});
//////////////////////////////////////////////////

//////////////////////////////////////////////////
let gridItems = [];
let tabIndex = [];

// console.log(menuRefreshButton);

const menuRefreshButton = document.querySelector('.menu-circle-button');
menuRefreshButton.addEventListener('click', refreshButtonHandler);

function refreshButtonHandler() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.style.display = 'flex');
    menuRefreshButton.style.display = 'none';
}

const gridPreview = document.querySelector('.preview__grid');
gridPreview.addEventListener('click', (e) => {
    let isCard = !!e.target.closest('.card');
    if (isCard) {
        renderModalToDom(e.target.closest('.card').getAttribute('data-id'));
    }
});
window.onload = function () {
    //tabs handler
    addTabsClickHandler();
    renderCardsToDom('coffee');
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
    // console.log(e.target.closest('.tab').classList.contains('tab-coffee'));
    e.target.closest('.tab').classList.contains('tab-coffee') && renderCardsToDom('coffee');
    e.target.closest('.tab').classList.contains('tab-tea') && renderCardsToDom('tea');
    e.target.closest('.tab').classList.contains('tab-dessert') && renderCardsToDom('dessert');
};
const removeActiveTabStyle = () => {
    tabBtn.forEach(button => {
        if (button.classList.contains('active')) {
            button.classList.remove('active');
            button.classList.remove('tab-no-clickable');
        }
    });
};

const renderCardsToDom = async (tabname) => {
    await loadData();
    // console.log(gridItems[0].name);
    let previewGrid = getPreviewGrid();
    generateCards(gridItems.filter(card => card.category === tabname)).forEach(card => {
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
    bodyDom.style.overflow = 'hidden';
    // console.log('renderModalToDom', id);
    // console.log(gridItems.find(card => card.id == id)); // получаем объект с данными карточки по которой кликнули
    bindModalEvents();
};
const bindModalEvents = () => {
    const overlay = document.querySelector('.overlay');
    overlay.addEventListener('click', modalEvents);
};
const modalEvents = async (e) => {
    await loadData();
    let cardData;
    const tab = e.target.closest('.tab'); // по какой кнопке кликнули
    let eventClasses = e.target.classList;
    if (eventClasses.contains('overlay') || eventClasses.contains('modal-close-button')) {
        document.querySelector('.overlay').remove();
        document.querySelector('body').style.overflow = 'visible';
        return;
    }
    cardData = gridItems.find(card => card.id === +e.target.closest('.modal-card').getAttribute('data-idx'));
    const sizes = document.querySelectorAll('.tab-size');
    const tabs = document.querySelectorAll('.modal-description .tab');
    let tabActiv = [];
    const prices = [
        cardData.sizes.s['add-price'],
        cardData.sizes.m['add-price'],
        cardData.sizes.l['add-price'],
        cardData.additives[0]['add-price'],
        cardData.additives[1]['add-price'],
        cardData.additives[2]['add-price'],
    ];

    // console.log(eventClasses,e.target.closest('.modal-card').getAttribute('data-idx'));
    if (tab) {
        if (tab.classList.contains('tab-additives')) {
            tab.classList.toggle('active');
        }
        if (tab.classList.contains('tab-size')) {
            sizes.forEach(tab => {
                tab.classList.remove('active');
                tab.classList.remove('tab-no-clickable');
            });
            tab.classList.add('active');
            tab.classList.add('tab-no-clickable');

        }
    }
    tabs.forEach(tab => tab.classList.contains('active') ? tabActiv.push(1) : tabActiv.push(0));
    // console.log(tabActiv, prices);
    let totalPrice = tabActiv.reduce((sum, check, index) => {
        if (check === 0) return sum;
        else {
            return sum + +prices[index];
        }
    }, +cardData.price);
    // console.log(totalPrice);
    updatePrice(totalPrice);
};

const updatePrice = (price) => {
    const priceTotal = document.querySelector('.price-total');
    priceTotal.textContent = price.toFixed(2);
};

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

        template += `<div class="modal-card" data-idx="${this.id}">`;

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
        template += `<div class="tab tab-size size-small active tab-no-clickable">`;
        template += `<div class="tab-icon">S</div>`;
        template += `<p>${this.sizes.s.size}</p>`;
        template += `</div>`; // tab
        template += `<div class="tab tab-size size-medium">`;
        template += `<div class="tab-icon">M</div>`;
        template += `<p>${this.sizes.m.size}</p>`;
        template += `</div>`; // tab
        template += `<div class="tab tab-size size-large">`;
        template += `<div class="tab-icon">L</div>`;
        template += `<p>${this.sizes.l.size}</p>`;
        template += `</div>`; // tab
        template += `</div>`;// modal-size-buttons

        template += `</div>`; //momdal-size

        template += `<div class="modal-additives">`;
        template += `<p>Additives</p>`;

        template += `<div class="modal-additives-buttons">`;
        template += `<div class="tab tab-additives additives-one">`;
        template += `<div class="tab-icon">1</div>`;
        template += `<p>${this.additives[0].name}</p>`;
        template += `</div>`; // tab
        template += `<div class="tab tab-additives additives-two">`;
        template += `<div class="tab-icon">2</div>`;
        template += `<p>${this.additives[1].name}</p>`;
        template += `</div>`; // tab
        template += `<div class="tab tab-additives additives-three">`;
        template += `<div class="tab-icon">3</div>`;
        template += `<p>${this.additives[2].name}</p>`;
        template += `</div>`; // tab
        template += `</div>`; //momdal-additives-buttons

        template += `</div>`; //momdal-additives

        template += `<div class="modal-total">`;
        template += `<h3>Total:</h3>`;
        template += `<h3 class="modal-price"><span>&#36;</span><span class="price-total">${this.price}</span></h3>`;
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
