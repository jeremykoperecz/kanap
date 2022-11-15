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
    tagQuantity.addEventListener("change", event => {
      // récupérer la quantité souhaitée
      const quantityWanted = event.target.value
      const canapId = event.target.dataset.id
      const canapColor = event.target.dataset.color
      
      // récupérer le canap actuel dans le local storage
      cartLocalStorage.forEach(canap => { 
        // selectionner le canap
        if (canapId === canap.id && canapColor === canap.color) {
          // on est sur le bon canapé
          canap.quantity = quantityWanted;
        }
      })

      // mettre à jour le localstorage
      localStorage.setItem('cartCanap', JSON.stringify(cartLocalStorage))
      
      // mettre à jour la quantité totale dans le DOM
      displayTotalQuantity();
      displayTotalPrice();
    })
  );
}

// retourne le prix d'un canapé
function priceCanap(canapPriceWanted) {
  return canapsWithPricesFromApi
    .filter((canapFromPrice) => canapPriceWanted.id === canapFromPrice.id)
    .pop(); // mettre dans une fonction
}

// calcul de la quantité total
function displayTotalQuantity() {
  let total = 0;
  cartLocalStorage.forEach((canap) => (total += Number(canap.quantity) ));
  document.getElementById("totalQuantity").textContent = total;
}
// calcul du prix total
function displayTotalPrice() {
  let totalPrice = 0;
  cartLocalStorage.forEach((canap) => {
    price = canapsWithPricesFromApi
    totalPrice += canap.quantity * priceCanap(canap).price;
  });
  document.getElementById("totalPrice").textContent = totalPrice;
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
                    <p> ${priceCanap(canap).price} €</p>
                  </div>

                  <div class="cart__item__content__settings">

                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" data-id=${canap.id} data-color=${canap.color} class="itemQuantity" name="itemQuantity" min="1" max="100" value=${canap.quantity}>
                    </div>

                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>

                  </div>
                  
                </div>
              </article> `
  );
}

// supprimer un canap du panier
function addListenerToRemoveCanap() {
  // selectionne le bouton supprimer
  // supprime la cart du localstorage
  document.querySelector(".deleteItem").addEventListener("click", () =>
    cartLocalStorage.removeItem(canap)
  );
}


//envoie des données du formulaire dans le localstorage
function submitForm(event) {
  event.preventDefault();
  if (cartLocalStorage.length === 0) return alert("Please select items first");

  if (!isFormValid() || !isEmailValid() || tooMuchProduct()) return; // TODO

  // récupération des éléments du formulaire
  // TODO firstname n'existe pas
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
      alert("veuillez remplir le formulaire"); // TODO erreur dans le front
      return false;
    }
    return true;
  });
}

function isEmailValid() {
  const email = document.getElementById("email").value;
  const regex = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/;
  if (regex.test(email) === false) {
    document.getElementById('emailErrorMsg').innerHTML = 'Pas bien' // TODO
    return false;
  }
  return true;
}

function tooMuchProduct() {
  const tooMuchCanap = document.querySelector(".itemQuantity").value;
  if (tooMuchCanap > 100 || tooMuchCanap < 1) {
    alert("choisir entre 1 et 100 articles"); // TODO erreur dans le front
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

  
  displayTotalQuantity();
  displayTotalPrice();

  addQuantityListener();
  addListenerToRemoveCanap();

  document
    .getElementById("order")
    .addEventListener("click", (e) => submitForm(e));
}
process();
