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
}
function makeCartItemContent(item) {
    const div = document.createElement('div')
    div.classList.add('cart__item__content')
    const description = document.createElement('div') 
    description.classList.add('cart__item__description')
    const h2 = document.createElement('h2')
    h2.textContent = item.name
    const p = document.createElement('p')
    p.textContent = item.color
    const p2 = document.createElement('p')
    p2.textContent = item.price + "€"
    description.appendChild(h2)
    description.appendChild(p)
    description.appendChild(p2)
    div.appendChild(description)
    return div


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
    const div = document.createElement('div');
    div.classList.add('cart__item__img');
    const image = document.createElement('img');
    image.src = item.image
    image.alt = item.altTxt
    div.appendChild(image);
    return div;
    
}






















   /* document.getElementById("cart__items").innerHTML =  `
    <article class="cart__item">
    <div class="cart__item__img">
    <img class="cart__item__img" src="${produit.image}" alt="${produit.altTxt}"/>
    </div>
    <div class="cart__item__content">
    <h2 class="cart__item__content__description"> ${cart.name}</h2>
    <p class="cart__item__content__description"> ${cart.color}</p>
    <p class="cart__item__content__description"> ${cart.price} € </p>
    <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
    <p>Qté : ${cart.quantity} </p>
    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value= ${cart.quantity}>
    </div>
    <div class="cart__item__content__settings__delete">
    <p class="deleteItem">Supprimer</p>
    </div>
    </div>
    </div>
    </article>
    `*/
    
  
