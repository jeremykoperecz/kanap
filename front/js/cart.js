const item = localStorage.getItem('cartCanap');
const cartLocalStorage = JSON.parse(item);

cartLocalStorage.forEach((item) => displayItem(item))
  
   async function displayItem(item) {
        
        
        const article = makeArticle(item)
        displayArticle(article)
        const image = inserImage(item)
        const div = inserImage(item)
        article.appendChild(div)
        const cartItemContent = await makeCartItemContent(item)
        article.appendChild(cartItemContent)
        displayTotalPrice(item)
        displayTotalQuantity(item)
        
    };
 
   

//creation des carts produits 
async function makeCartItemContent(item) {
    fetch(`http://localhost:3000/api/product/${item.id}`)
        .then(res => res.json())
        .then(productFromAPI => productFromAPI.price = item.price);
    
      
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
    // creation de l'input de selection de la quantité
    const buttonQuantity = document.createElement('input');
    buttonQuantity.type = 'number';
    buttonQuantity.classList.add('itemQuantity');
    buttonQuantity.name = 'itemQuantity';
    buttonQuantity.value = item.quantity;
    buttonQuantity.min = '1';
    buttonQuantity.max = '100';
    buttonQuantity.addEventListener('input', () => moreLessQuantity(item.id, buttonQuantity.value, item));
    
    // Creation du bouton supprimer
    const deleteItem = document.createElement('div');
    deleteItem.classList.add('cart__item__content__settings__delete');
    const pDelete = document.createElement('p');
    pDelete.classList.add('deleteItem');
    pDelete.textContent = 'Supprimer';
    deleteItem.addEventListener('click', () => deleteItemCart(item))
    
    itemQuantity.appendChild(buttonQuantity);
    settings.appendChild(itemQuantity);
    deleteItem.appendChild(pDelete);
    settings.appendChild(deleteItem);

    return divMakeCart
};
// creation de la fonction de suppression du localstorage
function deleteItemCart(item) {
    const itemCartDelete = item.findIndex((canap) => canap.id === item.id && canap.color === item.color);
    item.splice(itemCartDelete, 1);
    deleteData(item);
    deleteDataPage(item);
    displayTotalPrice();
    displayTotalQuantity();

}
function deleteData(item) { 
    const key = `${item.id}_${item.color}`
    localStorage.removeItem(key); 
}
// fonction de suppression de la cart sur la page html
function deleteDataPage(item) {
    const deletePage = document.querySelector
        (`article[data-id="${item.id}"]`); 
    deletePage.remove();
}
// ajout de produit 
function moreLessQuantity(id, newQuantity, item) {
    const moreItems = item.find((item) => item.id === id);
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

//fonction de calcul de la quantité
function displayTotalQuantity() {
    let total = 0;
    const totalQ = document.querySelector('#totalQuantity')
    items.forEach((canap) => {
        const totalQuantity = canap.quantity 
        total = total + totalQuantity
    })
    totalQ.textContent = total
} 
//foncton de calcul du prix
function displayTotalPrice() {
    let total = 0;
    const totalP = document.querySelector('#totalPrice')
    item.forEach((canap) => {
        const totalPrice = canap.price * canap.quantity
        total = total + totalPrice
    })
    totalP.textContent = total
}



const command = document.querySelector('#order');
command.addEventListener('click', (e) => submitForm(e)); 


const nameForm = document.querySelector('#firstName')
//envoie des données du formulaire dans le localstorage
function submitForm(e) {
    e.preventDefault();
    if (item.length === 0) return alert('Please select items first')
    
    if (validationFormulaire()) return;
    if (validationEmail()) return;
    if (tooMuchProduct()) return;
    
    const body = backRequest();
    fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            const orderId = data.orderId
            window.location.href = `./confirmation.html?orderId=${orderId}`;
        })

}

function backRequest() { 
    const body = {
        contact: {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value
        },
        products: getIdFromLocalStorage()
    }
    return body
}
//recuperation de l'id
function getIdFromLocalStorage() {
    const numberProducts = localStorage.length;
    const ids = []
    for (let i = 0; i < numberProducts; i++) {
        const key = localStorage.key(i)      
        const id = key.split("_")[0]
        ids.push(id)           
    }
return ids
}
//fonction de verification de la quantité la couleur ainsi que le formulaire
function validationFormulaire() {
    const form = document.querySelector('.cart__order__form')
    const inputs = form.querySelectorAll('input')
    inputs.forEach((input) => {
        if (input.value === '') {
            alert('veuillez remplir le formulaire')
            return true
        }
    return false
    })
}

function validationEmail() {
    const email = document.querySelector('#email').value;
    const regex = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/;
    if (regex.test(email) === false) {
       alert('invalid email address!')
        return true
    }  
   return false
}

function tooMuchProduct() {
    const tooMuchCanap = document.querySelector('.itemQuantity').value;
    if (tooMuchCanap > 100 || tooMuchCanap < 1) {
        alert('choisir entre 1 et 100 articles')
        return true
    }
    return false
}



