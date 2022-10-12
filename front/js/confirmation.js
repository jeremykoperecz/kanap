const orderIdCommande = window.location.search.split("=")[1];
console.log(orderIdCommande);


const span = document.querySelector('#orderId')
console.log(span);
    span.innerHTML = `${orderIdCommande}`
    
