// ******************************************
// get data from API calls
// ******************************************
const API_KEY_COCKTAIL_DB = 9973533;


// API call to get cocktail ingredients
function getCocktailDetailsbyID(cocktailID) {
    fetch(`https://www.thecocktaildb.com/api/json/v2/${API_KEY_COCKTAIL_DB}/lookup.php?i=${cocktailID}`)
        .then(response => response.json())
        .then(data => console.log(data));
}
// getCocktailDetailsbyID(11007)

// 
function getSuggestedCocktails(drinks) {
    fetch(`https://www.thecocktaildb.com/api/json/v2/${API_KEY_COCKTAIL_DB}/filter.php?i=${drinks.join(',')}`)
        .then(response => response.json())
        .then(data => console.log(data));
}
// getSuggestedCocktails(["Vodka","Gin"]);


// get list of available drinks
function getAvailableIngredients() {
    fetch(`https://www.thecocktaildb.com/api/json/v2/${API_KEY_COCKTAIL_DB}/list.php?i=list`)
        // .then(response => console.log(response));
        .then(response => response.json())
        .then(data => {
            data.
            localStorage.setItem("available-drinks", JSON.stringify(data))
        });
}





// ******************************************
// get access from local storage
// ******************************************




// ******************************************
// update the HTML DOM elements
// ******************************************
function writeCocktailCard(domLocation, cocktail) {
    console.log(cocktail.name);
    console.log(`<img src='${cocktail.imagesrc}' alt="${cocktail.name}"`)

};