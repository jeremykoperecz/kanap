let local = JSON.parse (localStorage.getItem("panier")) || [];
const validation = document.querySelector("#order");
const mlButton = document.querySelector(".itemQuantity");
console.log(mlButton);
let order = [];
let totalQuantity = local.quantity;
let totalPrice = local.price;
let total = totalQuantity * totalPrice;

console.log(total);

/*function addItem(item) {
    order.push (item);
    localStorage.setItem("panier", JSON.stringify (order)); */
    


    document.getElementById("cart__items").innerHTML = `
    <article class="cart__item">
    <div class="cart__item__img">
    <img class="cart__item__img" src="${local.image}" alt="${local.altTxt}"/>
    </div>
    <div class="cart__item__content">
    <h2 class="cart__item__content__description"> ${local.name}</h2>
    <p class="cart__item__content__description"> ${local.color}</p>
    <p class="cart__item__content__description"> ${local.price} € </p>
    <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
    <p>Qté : ${local.quantity} </p>
    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value= ${local.quantity}>
    </div>
    <div class="cart__item__content__settings__delete">
    <p class="deleteItem">Supprimer</p>
    </div>
    </div>
    </div>
    </article>
    `

if (totalQuantity > 100) {
    alert("pas plus de 100 produits");
}
document.getElementById("totalPrice").innerHTML = total
if (local.quantity++) {
    
    
}

