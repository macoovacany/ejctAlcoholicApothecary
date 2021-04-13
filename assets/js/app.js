// ******************************************
// constants
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


// get list of available ingredients
// includes non-alocholic stuff


function getAPIIngredients() {
    // check if the api ingredients are already saved into local storage
    if (localStorage.getItem('api-ingredients') === null) {
        fetch(`https://www.thecocktaildb.com/api/json/v2/${API_KEY_COCKTAIL_DB}/list.php?i=list`)
            // .then(response => console.log(response));
            .then(response => response.json())
            .then(data => {
                // 
                data = data.drinks.map((d) => { return d.strIngredient1 });
                localStorage.setItem("api-ingredients", JSON.stringify(data));
            });
    }
}



// ******************************************
// update Suggested items 
// ******************************************

function writeSuggestedCocktails(drinks) {
    fetch(`https://www.thecocktaildb.com/api/json/v2/${API_KEY_COCKTAIL_DB}/filter.php?i=${drinks.join(',')}`)
        .then(response => response.json())
        .then(data => {


        });
}

// getSuggestedCocktails(["Vodka","Gin"]);

function suggestedCocktailUL(arrDrinks) {

}


function suggestedCocktailLI(cocktail) {
    html = `<li>
    <div class="w-full max-w-sm overflow-hidden rounded border bg-white shadow">
    <div class="relative">
    <div class="h-48 bg-cover bg-no-repeat bg-center" style="background-image: url(${cocktail.strDrinkThumb}"></div>
    <div style="background-color: rgba(0,0,0,0.6)"></div>
    <div style="bottom: -20px;" class="absolute right-0 w-10 mr-2">
            <img class="rounded-full border-2 border-white">
            </div>
            <div class="p-3" data-cocktail-id="${cocktail.idDrink}">
            <h3 class="mr-10 text-sm truncate-2nd">
                <a class="hover:text-blue-500" href="#">${cocktail.strDrink}</a>
            </h3>
            <p class="text-xs text-gray-500">
                <a href="#" class="hover:underline hover:text-blue-500"></a>
            </p>
        </div>
    </div>
    </div>
    </li>
    `
    return html;
};


window.addEventListener('DOMContentLoaded', (e) => {
    getAPIIngredients();
});
$('.owl-carousel').owlCarousel({
    margin: 10,
    loop: true,
    autoWidth: true,
    items: 4
})
$(".owl-carousel").owlCarousel();