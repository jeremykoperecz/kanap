/**
 * Déclaration des variables globales
 */
const item = localStorage.getItem("cartCanap");
const cartLocalStorage = JSON.parse(item);
/**
 * {[{id: string, price: number}]}
 */
let canapsWithPricesFromApi = {};

/**
 * Déclaration des fonctions
 */
async function getPrices() {
  canapsWithPricesFromApi = await fetch(`http://localhost:3000/api/products/`)
    .then((res) => res.json())
    .then((canaps) =>
      canaps.map((canap) => {
        return {
          id: canap._id,
          price: canap.price,
        };
      })  
  );
}

async function addQuantityListener() {
  // récupération de l'input
  const inputs = document.querySelectorAll(".itemQuantity");
  // ajout du listener sur l'événement "change"
  inputs.forEach((tagQuantity) =>
    tagQuantity.addEventListener("change", () => {
      // mettre à jour la quantité de ce canap dans le localstorage
      tagQuantity ++ ;
      cartLocalStorage.push(canap);
      // mettre à jour la quantité totale dans le DOM
      displayTotalQuantity();
      displayTotalPrice();
    })
  );
}

// calcul de la quantité total
function displayTotalQuantity() {
  let total = 0;
  cartLocalStorage.forEach((canap) => (total += canap.quantity));
  document.querySelector("#totalQuantity").textContent = total;
}
function price() {
  
}
// calcul du prix total
function displayTotalPrice() {
  let totalPrice = 0;
  cartLocalStorage.forEach((canap) => {
    price = canapsWithPricesFromApi
      .filter((canapFromPrice) => canapFromPrice.id === canapFromPrice.id)
      .pop(); // mettre dans une fonction
    totalPrice = canap.quantity * price;
    console.log(price);
  });
  document.querySelector("#totalPrice").textContent = totalPrice;
}

async function displayItem(canap) {
  document.getElementById("cart__items").innerHTML = cartLocalStorage.map(
    (canap) => `
<article class="cart__item" data-id=${canap.id} data-color=${canap.color}>
                <div class="cart__item__img">
                <img src="${canap.image}" alt=${canap.altTxt}>
                </div>
                <div class="cart__item__content">

                  <div class="cart__item__content__description">
                    <h2>${canap.name}</h2>
                    <p>${canap.color}</p>
                    <p> ${price.value} €</p>
                  </div>

                  <div class="cart__item__content__settings">

                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${canap.quantity}>
                    </div>

                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>

                  </div>
                  
                </div>
              </article> `
  );
  
  getPrices();
  displayTotalQuantity();
  displayTotalPrice();
  removeItem(canap);
}

// supprimer un canap du panier
function removeItem(canap) {
  // selectionne le bouton supprimer
  const deleteButton = document.querySelector(".deleteItem");
  // supprime la cart du localstorage
  deleteButton.addEventListener("click", () =>
    cartLocalStorage.removeItem(canap)
  );
}

function updateQuantity() {
  const moreItems = cartLocalStorage.find((canap) => canap.id === id);
  moreItems.quantity = Number(newQuantity);
  displayTotalPrice();
  displayTotalQuantity();
  newData(cartLocalStorage);
}

function newData(canap) {
  const saveData = JSON.stringify(canap);
  localStorage.setItem(canap.id, saveData);
}

//envoie des données du formulaire dans le localstorage
function submitForm(event) {
  event.preventDefault();
  if (item.length === 0) return alert("Please select items first");

  if (!isFormValid() || validationEmail() || tooMuchProduct()) return; // TODO

  const body = backRequest();
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(
      (order) =>
        (window.location.href = `./confirmation.html?orderId=${order.orderId}`)
    );
}

function backRequest() {
  const body = {
    contact: {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    },
    products: getIdFromLocalStorage(),
  };
  return body;
}
//recuperation de l'id
function getIdFromLocalStorage() {
  const numberProducts = localStorage.length;
  const ids = [];
  for (let i = 0; i < numberProducts; i++) {
    const key = localStorage.key(i);
    const id = key.split("_")[0];
    ids.push(id);
  }
  return ids;
}
//fonction de verification de la quantité la couleur ainsi que le formulaire
function isFormValid() {
  const form = document.querySelector(".cart__order__form");
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    if (input.value === "") {
      alert("veuillez remplir le formulaire");
      return false;
    }
    return true;
  });
}

function validationEmail() {
  const email = document.querySelector("#email").value;
  const regex = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/;
  if (regex.test(email) === false) {
    alert("invalid email address!");
    return true;
  }
  return false;
}

function tooMuchProduct() {
  const tooMuchCanap = document.querySelector(".itemQuantity").value;
  if (tooMuchCanap > 100 || tooMuchCanap < 1) {
    alert("choisir entre 1 et 100 articles");
    return true;
  }
  return false;
}

// orchestrator
async function process() {
  await getPrices();
  for (canap of cartLocalStorage) {
    await displayItem(canap);
  }
  addQuantityListener();
  removeItem(canap);
  document
    .querySelector("#order")
    .addEventListener("click", (e) => submitForm(e));
}
process();
