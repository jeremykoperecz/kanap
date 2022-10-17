//recuperation de l'orderId 
const orderIdCommande = window.location.search.split("=")[1];
console.log(orderIdCommande);

// creation du numero de commande grace a l'orderId
const span = document.querySelector('#orderId')
span.innerHTML = `${orderIdCommande}`
// supression du localStorage
localStorage.clear();
    
