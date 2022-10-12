const orderIdCommande = window.location.search.split("=")[1];
console.log(orderIdCommande);


const span = document.querySelector('#orderId')
span.innerHTML = `${orderIdCommande}`

localStorage.clear();
    
