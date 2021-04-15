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

// https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array
function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function getRandomIngedients(count) {

}
















// ******************************************
// update Suggested items 
// ******************************************
drinks = ["Vodka", "Gin", "Tequila"];
let suggestedCocktailsURL = `https://www.thecocktaildb.com/api/json/v2/${API_KEY_COCKTAIL_DB}/filter.php?i=${drinks.join(',')}`
fetch(suggestedCocktailsURL)
    .then(response => response.json())
    .then(data => {
        // build the html list items from the drinks arrat
        html = '';
        data.drinks.forEach(drink => {
            html = html + suggestedCocktailLI(drink);
        });
        // update the DOM
        $("#suggested-cocktails").html(`<ul>${html}</ul>`);
    })


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

// Adding stock to the available ingredients in local storage, using a modal which displays drink options on auto-complete
// I need a function called when the button is pressed (an event listener is on the button), which renders a modal, and an opaque gray in the foreground, in the absolute center of the screen
// Event listeners for the entire scrollable, searchable menu, when clicked is toggled to enter the modalLocalDrinks array, and to toggle the appearance of the selected items
// If cancel is pressed then the modal disappears without making any changes to localDrinks
// If OK is pressed then the modal disappears and the changes are returned to localDrinks
const $addStockButton = document.querySelector("#addStockButton");
const $addStockModal = document.querySelector("#add-drinks");
const $modalCancel = document.querySelector("#modalCancel");
const $modalOK = document.querySelector("#modalOK");
$addStockButton.addEventListener("click", () => {
    $addStockModal.removeClass("hidden");
    $addStockModal.addClass("add-stock-modal");
    document.body.append(`
    <div class="modal-bg"></div>
    `);

});
