const product = window.location.search.split("?").join("");

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


    containerImg.innerHTML = `
    <img class="item__img__img" src="${productData.imageUrl}" alt="image de canap ${productData.altTxt}"/>`

    document.getElementById("title").innerHTML = `${productData.name} `;
    document.getElementById("price").innerHTML = `${productData.price}`;
    document.getElementById("description").innerHTML = `${productData.description}`;
    /* selection des couleurs*/
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