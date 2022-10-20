// recuperation de la clef product
const product = window.location.search.split("?").join("");

//creation d'un tableau avec les valeurs du produit selectionné
let productData = [];

//appele de l'api avec fetch
const fetchProduct = async () => {
    await fetch(`http://localhost:3000/api/products/${product}`)
        .then((res) => res.json())
        .then((data) => { 
            productData = data
            console.log('productData', productData);   
        });
};

const productDisplay = async () => {
    await fetchProduct();
    const containerImg = document.querySelector(".item__img");
//creation du containerImg

    containerImg.innerHTML = `
    <img class="item__img__img" src="${productData.imageUrl}" alt="image de canap ${productData.altTxt}"/>`

    document.getElementById("title").innerHTML = productData.name;
    document.getElementById("price").innerHTML = productData.price;
    document.getElementById("description").innerHTML = productData.description;
//creation de l'input pour la selection de la couleur
    
    const select = document.getElementById("colors");

    productData.colors.forEach((couleurs) => {

        
        const colorOption = document.createElement("option");
        console.log(colorOption);

        colorOption.innerHTML = couleurs;
        colorOption.value = couleurs; 
        select.appendChild(colorOption);
    });
    
};

productDisplay();

//creation d'une fonction pour avoir un message pour l'utilisateur que son canapé a bien été ajouté au panier
function confirmationPopup() {
    alert('canapé ajouté au panier');
    
}
//association des données au bouton "ajouter au panier"
const button = document.querySelector("#addToCart")

button.addEventListener("click", () => {
    const color = document.querySelector("#colors").value
    let quantity = document.querySelector("#quantity").value
    const key = `${productData._id}_${color}`
    const canapData = {
        id: productData._id,
        color: color,
        quantity: Number(quantity),
        price: productData.price,
        image: productData.imageUrl,
        name: productData.name,
        altTxt: productData.altTxt,
    }
    
    
      
    console.log(canapData);
     
    // envoie de la selection dans le localstorage 
   
    
    if (color == null || color === "" || quantity < 1 || quantity > 100) {
        alert("veuillez choisir une couleur ou une quantité")
        return
    }
    
    if (key === key) {
         quantity += 1
         localStorage.setItem(key, JSON.stringify(canapData));
       
    } else {    
        localStorage.setItem(key, JSON.stringify(canapData));  
        
    }
     confirmationPopup();
     
     window.location.href = "cart.html"
    


})   
    

  


 





