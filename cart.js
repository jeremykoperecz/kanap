let cart = [];
console.log(cart);
const validation = document.querySelector("#order");

retrieve()
cart.forEach((item) => displayItem(item));

function retrieve() {
    const numberItem = localStorage.length;
    for (let i = 0; i < numberItem; i++) {
        const item = localStorage.getItem(localStorage.key(i));
        const itemObject = JSON.parse(item);
        cart.push(itemObject);
    }
}
    document.getElementById("cart__items").innerHTML = `
    <article class="cart__item">
    <div class="cart__item__img">
    <img class="cart__item__img" src="${cart.image}" alt="${cart.altTxt}"/>
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
    `



