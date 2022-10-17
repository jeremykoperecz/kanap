// recuperation de la clef product
const product = window.location.search.split("?").join("");

//creation d'un tableau avec les valeur du produit selectionné
let productData = [];



const fetchProduct = async () => {
    await fetch(`http://localhost:3000/api/products/${product}`)
        .then((res) => res.json())
        .then((data) => { 
            productData = data
            console.log(productData);   
        });
};

const productDisplay = async () => {
    await fetchProduct();
    const containerImg = document.querySelector(".item__img");
//creation du containerImg

    containerImg.innerHTML = `
    <img class="item__img__img" src="${productData.imageUrl}" alt="image de canap ${productData.altTxt}"/>`

    document.getElementById("title").innerHTML = `${productData.name} `;
    document.getElementById("price").innerHTML = `${productData.price}`;
    document.getElementById("description").innerHTML = `${productData.description}`;
//creation de l'input pour la selection de la couleur
    let select = document.getElementById("colors");

    productData.colors.forEach((couleurs) => {

        document.createElement("option");

        let colorOption = document.createElement("option");
        console.log(colorOption);

        colorOption.innerHTML = `${couleurs}`;
        colorOption.value = `${couleurs}`;
        select.appendChild(colorOption);
    });
    
};

productDisplay();


// envoie de la selection dans le localstorage

const button = document.querySelector("#addToCart")

button.addEventListener("click", (e) => {
    const color = document.querySelector("#colors").value
    const quantity = document.querySelector("#quantity").value
    const key = `${productData._id}_${color}`
    const data = {
        id: `${productData._id}`,
        color: color,
        quantity: Number(quantity),
        price: Number(`${productData.price}`),
        image: `${productData.imageUrl}`,
        name: `${productData.name}`,
        altTxt: `${productData.altTxt}`,
    }
   
    localStorage.setItem(key, JSON.stringify(data));
    if (color == null || color === "" || quantity < 1 || quantity > 100) {
        alert("veuillez choisir une couleur ou une quantité")
    } else {
        window.location.href = "cart.html"
    }


    
})

  


 





