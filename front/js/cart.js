/**
 * Déclaration des variables globales
 */
const item = localStorage.getItem("cartCanap");
const cartLocalStorage = JSON.parse(item);



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
    .pop(); 
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
  const deleteButton = document.querySelectorAll(".deleteItem");
  // supprime la cart du localstorage
  deleteButton.forEach((deleteCanap) =>
    deleteCanap.addEventListener("click", () => {
      console.log("prout");
      localStorage.removeItem
      
    }))
}

//fonction de verification du formulaire
function isFormNotValid() {
  const form = document.querySelector(".cart__order__form");
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    if (input.value === '') {
      document.getElementById('firstNameErrorMsg').innerHTML = 'veuillez remplir le formulaire svp'
      document.getElementById('lastNameErrorMsg').innerHTML = 'veuillez remplir le formulaire svp'
      document.getElementById('addressErrorMsg').innerHTML = 'veuillez remplir le formulaire svp'
      document.getElementById('cityErrorMsg').innerHTML = 'veuillez remplir le formulaire svp'
    } 
    return true;
  })
  return false;
};

function isEmailNotValid() {
  const email = document.getElementById("email").value;
  const regex = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/;
  if (regex.test(email) === false) {
    return true;
  }
  return false;
}

function tooMuchProduct() {
  const tooMuchCanap = document.querySelector(".itemQuantity").value;
  if (tooMuchCanap > 100 || tooMuchCanap < 1) {
    alert('quantité non valide');
    return true;
  }
  return false;
}

function localStorageEmpty() {
  if (cartLocalStorage.length === null) {
    alert('selectionner un canap svp');
    return true;
  }
  return false;
}

//verification du formulaire
function submitForm() {
  const commandButton = document.getElementById('order');
  commandButton.addEventListener('click', (event) => {
    event.preventDefault();
    if (isFormNotValid() || isEmailNotValid()) {
      alert('formulaire non valide');
      return;
    } else if (tooMuchProduct() || localStorageEmpty()) { 
      return;
    } else {
  
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
console.log(body);
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
            alert('prout')
            //(window.location.href = `./confirmation.html?orderId=${order.orderId}`)
        );
    }
    })
    };

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

async function process() {
  await getPrices();
  for (canap of cartLocalStorage) {
    await displayItem(canap);
  }

  
  displayTotalQuantity();
  displayTotalPrice();

  addQuantityListener();
  addListenerToRemoveCanap();


  submitForm();
  getIdFromLocalStorage();


}
process();
