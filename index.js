const storefrontAccessToken = '4c051888ca0ea8028f4f262475c478f8';
const shopifyStorefrontApiUrl = 'https://activescroll.myshopify.com/api/graphql';

const query = `
query SingleProduct($handle:String!){
    productByHandle(handle:$handle){
      title
      description
      priceRange{
        minVariantPrice{
          amount
        }
      }
      images(first:10){
        edges{
          node{
          transformedSrc
          }
        }
      }
      options {
        id
        name
        values
      }
      variants(first:100){
        edges{
          node{
            id
            title
            image{
              url
            }
          }
        }
      }
    }
  }
`;
const variables = {
    handle: "self-portrait"
  };
fetch(shopifyStorefrontApiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': storefrontAccessToken
  },
  body: JSON.stringify({ query,variables })
})
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
})
.then(data => {
  let mainProduct = [];
  mainProduct.push(data.data.productByHandle);
  productRender(mainProduct);
})
.catch(error => {
  console.error('Error fetching data from Shopify:', error);
});


function productRender(data){

  // Images
  let images = data[0].images.edges;
  let imageContainer = document.querySelector(".images");
  images.forEach(image =>{
    let imgElement = document.createElement('img'); 
    imgElement.src = image.node.transformedSrc; 
    imageContainer.appendChild(imgElement);  
  })

  // Product Title
  let titleContainer = document.querySelector(".product-title");
  let title = data[0].title;
  let titleElement = document.createElement("h2");
  titleElement.innerText = title;
  titleContainer.appendChild(titleElement);


  // Product Variants
  let optionsData = data[0].options;
  let productData = data[0];
  console.log(productData);
  optionsData.forEach(options=>{
    let optionContainer = document.querySelector(".variant-options");
    let optionNameElement = document.createElement("h3");
    let optionValues = options.values;
    optionNameElement.innerText = options.name;
    optionContainer.appendChild(optionNameElement);

    optionValues.forEach(value=>{
      let inputElement = document.createElement('input');
      inputElement.setAttribute('type', 'radio');
      inputElement.setAttribute('name', `variant-${options.name}`);
      inputElement.setAttribute('id', value);
      inputElement.setAttribute('value', value);

      let label = document.createElement('label');
      label.setAttribute('for',value);
      label.textContent = value;

      inputElement.innerText = value;
      optionContainer.appendChild(inputElement);
      optionContainer.appendChild(label);
    })
  })



/*


selectedOptions =['Black','XXL']


*/



  document.querySelectorAll(".variant-options input[type='radio']").forEach(radio=>{
    radio.addEventListener("change",()=>{
      
      let selectedOptions = [];
      document.querySelectorAll(".variant-options input[type='radio']:checked").forEach(radio=>{
        selectedOptions.push(radio.value);
      })

      let mainSelectedTitle = selectedOptions.join(' / ');

      console.log(mainSelectedTitle)
      let matchingVariant = null;
      productData.variants.edges.forEach(edge => {
        if (edge.node.title === mainSelectedTitle) {
          matchingVariant = edge.node;
        }
      });
  
      if (matchingVariant) {
        console.log("Matching variant found:", matchingVariant);
      } else {
        console.log("No matching variant found for:", mainSelectedTitle);
      }


     
    })
  })

















//       let matchedVariant = null;
// matchedVariant = productData.variants.edges.find(variant => { // for all variants, runs a callback function
//     for (let i = 0; i < selectedOptions.length; i++) {
//         if (variant.node.title.indexOf(selectedOptions[i]) === -1) {
//             return false;
//         }
//     }

//     return true;
    
// });







  // Product Variants
//   let variantContainer = document.querySelector('.variant-options');
//   let variants = data[0].variants.edges;
//   variants.forEach((variant,index)=>{
//     let variantTitle = variant.node.title;
//     let variantShopifyID = variant.node.id;
//     let variantID = variantShopifyID.match(/\d+$/)[0]
    
//     let radioButton = document.createElement('input');
//     radioButton.setAttribute('type', 'radio');
//     radioButton.setAttribute('name', 'variant');
//     radioButton.setAttribute('id', variantID);


//     if (index === 0) {
//       radioButton.setAttribute('checked', true);
//   }
//     // Create label element
//     let label = document.createElement('label');
//     label.setAttribute('for', variantID);
//     label.textContent = variantTitle;

//     variantContainer.appendChild(radioButton);
//     variantContainer.appendChild(label);


//     radioButton.addEventListener("change",(e)=>{
//       let VariantID__ATC = e.target.id;
//       addToCartButton.setAttribute('id', VariantID__ATC);
//       addToCartButton.setAttribute('title', variantTitle);
//     })

//   })


//   // Shopify Add to Cart Button
// // https://activescroll.myshopify.com/cart/41283004530839:4,41283004563607:1

// let addToCartButton = document.querySelector(".shopify-atc-button button");
// let cartDrawer = document.querySelector(".cart-drawer");
// let closeCartButton = document.querySelector(".close-cart");
// let checkoutButton = document.querySelector(".checkout-button");
// let cartVariantIDs = [];
// addToCartButton.addEventListener("click",()=>{

//   let cartDrawerVariantTitle = addToCartButton.getAttribute("title");
//   let cartDrawerVariantID = addToCartButton.getAttribute("id");


//   cartVariantIDs.push(cartDrawerVariantID + ':1');

  
//   let cartItemDiv = document.createElement("div");
//   let cartItemID = document.createElement("p");
//   let cartItemTitle = document.createElement("p");
//   let checkoutURL = 'https://activescroll.myshopify.com/cart';
//   cartItemID.innerText = cartDrawerVariantID;
//   cartItemTitle.innerText = cartDrawerVariantTitle;
//   cartItemDiv.appendChild(cartItemID);
//   cartItemDiv.appendChild(cartItemTitle);
//   cartDrawer.appendChild(cartItemDiv);
//   checkoutButton.href=`${checkoutURL}/${cartVariantIDs.join(',')}`
//   cartDrawer.classList.add("active");
// });


// closeCartButton.addEventListener("click",()=>{
//   cartDrawer.classList.remove("active");
// });




}