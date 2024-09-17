const listCard = document.querySelector('.list-card');
const api = 'https://fakestoreapi.com/products';

const pCounter = document.getElementById('p-counter');
const cartBox = document.getElementById('mySidebar');
const cartBtn = document.getElementById('btn-cart');
const closeBtn = document.getElementById('button');



let cartProduct = [];
let pCounterCar = 0;

const getProduct = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data); 
        render(data);
    } catch (error) {
        console.error('Error fetching data', error);
    }
}

const makeCard = (product) => {
    const { id, title, price, description,image, category } = product;
  

    const container = document.createElement('div');
    container.classList.add('card');
    container.id = id;

    const productName = document.createElement('h3');
    productName.textContent = title;

    const productDescription = document.createElement('p');
    productDescription.textContent = description;
    productDescription.classList.add('description')

    const productCategory = document.createElement('p');
    productCategory.textContent = `Categoría: ${category}`;
    productCategory.classList.add('category');

    const productImg = document.createElement('img');
    productImg.src = image; 
    productImg.alt = title;
    productImg.classList.add('image-card');

    const productPrice = document.createElement('p');
    productPrice.textContent = `$${price}`;
    productPrice.classList.add('pricing');

    const btnCard = document.createElement('button');
    btnCard.textContent = 'Agregar al carrito';
    btnCard.classList.add('btn-add-cart');
    btnCard.addEventListener('click', () => addToCart(product));

    container.appendChild(productName);
    container.appendChild(productImg);
    container.appendChild(productDescription);
    container.appendChild(productCategory);
    container.appendChild(productPrice);
    container.appendChild(btnCard);

    listCard.appendChild(container);
}

const render = (data) => {
    listCard.innerHTML = '';
    data.forEach(product => {
        makeCard(product);
    });
}

function addToCart(product) {
    const existingProduct = cartProduct.find(p => p.id === product.id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cartProduct.push({
            id: product.id,
            name: product.title,
            price: product.price,
            img: product.image,
            quantity: 1
        });
    }

    pCounterCar++;
    pCounter.textContent = pCounterCar;

    localStorage.setItem('cart', JSON.stringify(cartProduct));

    updateCart();
}

function updateCart() {
    const existingItems = document.querySelectorAll('.bar-item');
    existingItems.forEach(item => item.remove());

    cartProduct.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('bar-item');

        const itemInfo = document.createElement('div');
        itemInfo.classList.add('items-pd');

        const itemImg = document.createElement('img');
        itemImg.src = item.img;
        itemImg.alt=item.title;
        console.log(itemImg);

        const itemName = document.createElement('p');
        itemName.textContent = `${item.name} - $${item.price * item.quantity}`;

        itemInfo.appendChild(itemImg);
        itemInfo.appendChild(itemName);

        const quantityControls = document.createElement('div');
        quantityControls.classList.add('quantity');

        const decrementBtn = document.createElement('button');
        decrementBtn.classList.add('.barBtn')
        decrementBtn.textContent = '-';
        decrementBtn.addEventListener('click', () => changeQuantity(item.id, -1));

        const quantityDisplay = document.createElement('span');
        quantityDisplay.textContent = item.quantity;

        const incrementBtn = document.createElement('button');
        incrementBtn.textContent = '+';
        incrementBtn.addEventListener('click', () => changeQuantity(item.id, 1));

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Eliminar';
        removeBtn.addEventListener('click', () => removeItem(item.id));

        quantityControls.appendChild(decrementBtn);
        quantityControls.appendChild(quantityDisplay);
        quantityControls.appendChild(incrementBtn);
        quantityControls.appendChild(removeBtn);

        cartItem.appendChild(itemInfo);
        cartItem.appendChild(quantityControls);

        cartBox.appendChild(cartItem);
    });
}

function changeQuantity(productId, amount) {
    const product = cartProduct.find(p => p.id === productId);

    if (product) {
        product.quantity += amount;

        if (product.quantity <= 0) {
            cartProduct.splice(cartProduct.indexOf(product), 1);
        }
    }

    pCounterCar += amount;
    pCounter.textContent = pCounterCar;

    localStorage.setItem('cart', JSON.stringify(cartProduct));

    updateCart();
}

function removeItem(productId) {
    const productIndex = cartProduct.findIndex(p => p.id === productId);

    if (productIndex > -1) {
        pCounterCar -= cartProduct[productIndex].quantity;
        cartProduct.splice(productIndex, 1);
        pCounter.textContent = pCounterCar;

        localStorage.setItem('cart', JSON.stringify(cartProduct));

        updateCart();
    }
}

function openCart() {
    cartBox.style.display = "block";
}

function closeCart() {
    cartBox.style.display = "none";
}

cartBtn.addEventListener('click', () => {
    console.log('Botón de carrito clickeado');
    openCart();
});

closeBtn.addEventListener('click', () => {
    console.log('Botón de cerrar clickeado');
    closeCart();
});

function loadCart() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cartProduct.push(...JSON.parse(storedCart));
        pCounterCar = cartProduct.reduce((total, item) => total + item.quantity, 0);
        pCounter.textContent = pCounterCar;
        updateCart();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    getProduct(api);
});
