const item = localStorage.getItem("cartCanap");
const cartLocalStorage = JSON.parse(item);
cartLocalStorage.forEach((canap) => displayItem(canap));

async function displayItem(canap) {
  const price = await fetch(`http://localhost:3000/api/products/${canap.id}`)
    .then((res) => res.json())
    .then((canap) => canap.price);

  document.getElementById("cart__items").innerHTML = `
<article class="cart__item" data-id=${canap.id} data-color=${canap.color}>
                <div class="cart__item__img">
                <img src="${canap.image}" alt=${canap.altTxt}>
                </div>
                <div class="cart__item__content">

                  <div class="cart__item__content__description">
                    <h2>${canap.name}</h2>
                    <p>${canap.color}</p>
                    <p>${price} €</p>
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
              </article> `;
              // récupération de l'input
              const input = document.querySelector('.itemQuantity')
              console.log('verif input', input)
              // ajout du listener sur l'événement "change"
                input[0].addEventListener('change', event => {
                    // mettre à jour la quantité de ce canap dans le localstorage
                    // mettre à jour la quantité totale dans le DOM
                }) 
  displayTotalQuantity(canap);
  displayTotalPrice(canap);
  
}
// creation de la fonction de suppression du localstorage
function deleteItemCart(item) {
  const itemCartDelete = item.findIndex(
    (canap) => canap.id === item.id && canap.color === item.color
  );
  item.splice(itemCartDelete, 1);
  deleteData(item);
  deleteDataPage(item);
  displayTotalPrice();
  displayTotalQuantity();
}
function deleteData(item) {
  const key = `${item.id}_${item.color}`;
  localStorage.removeItem(key);
}
// fonction de suppression de la cart sur la page html
function deleteDataPage(item) {
  const deletePage = document.querySelector(`article[data-id="${item.id}"]`);
  deletePage.remove();
}
// mise a jour de la quantity
function updateQuantity(id, newQuantity, item) {
  const moreItems = item.find((item) => item.id === id);
  moreItems.quantity = Number(newQuantity);
  displayTotalPrice();
  displayTotalQuantity();
  newData(item);
}
function newData(item) {
  const saveData = JSON.stringify(item);
  localStorage.setItem(item.id, saveData);
}

//fonction de calcul de la quantité
function displayTotalQuantity() {
  let total = 0;
  cartLocalStorage.forEach(canap => total += canap.quantity);
  document.querySelector("#totalQuantity").textContent = total;
}
//foncton de calcul du prix
function displayTotalPrice() {
  let total = 0;
  const totalP = document.querySelector("#totalPrice");
  item.forEach((canap) => {
    const totalPrice = canap.price * canap.quantity;
    total = total + totalPrice;
  });
  totalP.textContent = total;
}

const command = document.querySelector("#order");
command.addEventListener("click", (e) => submitForm(e));

const nameForm = document.querySelector("#firstName");
//envoie des données du formulaire dans le localstorage
function submitForm(e) {
  e.preventDefault();
  if (item.length === 0) return alert("Please select items first");

  if (validationFormulaire()) return;
  if (validationEmail()) return;
  if (tooMuchProduct()) return;

  const body = backRequest();
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const orderId = data.orderId;
      window.location.href = `./confirmation.html?orderId=${orderId}`;
    });
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
function validationFormulaire() {
  const form = document.querySelector(".cart__order__form");
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    if (input.value === "") {
      alert("veuillez remplir le formulaire");
      return true;
    }
    return false;
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
