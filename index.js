// Function to create and append loader to cart drawer
function showLoader() {
  // Create loader element
  const loader = document.createElement('div');
  loader.classList.add('loader');
  
  // Append loader to cart drawer
  const cartDrawer = document.querySelector('.cart-drawer');
  cartDrawer.appendChild(loader);
}

// Function to remove loader from cart drawer
function hideLoader() {
  // Remove loader element
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.remove();
  }
}

const storefrontAccessToken = 'f14b81b61d137035845e05174cdbb527';
const shopifyStorefrontApiUrl = 'https://devender-dev-next.myshopify.com/api/graphql';
const firstValueVariantID = 43137664975077;
const firstValueVariantIDFreeProduct = 45047820157157;
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



// FREE PRODUCT

const queryFreeProduct = `
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
const variablesFreeProduct = {
    handle: "lip-balm"
  };
fetch(shopifyStorefrontApiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': storefrontAccessToken
  },
  body: JSON.stringify({ query:queryFreeProduct,variables:variablesFreeProduct })
})
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
})
.then(data => {
  let mainProductFreeProduct = [];
  mainProductFreeProduct.push(data.data.productByHandle);
  productRenderFreeProduct(mainProductFreeProduct);
})
.catch(error => {
  console.error('Error fetching data from Shopify:', error);
});


// Up-Sell


const queryProductUpsell = `
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
const handles = ["vacation-set", "body-wash-bar",'dads-hat'];
const fetchProductData = (handle) => {
  const variablesProductUpsell = { handle };

  return fetch(shopifyStorefrontApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken
    },
    body: JSON.stringify({ query: queryProductUpsell, variables: variablesProductUpsell })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    return data.data.productByHandle; // Return product data
  })
  .catch(error => {
    console.error('Error fetching data from Shopify:', error);
    return null;
  });
};





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
  // console.log(description)
  let titleElement = document.createElement("h2");
  let descriptionElement = document.createElement("p");
  descriptionElement.innerHTML = description;
  titleElement.innerText = title;
  titleContainer.appendChild(titleElement);
  descriptionContainer.appendChild(descriptionElement);


  // Product Variants
  let optionsData = data[0].options;
  let productData = data[0];
  // console.log(productData);
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
        // console.log(edge)
        // Check if the title matches
        if (edge.node.title.includes(value)) {
          label.setAttribute('img',edge.node.image.url);   
          label.setAttribute('variant-price',edge.node.price.amount);
          inputElement.setAttribute('variant-price',edge.node.price.amount);
          inputElement.setAttribute('variant-id',edge.node.id)
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
      let priceContainerInTitle = document.querySelector(".title-price-container p");
      priceContainerInTitle.innerHTML = `$${variantPrice}`
      let selectedOptions = [];
      document.querySelectorAll(".variant-options input[type='radio']:checked").forEach(radio=>{
        selectedOptions.push(radio.value);
      })

      let mainSelectedTitle = selectedOptions.join(' / ');

      // console.log(mainSelectedTitle)
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


// Free Product

function productRenderFreeProduct(data){

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
  // let titleContainer = document.querySelector(".product-title");
  // let descriptionContainer = document.querySelector(".product-description");
  // let title = data[0].title;
  // let description = data[0].descriptionHtml;
  // // console.log(description)
  // let titleElement = document.createElement("h2");
  // let descriptionElement = document.createElement("p");
  // descriptionElement.innerHTML = description;
  // titleElement.innerText = title;
  // titleContainer.appendChild(titleElement);
  // descriptionContainer.appendChild(descriptionElement);


  // Product Variants
  let optionsData = data[0].options;
  let productData = data[0];
  // console.log(productData);
  optionsData.forEach(options=>{
    let optionContainer = document.querySelector(".variant-options-free-product");
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
        // console.log(edge)
        // Check if the title matches
        if (edge.node.title.includes(value)) {
          label.setAttribute('img',edge.node.image.url);   
          label.setAttribute('variant-price',edge.node.price.amount);
          inputElement.setAttribute('variant-price',edge.node.price.amount);
          inputElement.setAttribute('variant-id',edge.node.id)
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
    addToCartButton.setAttribute("variant-id",firstValueVariantIDFreeProduct)

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

      // console.log(mainSelectedTitle)
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


function productRenderUpsell(products) {
  let cartItemsUpsell = document.querySelector(".cart-items");

  // Create the upsell container
  let upsellContainer = document.createElement('div');
  upsellContainer.classList.add('upsell-container');




  // Create section title div
  let sectionTitleDiv = document.createElement('div');
  sectionTitleDiv.classList.add('upsell-section-title');
  let upsellSectionTitle = document.createElement("h3");
  upsellSectionTitle.innerText = 'More good stuff';
  sectionTitleDiv.appendChild(upsellSectionTitle);

  // Append section title div to upsell container
  upsellContainer.appendChild(sectionTitleDiv);

  // Create items container div
  let itemsContainerDiv = document.createElement('div');
  itemsContainerDiv.classList.add('upsell-items');

  // Add each product to items container
  products.forEach(product => {
    let productDiv = document.createElement('div');
    productDiv.classList.add('upsell-product');
    let productHTML = `
        <img src="${product.images.edges[0].node.transformedSrc}" alt="${product.title}" style="height: 190px;width:100%;">
        <h3>${product.title}</h3>
        <p style="display:flex;align-items:center"> <span style="margin-top: -4px;background:#A1CEE0;height:14px;width:14px;border-radius:100%;display:inline-block;margin-right:5px;"></span>`;
    
    product.variants.edges.forEach(edge => {
        productHTML += `${edge.node.title}`;
    });

    productHTML += `</p>`;
    
    productDiv.innerHTML = productHTML;
    itemsContainerDiv.appendChild(productDiv);
});


  // Append items container div to upsell container
  upsellContainer.appendChild(itemsContainerDiv);

  // Append the upsell container to the cart items
  cartItemsUpsell.appendChild(upsellContainer);
}





// FREE PRODUCT RADIO BUTTONS

document.querySelectorAll(".variant-options-free-product input[type='radio']").forEach(radio=>{
  radio.addEventListener("change",(event)=>{
    console.log(event.target)
    let variantPrice = event.target.getAttribute('variant-price');
    variantPrice = parseInt(variantPrice);
    let addToCartButton = document.querySelector(".shopify-atc-button .button");
    addToCartButton.innerHTML = `ADD TO CART - $ ${variantPrice}`;

    let selectedOptions = [];
    document.querySelectorAll(".variant-options-free-product input[type='radio']:checked").forEach(radio=>{
      selectedOptions.push(radio.value);
    })

    let mainSelectedTitle = selectedOptions.join(' / ');

    // console.log(mainSelectedTitle)
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




const updateQuantityQuery = `
mutation UpdateCartLines($cartId: ID!, $lineId: ID!, $quantity: Int!) {
  cartLinesUpdate(
    cartId: $cartId
    lines: {
      id: $lineId
      quantity: $quantity
    }
  ) {
    cart {
      id
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
  }
}

`

const updateQuantityVariables = {
  "cartId": "",  
  "lineId": "",  
  "quantity": ""
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
    // console.log('CREATE CART', data);
    variablesReadCart["cartId"] = data.data.cartCreate.cart.id
    // console.log(variablesReadCart);
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
    // console.log('READ CART',data)
    hideLoader();
    let cartItems = data.data.cart.lines.edges;
    let itemsContainer = document.querySelector(".cart-items");
    let countContainer = document.querySelector(".count-image-flex p");
    let countItems;
    itemsContainer.innerHTML = '';
    let checkoutButton = document.querySelector(".checkout-container a");
    checkoutButton.innerHTML = `🔒 continue to checkout - $${parseInt(data.data.cart.cost.totalAmount.amount)}`;

    if(cartItems.length == 0){
      
      // document.querySelector(".upsell-container").style.display="none";
      let countContainerCart = document.querySelector(".count-image-flex p");
      countContainerCart.innerHTML = "Your bag (0)";
      let checkoutContainer = document.querySelector(".checkout-container");
      checkoutContainer.style.display="none";

      let cartItemsContainer = document.querySelector(".cart-items");
      let htmlEmptyCart = `
      <div style="display:flex;align-items:center;justify-content:center;flex-direction:column;height:100vh">
      <h3 style="text-align:center;margin-bottom:24px;font-size:40px;font-weight:400;line-height:100%">Your long wknd<br>bag is empty!</h3>
      <a style="margin-bottom:32px;text-decoration:none;font-size:16px;text-transform:uppercase;display:flex;align-items:center;justify-content:center;color:white;background:black;height:48px;width:320px;" href="#">SHOP OUR BEST SELLERS</a>
      <img src="https://assets-global.website-files.com/65f2b374a2f246357993d13f/65fc4050eba3a0b5ceeb8125_Group%20650483.png"/>
      <p style="width:240px;margin:0 auto;margin-top:12px;sfont-size:16px;text-align:center;font-weight:500;line-height:136%">“My skin has never felt better. I love these products!”</p>
      <p style="margin:0;margin-top:16px;font-size:14px;font-weight:400;line-height:136%">@MIA</p>
      </div>
      `;
      cartItemsContainer.innerHTML = htmlEmptyCart;
  }

    if (cartItems.length >0){
      let checkoutContainer = document.querySelector(".checkout-container");
      checkoutContainer.style.display="block";
      // document.querySelector(".upsell-container").style.display="block";

    }
  
    cartItems.forEach(item=>{
      
      
      countItems = cartItems.length;
      // console.log(cartItems)
      countContainer.innerHTML = `Your bag (${countItems})`
      // console.log(item);
      let itemContainer = document.createElement("li");
      
      itemContainer.innerHTML = `<div class="item-container">
      
      <div class="image"><img src="${item.node.merchandise.image.url}"/></div>
      <div class="qty-box-content">
      <div class="main-title-variant">
      <div class="main-title-price">
      
      <h2 class="main-product-title">
      ${['Cherry', 'Coconut Vanilla', 'Peppermint', 'Pink Lemonade'].includes(item.node.merchandise.title) ? 'Lip Balm' : 'Deodrant'}
    </h2>      <p class="cart-drawer-item-price" style="margin-bottom:0">$${parseInt(item.node.merchandise.price.amount)}</p>
      </div>
      <h3 class="main-variant-title"><span></span>${item.node.merchandise.title}</h3>
      <div class="qty-box">
      <div class="quantity">
      <div class="quantity-container">
    <button class="quantity-button" onclick="decreaseValue(event)">-</button>
    <input type="number" class="quantity-input" data-cartLineID="${item.node.id}" data-cartID="${data.data.cart.id}" value="1">    <button class="quantity-button" onclick="increaseValue(event)">+</button>
</div>
      </div>
      <div class="subscribe-save-button">
      <button>
      SUBSCRIBE & SAVE 10%
      </button>
      </div>
      </div>

      </div>
      
      </div>
      
      </div>`;
      itemsContainer.appendChild(itemContainer);
      checkoutButton.href=data.data.cart.checkoutUrl;
      let mainTitleVariantDiv = itemContainer.querySelector('.main-title-variant');
      let removeElement = document.createElement("button");
      removeElement.classList.add("remove-element");
      removeElement.setAttribute("data-cartLineID", item.node.id);
      removeElement.setAttribute("data-cartID", data.data.cart.id);
      removeElement.textContent = "REMOVE";
      mainTitleVariantDiv.appendChild(removeElement);

      document.querySelectorAll(".quantity-button").forEach(e=>{
        e.setAttribute("data-cartLineID", item.node.id);
        e.setAttribute("data-cartID", data.data.cart.id);
      });
      
    })
    // Fetch data for each handle
Promise.all(handles.map(handle => fetchProductData(handle)))
.then(products => {
  console.log(products);
  let productUpsells = [];
  productUpsells.push(...products); // Spread the products into the array
  productRenderUpsell(productUpsells); 
});
  })
  .catch(error => {
    console.error('Error fetching data from Shopify:', error);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const addToCartButton = document.querySelector(".shopify-atc-button .button");

  addToCartButton.addEventListener('click', () => {
    const radioButtons = document.querySelectorAll("input[type='radio']:checked");
    const variantsToAddArray = [];

    // Iterate over all checked radio buttons
    radioButtons.forEach(radioButton => {
      const variantID = radioButton.getAttribute("variant-id");
      variantsToAddArray.push(variantID);
    });

    // Add each selected variant to the cart
    variantsToAddArray.forEach(variantID => {
      const newLineItem = {
        "quantity": 1,
        "merchandiseId": `${variantID}`
      };
      variablesCart.cartInput.lines.push(newLineItem);
    });

    // Log the updated cart
    console.log(variablesCart);

    // Create/update the cart
    createCart(queryCreate, variablesCart);
  });
});



// Remove Item

function removeItem(deleteQuery,deleteItemVariables){
  showLoader();
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
    // console.log('REMOVED CART', data);
   
    let remainingCartItems = data.data.cartLinesRemove.cart.lines.edges;
    
    // console.log('Remaining Cart Items', remainingCartItems);
    remainingCartItems.forEach(item=>{
      variablesCart.cartInput.lines.push({quantity:1,merchandiseId:item.node.merchandise.id});
    })
    // console.log(variablesCart)
    createCart(queryCreate,variablesCart);
   
  })
  .catch(error => {
    console.error('Error fetching data from Shopify:', error);
  });
}



function updateItem(updateQuantityQuery,updateQuantityVariables){
  fetch(shopifyStorefrontApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken
    },
    body: JSON.stringify({ query: updateQuantityQuery, variables: updateQuantityVariables })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // console.log('UPDATED CART', data);
    let checkoutButton = document.querySelector(".checkout-container a");
    checkoutButton.innerHTML = `🔒 continue to checkout - $${parseInt(data.data.cartLinesUpdate.cart.cost.totalAmount.amount)}`

  })
  .catch(error => {
    console.error('Error fetching data from Shopify:', error);
  });
}

document.addEventListener("DOMContentLoaded", () => {

  document.addEventListener('click', (event) => {
    if (event.target.matches('.cart-items li .remove-element')) {
      variablesCart.cartInput.lines = [];
      deleteItemVariables["cartId"] = event.target.dataset.cartid;
      deleteItemVariables["lineIds"] = [];
      deleteItemVariables["lineIds"].push(event.target.dataset.cartlineid);      
      // console.log(deleteItemVariables)
      removeItem(deleteQuery,deleteItemVariables);
      // console.log(deleteItemVariables),`Variables Cart`
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

function decreaseValue(event) {
  var quantityInput = event.target.parentNode.querySelector('.quantity-input');
  var currentValue = parseInt(quantityInput.value);
  if (!isNaN(currentValue) && currentValue > 1) {
    quantityInput.value = currentValue - 1;
    updateQuantity(event);
  }
}

function increaseValue(event) {
  var quantityInput = event.target.parentNode.querySelector('.quantity-input');
  var currentValue = parseInt(quantityInput.value);
  if (!isNaN(currentValue)) {
    quantityInput.value = currentValue + 1;
    updateQuantity(event);
  }
}

function updateQuantity(event) {

  var quantityInput = event.target.parentNode.querySelector('.quantity-input');
  var cartId = quantityInput.dataset.cartid;
  var lineId = quantityInput.dataset.cartlineid;
  var quantity = parseInt(quantityInput.value);

  updateQuantityVariables["cartId"] = cartId;
  updateQuantityVariables["lineId"] = lineId;
  updateQuantityVariables["quantity"] = quantity;

  updateItem(updateQuantityQuery, updateQuantityVariables);
}


const tabLinks = document.querySelectorAll('.tabs-content-vacation .w-tab-link');

    // Loop through each tab link
    tabLinks.forEach(tab => {
        // Add click event listener
        tab.addEventListener('click', () => {
            // Get the src of the image to change based on the tab
            let imgSrc;
            if (tab.dataset.wTab === 'Tab 1') {
                imgSrc = 'https://uploads-ssl.webflow.com/65f2b374a2f246357993d13f/65fc4a13c74d8dc75660e31d_Rectangle%203214.png';
            } else if (tab.dataset.wTab === 'Tab 2') {
                imgSrc = 'https://uploads-ssl.webflow.com/65f2b374a2f246357993d13f/6607dda18efbfed2be4996b6_Rectangle%203214%20(1).png';
            } else if (tab.dataset.wTab === 'Tab 3') {
                imgSrc = 'https://uploads-ssl.webflow.com/65f2b374a2f246357993d13f/6607dda2b743df512508d671_Rectangle%203214%20(2).png';
            }

            // Change the image src
            const accordion = document.querySelector('.tabs-content-vacation .accordion');
            if (accordion) {
                const firstImage = accordion.querySelector('.tabs-content-vacation .div-block-14 .image-9');
                if (firstImage) {
                    firstImage.src = imgSrc;
                }
            }
        });
    });

    