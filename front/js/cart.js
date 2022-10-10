let cart = [];
console.log(cart);


retrieve()
cart.forEach((item) => displayItem(item))

function retrieve() {

    const numberItem = localStorage.length;
    for (let i = 0; i < numberItem; i++) {
        const item = localStorage.getItem(localStorage.key(i));
        const itemObject = JSON.parse(item);
        cart.push(itemObject);
    }
 

}  
function displayItem(item) {
    const article = makeArticle(item)
    displayArticle(article)
    const image = inserImage(item)
    const div = inserImage(item)
    article.appendChild(div)
    const cartItemContent = makeCartItemContent(item)
    article.appendChild(cartItemContent)
    displayTotalPrice(item)
    displayTotalQuantity(item)

}
function makeCartItemContent(item) {
    const divMakeCart = document.createElement('div')
    divMakeCart.classList.add('cart__item__content')

    const description = document.createElement('div') 
    description.classList.add('cart__item__content__description')

    const h2 = document.createElement('h2')
    h2.textContent = item.name
    const p = document.createElement('p')
    p.textContent = item.color
    const p2 = document.createElement('p')
    p2.textContent = item.price + "€"

    description.appendChild(h2)
    description.appendChild(p)
    description.appendChild(p2)
    divMakeCart.appendChild(description)
    
    const settings = document.createElement('div');
    settings.classList.add('cart__item__content__settings');
    divMakeCart.appendChild(settings);

    const itemQuantity = document.createElement('div');
    itemQuantity.classList.add('cart__item__content__settings__quantity');

    const pQuantity = document.createElement('p');
    pQuantity.textContent = ('Qté : ')
    itemQuantity.appendChild(pQuantity)

    const buttonQuantity = document.createElement('input');
    buttonQuantity.type = 'number';
    buttonQuantity.classList.add('itemQuantity');
    buttonQuantity.name = 'itemQuantity';
    buttonQuantity.value = item.quantity;
    buttonQuantity.min = '1';
    buttonQuantity.max = '100';
    buttonQuantity.addEventListener('input', () => moreLessQuantity(item.id, buttonQuantity.value, item));

    const deleteItem = document.createElement('div');
    deleteItem.classList.add('cart__item__content__settings__delete');
    const pDelete = document.createElement('p');
    pDelete.classList.add('deleteItem');
    pDelete.textContent = 'Supprimer';
    deleteItem.addEventListener('click', () => deleteItemCart (item))    
    
    itemQuantity.appendChild(buttonQuantity);
    settings.appendChild(itemQuantity);
    deleteItem.appendChild(pDelete);
    settings.appendChild(deleteItem);

    return divMakeCart
}
function deleteItemCart(item) {
    const itemCartDelete = cart.findIndex((canap) => canap.id === item.id && canap.color === item.color);
    cart.splice(itemCartDelete, 1);
    deleteData(item);
    deleteDataPage(item);
    displayTotalPrice();
    displayTotalQuantity();

}
function deleteData(item) { 
    const key = `${item.id}_${item.color}`
    localStorage.removeItem(key); 
}

function deleteDataPage(item) {
    const deletePage = document.querySelector
        (`article[data-id="${item.id}"]`); 
    console.log('deletePage', deletePage)
    deletePage.remove();
}

function moreLessQuantity(id, newQuantity, item) {
    const moreItems = cart.find((item) => item.id === id);
    moreItems.quantity = Number(newQuantity);
    displayTotalPrice();
    displayTotalQuantity();
    newData(item)
}
function newData(item) { 
    const saveData = JSON.stringify(item);
    localStorage.setItem(item.id, saveData);
}
function displayArticle(article) {
    document.querySelector("#cart__items").appendChild(article);

}
function makeArticle (item) {  
    const article = document.createElement('article');
    article.classList.add('cart__item')
    article.dataset.id = item.id;
    article.dataset.color = item.color;
    return article;
    
}
function inserImage(item) { 
    const divImage = document.createElement('div');
    divImage.classList.add('cart__item__img');
    const image = document.createElement('img');
    image.src = item.image
    image.alt = item.altTxt
    divImage.appendChild(image);
    return divImage;
}

function displayTotalQuantity() {
    let total = 0;
    const totalQ = document.querySelector('#totalQuantity')
    cart.forEach((canap) => {
        const totalQuantity = canap.quantity 
        total = total + totalQuantity
    })
    totalQ.textContent = total
} 


function displayTotalPrice() {
    let total = 0;
    const totalP = document.querySelector('#totalPrice')
    cart.forEach((canap) => {
        const totalPrice = canap.price * canap.quantity
        total = total + totalPrice
    })
    totalP.textContent = total
}

const command = document.querySelector('#order');
command.addEventListener('click', (e) => submitForm(e)); 


const nameForm = document.querySelector('#firstName')

function submitForm(e) {
    e.preventDefault();
    if (cart.length === 0)  return  alert('Please select items first')
    const form = document.querySelector('.cart__order__form')
    const body = backRequest();
    fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
        'Content-Type': 'application/json'
    }
    })
        .then((res) => res.json())
        .then((data) => console.log(data))          
}
for (let key in localStorage) {
    console.log(key);
}
    
function backRequest() {
   
    const back = {
        contact: {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value
        },
    
        products: [item.id]
    }
    
    return back;
}
console.log(backRequest);







   