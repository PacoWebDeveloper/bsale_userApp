/**
 * Adds an addEventListener to identify when the screen
 * is completely loaded
 * @name window
 * 
 */
window.addEventListener('load', () => {
    //================> Searchbar variables
    /**
     * Calls the input with id = searchBar
     * @name searchBar
     */
    const searchBar = document.querySelector('#searchBar');
    /**
     * Calls the input of submit type with id = submitButton. Has an addEventListener
     * @name submitButton
     */
    const submitButton = document.querySelector('#submitButton');
    /**
     * Calls the span with class = errorMessage. Has an addEventListener
     * @name messageBox
     */
    const messageBox = document.querySelector('.errorMessage');  
    /**
     * Is to create a message to be shown in messageBox
     * TYPE {String}
     * @name message
     */
    let message = '';
  
    //================> Products container varibles
  
    /**
     * Calls the span with class = showAllProductsButton. Has an addEventListener
     * @name showAllProductsButton
     */
    const showAllProductsButton = document.querySelector('.showAllProductsButton');
    /**
     * Calls the select with id = categorySelect. Has an addEventListener
     * @name categorySelect
     */
    const categorySelect = document.querySelector('#categorySelect');
    /**
     * Calls the div with class = products-container
     * @name productContainer
     */
    const productContainer = document.querySelector('.products-container');
    /**
     * Calls the div with class = product-card
     * @name productCard
     */
    const productCard = document.querySelectorAll('.product-card');
    /**
     * Calls the img with class = image
     * @name imageProduct
     */
    const imageProduct = document.querySelectorAll('.image');
    /**
     * Calls the p (paragraph) with class = product-name
     * @name productName
     */
    const productName = document.querySelectorAll('.product-name');
    /**
     * Calls the p (paragraph) with class = product-price
     * @name productPrice
     */
    const productPrice = document.querySelectorAll('.product-price');
    /**
     * Calls the input with id = page-number
     * @name pageNumber
     */
    const pageNumber = document.querySelector('#page-number');
    /**
     * Calls the span with class = noProductsFound
     * @name noProductsFound
     */
    const noProductsFound = document.querySelector('.noProductsFound');
    
    /**
     * Stores the current page number, we set in 1 to the start
     * @name currentPage
     */
    let currentPage = 1;
    /**
     * Product list array, in which we will store the products returned by the API
     * @name allProducts
     * @type {Array<Object>}
     */
    let allProducts = [];
  
    /**
     * Calls the span with class = leftArrow. Has an addEventListener
     * @name leftArrow
     */
    const leftArrow = document.querySelector('.leftArrow');
    /**
     * Calls the span with class = rightArrow. Has an addEventListener
     * @name rightArrow
     */
    const rightArrow = document.querySelector('.rightArrow');
  
    /**
     * Stores the API response, this response the result from a promise
     * @name response
     * @type {Object}
     */
    let response = apiRequetsAllProducts();//Call all products to be shown in display
    response.then((res) => { 
      allProducts = res.results;
      setProductsInItems(allProducts, currentPage);
    })
    .catch((err) => {
      console.error(err);
    })
  
    
  
    // ================> Events
    showAllProductsButton.addEventListener('click', () => {
      categorySelect.value = 0;
      response = apiRequetsAllProducts();//Call all products to be shown in display
      response.then((res) => { 
        allProducts = res.results;
        setProductsInItems(allProducts, currentPage);
        showPanels(allProducts);
      })
      .catch((err) => {
        console.error(err);
      })
    })

    categorySelect.addEventListener('change', () => {
      const category = categorySelect.value;
      console.log(category);
      if (category != 0 )
        response = apiRequetsByCategory(category);
      else
        response = apiRequetsAllProducts();
      response.then((res) => {
        allProducts = res.results;
        setProductsInItems(allProducts, currentPage);
        showPanels(allProducts);
      })
    })
  
    searchBar.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const text = searchBar.value.trim();
        if (text != '') {
          categorySelect.value = 0;
          currentPage = 1;
          pageNumber.placeholder = currentPage;
  
          response = submitData(text);
          response.then((res) => {
            allProducts = res.results;
            showPanels(allProducts);
          })
          .catch((err) => {
            console.error(err);
          })
        }
      }
    })
  
    submitButton.addEventListener('click', () => {
      categorySelect.value = 0;
      const text = searchBar.value.trim();
      if (text != '') {
        currentPage = 1;
        pageNumber.placeholder = currentPage;
  
        response = submitData(text);
        response.then((res) => {
          allProducts = res.results;
          showPanels(allProducts);
        })
        .catch((err) => {
          console.error(err);
        })
      }
      else {      
        message = 'Dinos que te gustar??a buscar';
        messageBox.classList.add('showMessage');
        messageBox.textContent = message;
      } 
    })
  
    
    leftArrow.addEventListener('click', () => {
      if (currentPage > 1)
        setProductsInItems(allProducts, --currentPage);
    })
  
    rightArrow.addEventListener('click', () => {
        if (allProducts.length > 8 && (currentPage * 8) <= allProducts.length) 
          setProductsInItems(allProducts, ++currentPage);
    })
  
    // =================>   Functions
    /**
     * Sends data to the API through  a promise waiting for a response
     * @name submitData
     * @function
     * @param {Element} input Is the text to send to the API
     * @returns Returns an object with the API response
     */
    async function submitData(input) {
      messageBox.classList.remove('showMessage');
      searchBar.value = '';
  
      /**
       * Stores the API response to be returned at the end of "submitData" function
       * @name results
       * @type {Object}
       */
      const results = await apiRequets(input);
  
      return results;
    }
  
    /**
     * Receives the list of products stored in allProducts array.
     * See about {@link allProducts}
     * @name showPanels
     * @function
     * @param {Array} allProducts List of products stored in an array
     */
    function showPanels(allProducts) {
      if (allProducts.length > 0) {
        setProductsInItems(allProducts, currentPage);
        productContainer.style.display = 'flex';
        noProductsFound.style.display = 'none';
      }
      else {
        noProductsFound.style.display = 'flex';
        productContainer.style.display = 'none';
      }
    }
    
    /**
     * @name setProductsInItems
     * @function
     * @param {Array} products List of products stored in an array
     * @param {Number} currentPage {@link currentPage}
     */
    function setProductsInItems(products, currentPage) {
      if (products.length > 8) {
        pageNumber.placeholder = currentPage;      
      } else {
        currentPage = 1;
        pageNumber.placeholder = currentPage;
      }
  
      /**
       * It is used to set the lowest index of the list of products at which to start iterating through a FOR loop
       * @name lowLimit
       * @type {Number}
       */
      /**
       * It is used to set the highest index of the list of products at which to end iterating through a FOR loop.
       * @name highLimit
       * @type {Number}
       */
      /**
       * We have 8 cards set in the HTML template, and the Variable "indexCard" is used to change the display styles property and to add "src" and "alt" attributes to the respective card starting in 0 ending in the highest index of the bucle FOR. This is for don't show all the cards if is not required
       * @name indexCard
       * @type {Number}
       */
      let lowLimit = 0, highLimit = 0, indexCard = 0;
      lowLimit = (currentPage * 8 - 8);
      highLimit = (currentPage * 8);
      for (let i = lowLimit; i < highLimit; i++) {
        if (products[i] != undefined) {        
          productCard[indexCard].classList.remove('hide-card');
          imageProduct[indexCard].setAttribute('src', products[i].url_image);
          imageProduct[indexCard].setAttribute('alt', products[i].name);
    
          productName[indexCard].textContent = products[i].name;
    
          productPrice[indexCard].textContent = `$${products[i].price}`;
        } else {
          productCard[indexCard].classList.add('hide-card');
        }
        indexCard++;
      }
      indexCard = 0;
    }
    
    //Call all products
    /**
     * Is a method to request all the products listed in the database through the API
     * @name apiRequetsAllProducts
     * @function
     * @returns Returns the an object that contains the server (API) response
     */
    async function apiRequetsAllProducts() {
      /**
       * Contains the URL to the API
       * @name URL
       * @type {String}
       */
      const URL = 'https://bsaletestapi.herokuapp.com/api/getAllProducts' //URL HEROKU
      //const URL = 'http://localhost:3700/api/getAllProducts'; //URL LOCAL
  
      const response = await fetch(URL);
      const data = response.json();
  
      return data;
    }
    //Call products by name
    /**
     * Is a method to request the products listed in the database which the name are equal to the text sent by the user
     * @name apiRequetsAllProducts
     * @function
     * @returns Returns the an object that contains the server (API) response
     */
    async function apiRequets(textSearch) {
      const URL = `https://bsaletestapi.herokuapp.com/api/getProductsByName?name=${textSearch}`; //URL HEROKU
      //const URL = `http://localhost:3700/api/getProductsByName?name=${textSearch}`; // URL LOCAL
  
      const response = await fetch(URL);
      const data = await response.json();
      
      return data;
    }  
    //Call products by category
    /**
     * Is a method to request the products listed in the database which the category are equal to the selected by the user on the "select HTML element"
     * @name apiRequetsByCategory
     * @function
     * @returns Returns the an object that contains the server (API) response
     */
    async function apiRequetsByCategory(textSearch) {
      const URL = `https://bsaletestapi.herokuapp.com/api/getProductsByCategory?category=${textSearch}`; //URL HEROKU
      //const URL = `http://localhost:3700/api/getProductsByCategory?category=${textSearch}`; // URL LOCAL
  
      const response = await fetch(URL);
      const data = await response.json();
      
      return data;
    } 
  })