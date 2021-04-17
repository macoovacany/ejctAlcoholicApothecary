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
    // loop: true,
    // autoWidth: true,
    width: "auto",
    height: "100px",
    items: 4
})

// Adding stock to the available ingredients in local storage, using a modal which displays drink options on auto-complete
// I need a function called when the button is pressed (an event listener is on the button), which renders a modal, and an opaque gray in the foreground, in the absolute center of the screen
// Event listeners for the entire scrollable, searchable menu, when clicked is toggled to enter the modalLocalIngredients array, and to toggle the appearance of the selected items
// If cancel is pressed then the modal disappears without making any changes to localIngredients
// If OK is pressed then the modal disappears and the changes are returned to localIngredients
const $addStockButton = document.querySelector("#addStockButton");
const $addStockModal = document.querySelector("#add-drinks");
const $modalCancel = document.querySelector("#modalCancel");
const $modalOK = document.querySelector("#modalOK");
const $modalList = document.querySelector("#modalList");
const $modalItem = document.querySelector("#modalItem");
const $modalSpan = document.querySelector("#modalSpan");
$addStockButton.addEventListener("click", () => {
    $addStockModal.removeClass("hidden");
    $addStockModal.addClass("add-stock-modal");
    $modalList.empty();
    document.body.append(`
    <div class="modal-bg"></div>
    `);
    const allIngredients = JSON.parse(localStorage.getItem("api-ingredients"));
    allIngredients.forEach((i) => {
        $modalList.append(`
            <div
                id="modalItem"
                data-toggle="false"
                class="flex justify-start cursor-pointer text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2">
                <span id="modalSpan" class="bg-gray-400 h-2 w-2 m-2 rounded-full"></span>
                <div class="flex-grow font-medium px-2">${allIngredients[i]}</div>
            </div>
        `)
    });
});


$modalItem.addEventListener("click", (e) => {
    if (e.currentTarget.dataset.toggle === "true") {
        e.currentTarget.removeClass("selected");
        e.currentTarget.querySelector("#modalSpan").removeClass("spanSelected");
        e.currentTarget.dataset.toggle = "false";
    } else {
        e.currentTarget.addClass("selected");
        e.currentTarget.querySelector("#modalSpan").addClass("spanSelected");
        e.currentTarget.dataset.toggle = "true";
    };
});

$modalCancel.addEventListener("click", () => {
    // TODO
});

$modalOK.addEventListener("click", () => {
    // TODO
});

// end of file