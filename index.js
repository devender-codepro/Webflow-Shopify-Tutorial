const storefrontAccessToken = '4c051888ca0ea8028f4f262475c478f8';
const shopifyStorefrontApiUrl = 'https://activescroll.myshopify.com/api/graphql';

// GET PRODUCT DATA
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
    handle: "landscape"
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


  // Working Radio Buttons


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
        let variantShopifyID = matchingVariant.id;
        let variantID = variantShopifyID.match(/\d+$/)[0];
        let addToCartButton = document.querySelector(".shopify-atc-button button");
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
    let checkoutButton = document.querySelector(".checkout-button");
    itemsContainer.innerHTML = ''
    cartItems.forEach(item=>{
      console.log(item);
      let itemContainer = document.createElement("li");
      let itemTitleElement = document.createElement("h3");
      let itemImageElement = document.createElement("img");
      let removeElement = document.createElement("button");
      itemTitleElement.innerText = item.node.merchandise.title;
      itemImageElement.src = item.node.merchandise.image.url;
      removeElement.innerText = "Remove";
      removeElement.setAttribute("data-cartLineID",item.node.id);
      removeElement.setAttribute("data-cartID",data.data.cart.id);
      itemContainer.appendChild(itemTitleElement);
      itemContainer.appendChild(itemImageElement);
      itemContainer.appendChild(removeElement);

      itemsContainer.appendChild(itemContainer);

      checkoutButton.href=data.data.cart.checkoutUrl;
    })
  })
  .catch(error => {
    console.error('Error fetching data from Shopify:', error);
  });
}


document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".shopify-atc-button button").addEventListener('click',()=>{
    let variantID = document.querySelector(".shopify-atc-button button").getAttribute("variant-id");
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