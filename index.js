const storefrontAccessToken = 'f14b81b61d137035845e05174cdbb527';
const shopifyStorefrontApiUrl = 'https://devender-dev-next.myshopify.com/api/graphql';
const firstValueVariantID = 43137664975077;
// GET PRODUCT DATA
const query = `
query SingleProduct($handle:String!){
    productByHandle(handle:$handle){
      title
      descriptionHtml
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
            price{
              amount
            }
          }
        }
      }
    }
  }
`;
const variables = {
    handle: "plan-for-the-best"
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

  // // Images
  // let images = data[0].images.edges;
  // let imageContainer = document.querySelector(".images");
  // images.forEach(image =>{
  //   let imgElement = document.createElement('img'); 
  //   let splide__slide = document.createElement("li");
  //   splide__slide.classList.add("splide__slide")
  //   imgElement.src = image.node.transformedSrc; 
  //   splide__slide.appendChild(imgElement)
  //   imageContainer.appendChild(splide__slide);  
  // })

  // Product Title
  let titleContainer = document.querySelector(".product-title");
  let descriptionContainer = document.querySelector(".product-description");
  let title = data[0].title;
  let description = data[0].descriptionHtml;
  console.log(description)
  let titleElement = document.createElement("h2");
  let descriptionElement = document.createElement("p");
  descriptionElement.innerHTML = description;
  titleElement.innerText = title;
  titleContainer.appendChild(titleElement);
  descriptionContainer.appendChild(descriptionElement);


  // Product Variants
  let optionsData = data[0].options;
  let productData = data[0];
  console.log(productData);
  optionsData.forEach(options=>{
    let optionContainer = document.querySelector(".variant-options");
    let optionNameElement = document.createElement("h3");
    let optionValues = options.values;
    let optionDiv = document.createElement("div");
    let classNameOption = options.name
    let sanitizedClassName = classNameOption.match(/[a-zA-Z0-9-]+/g).join('-');
    optionDiv.classList.add(`${sanitizedClassName}`)
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
      optionDiv.appendChild(inputElement);
      optionDiv.appendChild(label);

      productData.variants.edges.forEach(edge => {
        console.log(edge)
        // Check if the title matches
        if (edge.node.title.includes(value)) {
          label.setAttribute('img',edge.node.image.url);   
          label.setAttribute('variant-price',edge.node.price.amount);
          inputElement.setAttribute('variant-price',edge.node.price.amount);
        }
    });

    
      label.textContent = '';
      let labelBackGroundImage = label.getAttribute("img");
      label.innerHTML = `<img style="height:64px;width:64px;border-radius:100%" src="${labelBackGroundImage}"/><p>${value}</p>`;
    
    inputElement.style.display="none"

      optionContainer.appendChild(optionDiv);
      // Trigger change event to select the first variant by default
// Trigger change event to select the first variant by default
let firstVariant = options.values[0];
let radio = document.getElementById(firstVariant);
if (radio) {
    radio.checked = true;
    radio.dispatchEvent(new Event('change'));
    radio.setAttribute("checked","true")
}
    })
    let addToCartButton = document.querySelector(".shopify-atc-button .button");
    addToCartButton.setAttribute("variant-id",firstValueVariantID)

  })


  // Working Radio Buttons


  document.querySelectorAll(".variant-options input[type='radio']").forEach(radio=>{
    radio.addEventListener("change",(event)=>{
      
      let variantPrice = event.target.getAttribute('variant-price');
      variantPrice = parseInt(variantPrice);
      let addToCartButton = document.querySelector(".shopify-atc-button .button");
      addToCartButton.innerHTML = `ADD TO CART - $ ${variantPrice}`;

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
        let variantShopifyID = matchingVariant.id;
        let variantID = variantShopifyID.match(/\d+$/)[0];
        let addToCartButton = document.querySelector(".shopify-atc-button .button");
        addToCartButton.setAttribute("variant-id",variantID)      }

      
     
    })
  })


}



// CART CREATION

const queryCreate = `
mutation createCart($cartInput: CartInput) {
  cartCreate(input: $cartInput) {
    cart {
      id
      createdAt
      updatedAt
      checkoutUrl
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
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
      attributes {
        key
        value
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
        totalDutyAmount {
          amount
          currencyCode
        }
      }
    }
  }
}


`;
const variablesCart = {
  "cartInput": {
    "lines": [],
    "attributes": {
      "key": "cart_attribute_key",
      "value": "This is a cart attribute value"
    }
  }
  };




// CART READING

let cartID;
const queryCart = `
query cartQuery($cartId: ID!) {
  cart(id: $cartId) {
    id
    createdAt
    updatedAt
    checkoutUrl
    lines(first: 10) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              image{
                url
              }
              price{
                amount
              }
            }
          }
          attributes {
            key
            value
          }
        }
      }
    }
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
      totalDutyAmount {
        amount
        currencyCode
      }
    }
  
  }
}

`;
const variablesReadCart = {
  "cartId": cartID
};


// CART DELETE ITEM

const deleteQuery = `
mutation removeCartLines($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart {
      id
      lines(first: 10){
        edges
        {
          node{
            quantity
            merchandise{
              ... on ProductVariant {
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
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
        totalDutyAmount {
          amount
          currencyCode
        }
      }
    }
    
    userErrors {
      field
      message
    }
  }
}


`

const deleteItemVariables = 
{
  "cartId": "",
  "lineIds": []
}




function createCart(queryCreate,variablesCart){
  fetch(shopifyStorefrontApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken
    },
    body: JSON.stringify({ query: queryCreate, variables: variablesCart })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('CREATE CART', data);
    variablesReadCart["cartId"] = data.data.cartCreate.cart.id
    console.log(variablesReadCart);
    readCart(queryCart, variablesReadCart);

    let cartDrawer = document.querySelector(".cart-drawer");
    cartDrawer.classList.add("active");
  })
  .catch(error => {
    console.error('Error fetching data from Shopify:', error);
  });
}


function readCart(queryCart,variablesReadCart){
  fetch(shopifyStorefrontApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken
    },
    body: JSON.stringify({ query: queryCart, variables: variablesReadCart })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('READ CART',data)
   
    let cartItems = data.data.cart.lines.edges;
    let itemsContainer = document.querySelector(".cart-items");
    let countContainer = document.querySelector(".count-image-flex p");
    let countItems;
    itemsContainer.innerHTML = '';
    let checkoutButton = document.querySelector(".checkout-container a");
    cartItems.forEach(item=>{

      countItems = cartItems.length;
      console.log(cartItems)
      countContainer.innerHTML = `Your bag (${countItems})`
      console.log(item);
      let itemContainer = document.createElement("li");
      
      itemContainer.innerHTML = `<div class="item-container">
      
      <div class="image"><img src="${item.node.merchandise.image.url}"/></div>
      <div class="qty-box-content">
      <div class="main-title-variant">
      <div class="main-title-price">
      <h2 class="main-product-title">Deodrant</h2>
      <p style="margin-bottom:0">$${item.node.merchandise.price.amount}</p>
      </div>
      <h3 class="main-variant-title"><span></span>${item.node.merchandise.title}</h3>
      <div class="qty-box">
      <div class="quantity">
      <div class="quantity-container">
    <button class="quantity-button" onclick="decreaseValue()">-</button>
    <input type="number" class="quantity-input" id="quantity" value="1">
    <button class="quantity-button" onclick="increaseValue()">+</button>
</div>
      </div>
      <div class="subscribe-save-button">
      <button>
      SUBSCRIBE & SAVE 10%
      </button>
      </div>
      </div>
      <button class="remove-element">REMOVE</button>

      </div>
      
      </div>
      
      </div>`;
      itemsContainer.appendChild(itemContainer);
      checkoutButton.href=data.data.cart.checkoutUrl;
      let removeElement = document.querySelector(".remove-element")
      removeElement.setAttribute("data-cartLineID",item.node.id);
      removeElement.setAttribute("data-cartID",data.data.cart.id);
      
      
    })
  })
  .catch(error => {
    console.error('Error fetching data from Shopify:', error);
  });
}


document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".shopify-atc-button .button").addEventListener('click',()=>{
    let variantID = document.querySelector(".shopify-atc-button .button").getAttribute("variant-id");
    let newLineItem = {
      "quantity": 1,
      "merchandiseId": `gid://shopify/ProductVariant/${variantID}`
    };
    variablesCart.cartInput.lines.push(newLineItem);
    console.log(variablesCart);
    createCart(queryCreate,variablesCart);
  })
  
});

// Remove Item

function removeItem(deleteQuery,deleteItemVariables){
  fetch(shopifyStorefrontApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken
    },
    body: JSON.stringify({ query: deleteQuery, variables: deleteItemVariables })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('REMOVED CART', data);
    let remainingCartItems = data.data.cartLinesRemove.cart.lines.edges;
    remainingCartItems.forEach(item=>{
      variablesCart.cartInput.lines.push({quantity:1,merchandiseId:item.node.merchandise.id});
    })
    console.log(variablesCart)
    createCart(queryCreate,variablesCart);

  })
  .catch(error => {
    console.error('Error fetching data from Shopify:', error);
  });
}

document.addEventListener("DOMContentLoaded", () => {

  document.addEventListener('click', (event) => {
    if (event.target.matches('.cart-items li button')) {
      deleteItemVariables["cartId"] = event.target.dataset.cartid;
      deleteItemVariables["lineIds"].push(event.target.dataset.cartlineid);      console.log(deleteItemVariables)
      removeItem(deleteQuery,deleteItemVariables);
      variablesCart.cartInput.lines = [];
      console.log(variablesCart)
    }
  });
})


// close the drawer
document.addEventListener("DOMContentLoaded", () => {

  document.querySelector(".close-cart").addEventListener("click",()=>{
    let cartDrawer = document.querySelector(".cart-drawer");
      cartDrawer.classList.remove("active");
  })
})