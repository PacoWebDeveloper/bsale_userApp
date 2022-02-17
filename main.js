window.addEventListener('load', () => {
    //================> Searchbar variables
    const searchBar = document.querySelector('#searchBar');
    const submitButton = document.querySelector('#submitButton');
    const messageBox = document.querySelector('.errorMessage');  
    let message = '';
  
    //================> Products container varibles
  
    const showAllProductsButton = document.querySelector('.showAllProductsButton');
    const categorySelect = document.querySelector('#categorySelect');
    const productContainer = document.querySelector('.products-container');
    const productCard = document.querySelectorAll('.product-card');
    const imageProduct = document.querySelectorAll('.image');
    const productName = document.querySelectorAll('.product-name');
    const productPrice = document.querySelectorAll('.product-price');
    const pageNumber = document.querySelector('#page-number');
    const noProductsFound = document.querySelector('.noProductsFound');
    
    let currentPage = 1;
    let allProducts = [];
  
    const leftArrow = document.querySelector('.leftArrow');
    const rightArrow = document.querySelector('.rightArrow');
  
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
        message = 'Dinos que te gustaría buscar';
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
    async function submitData(input) {
      messageBox.classList.remove('showMessage');
      searchBar.value = '';
  
      const results = await apiRequets(input);
  
      return results;
    }
  
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
  
    function setProductsInItems(products, currentPage) {
      if (products.length > 8) {
        pageNumber.placeholder = currentPage;      
      } else {
        currentPage = 1;
        pageNumber.placeholder = currentPage;
      }
  
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
    async function apiRequetsAllProducts(/* limit */) {
      const URL = 'https://bsaletestapi.herokuapp.com/api/getAllProducts' //URL HEROKU
      /* const URL = 'http://localhost:3700/api/getAllProducts'; */ //URL LOCAL
  
      const response = await fetch(URL);
      const data = response.json();
  
      return data;
    }
    //Call products by name
    async function apiRequets(textSearch) {
      const URL = `https://bsaletestapi.herokuapp.com/api/getProductsByName?name=${textSearch}`; //URL HEROKU
      /* const URL = `http://localhost:3700/api/getProductsByName?name=${textSearch}`; */ // URL LOCAL
  
      const response = await fetch(URL);
      const data = await response.json();
      
      return data;
    }  
    //Call products by category
    async function apiRequetsByCategory(textSearch) {
      const URL = `https://bsaletestapi.herokuapp.com/api/getProductsByCategory?category=${textSearch}`; //URL HEROKU
      /* const URL = `http://localhost:3700/api/getProductsByCategory?category=${textSearch}`; */ // URL LOCAL
  
      const response = await fetch(URL);
      const data = await response.json();
      
      return data;
    } 
  })