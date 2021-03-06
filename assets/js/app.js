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

// get list of available ingredients
// includes non-alocholic stuff
function getAPIIngredients() {
    // check if the api ingredients are already saved into local storage
    if (localStorage.getItem('api-ingredients') === null) {
        fetch(`https://www.thecocktaildb.com/api/json/v2/${API_KEY_COCKTAIL_DB}/list.php?i=list`)
            .then(response => response.json())
            .then(data => {
                //
                data = data.drinks.map((d) => { return d.strIngredient1 });
                localStorage.setItem("api-ingredients", JSON.stringify(data));
            });
    }
}
// ******************************************
// Available Ingredients section
// ******************************************

$('#ingredients-carousel').on("click", (e) => {
    let clickedIngredient = e.target.parentNode;

    if ('isSelected' in clickedIngredient.dataset) {
        let isSelected = JSON.parse(clickedIngredient.dataset.isSelected);
        clickedIngredient.dataset.isSelected = (!isSelected).toString();
    }

})

function updateCarousel(itemCount = 4) {
    $('.owl-carousel').owlCarousel({
        margin: 10,
        loop: true,
        autoWidth: true,
        width: "auto",
        height: "100px",
        items: itemCount
    });
}
        

function loadIngredientCarousel() {
    let localIngredients = JSON.parse(localStorage.getItem('localIngredients'));
    let html = '';


    let owlSettings = {
        margin: 10,
        loop: true,
        autoWidth: true,
        width: "auto",
        height: "100px",

    };


    if (localIngredients.length === 0) {
        html = `<div class="owl-carousel flex items-center" id="ingredients-carousel">
        <div class="ingredient-select" data-is-selected="null" data-ingredient="undefined" width="151px">
        <img src="./assets/images/empty-pantry.jpg" alt="No Ingredients Available" title="No Ingredients Available">
        </div>`;

        owlSettings.loop = false;
        owlSettings.items = 1;

    } else {
        localIngredients.forEach(ing => {
            let imgURL = `https://www.thecocktaildb.com/images/ingredients/${encodeURI(ing)}-Small.png`;
            moreHtml = `<div class="ingredient-select" data-is-selected="false" data-ingredient="${ing}">
            <img src="${imgURL}" alt="${ing}" title="${ing}">
            </div>`;
            html = html + moreHtml;
        });

        owlSettings.items = localIngredients.length;
    }

    $('#ingredients-carousel').html(html);
    $('.owl-carousel').owlCarousel(owlSettings);
}


$('#suggestCocktailsButton').on("click", (e) => {
    $('#suggestedCocktails').removeClass('hidden');
    fetchingDrinks(); //update ui

    // test case:
    // drinks = ["Vodka", "Gin", "Tequila"];
    let drinks = [];

    $('.ingredient-select').each((i) => {
        if (JSON.parse($('.ingredient-select')[i].dataset.isSelected)) {
            drinks.push($('.ingredient-select')[i].dataset.ingredient);
        };
    });

    // update the suggested drinks menu
    if (drinks.length === 0) {
        // alert('Please Choose some drinks');
    } else {
        let suggestedCocktailsURL = `https://www.thecocktaildb.com/api/json/v2/${API_KEY_COCKTAIL_DB}/filter.php?i=${drinks.join(',')}`;
        fetch(suggestedCocktailsURL)
            .then(response => response.json())
            .then(data => {
                // build the html list items from the drinks arrat
                if (data.drinks === "None Found") {
                    noCocktailsFound();

                } else {
                    html = '';
                    data.drinks.forEach(drink => {
                        html = html + suggestedCocktailTemplate(drink);
                    });
                    // update the DOM
                    $("#suggested-cocktails").html(`<ul>${html}</ul>`);
                }
            })
    }
});

function suggestedCocktailTemplate(cocktail) {
    html = `
<li>
    <div class="w-full max-w-sm overflow-hidden rounded border bg-white shadow">
        <div class="relative" data-cocktail-id="${cocktail.idDrink}">
            <div class="suggested-cocktail-height bg-cover bg-no-repeat bg-center" style="background-image: url(${cocktail.strDrinkThumb}"></div>
            <div style="background-color: rgba(0,0,0,0.6)"></div>
            <div style="bottom: -20px;" class="right-0 w-10 mr-2">
                <img class="rounded-full border-2 border-white">
            </div>
            <h3 class=" p-4mr-10 text-sm truncate-2nd hover:text-blue-500"> ${cocktail.strDrink} </h3>
        </div>
    </div>
</li>
        `
    return html;
};

function noSuggestedDrinks() {
    let html = suggestedCocktailTemplate({
        strDrinkThumb: './assets/images/empty-bar.jpg',
        idDrink: "Nan",
        strDrink: "No cocktails suggested yet."
    });
    $("#suggested-cocktails").html(`<ul>${html}</ul>`);
};

function fetchingDrinks() {
    let html = suggestedCocktailTemplate({
        strDrinkThumb: './assets/images/fetching-suggestions.gif',
        idDrink: "Nan",
        strDrink: "Please wait while we find some suggestions."
    });
    $("#suggested-cocktails").html(`<ul>${html}</ul>`);
};

function noCocktailsFound() {
    let html = suggestedCocktailTemplate({
        strDrinkThumb: "./assets/images/no-cocktails-found.jpg",
        idDrink: NaN,
        strDrink: "Sorry, can't make anything with those ingredients"
    });
    $("#suggested-cocktails").html(`<ul>${html}</ul>`);
};


// Adding stock to the available ingredients in local storage, using a modal which displays drink options on auto-complete
// I need a function called when the button is pressed (an event listener is on the button), which renders a modal, and an opaque gray in the foreground, in the absolute center of the screen
// Event listeners for the entire scrollable, searchable menu, when clicked is toggled to enter the modalLocalIngredients array, and to toggle the appearance of the selected items
// If cancel is pressed then the modal disappears without making any changes to localIngredients
// If OK is pressed then the modal disappears and the changes are returned to localIngredients
const $addStockButton = document.querySelector("#addStockButton"); // Button labelled 'Add more drink stock'
const $addStockModal = document.querySelector("#add-drinks"); // Section which is modal
const $modalCancel = document.querySelector("#modalCancel"); // Button in modal labelled 'Cancel'
const $modalOK = document.querySelector("#modalOK"); // Button in modal labelled 'Add to Bar Stock'
const $modalList = document.querySelector("#modalList"); // Scrollable list of ingredients
const $modalSpan = document.querySelector("#modalSpan"); // Small circle on each line, cosmetically indicates selection
$addStockButton.addEventListener("click", () => { // This will open modal on click
    // console.log("Clicked 'Add more drink stock' ");
    $addStockModal.classList.remove("hidden"); // This makes the modal visible
    // console.log("Show modal");
    // $addStockModal.addClass("add-stock-modal"); // This will add a class ... forgot why this is here
    $modalList.innerHTML = ''; // Empties the modal list of the previous html
    // console.log("Empty list");
    $modalList.classList.add("overflow-auto", "h-64")
    $(document.body).append(`
    <div class="modal-bg"></div>
    `);
    const allIngredients = JSON.parse(localStorage.getItem("api-ingredients")); // Grabs a list of ingredients from local storage
    // console.log(allIngredients);
    allIngredients.forEach((ingredient) => { // Creates a list item for each ingredient consecutively
        $modalList.innerHTML += `
        <div
            data-toggle="false"
            class="js-modal-item flex justify-start cursor-pointer text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2">
            <span class="js-modal-item-indicator bg-gray-400 h-2 w-2 m-2 rounded-full"></span>
            <span class="flex-grow font-medium px-2">${ingredient}</span>
        </div>
        `; // Html element appended to the list
    });
    // console.log("Make list of ingredients");
});

$(document.body).on("click", '.js-modal-item', (e) => {
    const $item = $(e.currentTarget);
    const isSelected = e.currentTarget.dataset.toggle === 'true';
    const $dot = $item.find(".js-modal-item-indicator");
    $item.toggleClass("text-gray-700", isSelected);
    $item.toggleClass("text-green-700", !isSelected);
    $dot.toggleClass("bg-gray-400", isSelected);
    $dot.toggleClass("bg-green-400", !isSelected);
    e.currentTarget.dataset.toggle = isSelected ? 'false' : 'true';
});
$modalCancel.addEventListener("click", () => {

    $addStockModal.classList.add("hidden");
});
$modalOK.addEventListener("click", () => {

    // new set of ingredients every time
    // let localIngredients = [];

    // remeber previous options
    let localIngredients = JSON.parse(localStorage.getItem("localIngredients"));

    $('[data-toggle=true]').find('span:last').each((i, item) => localIngredients.push($(item).text()))
        // console.log(localIngredients);
    localStorage.setItem("localIngredients", JSON.stringify(localIngredients))
    $('.owl-carousel').trigger('destroy.owl.carousel')
    loadIngredientCarousel()
    $addStockModal.classList.add("hidden");
});


// TESTING load 10 random ingredients into localStorage()
// https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array
function TEST_getRandomIngedientsIntoLocalStorage(n = 10) {
    let APIingredients = JSON.parse(localStorage.getItem('api-ingredients'));
    var result = new Array(n),
        len = APIingredients.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = APIingredients[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    localStorage.setItem('localIngredients', JSON.stringify(result));;
};


// update the ingredients html when the user clicks on the cocktail in suggested-cocktails
$('#suggested-cocktails').on('click', (e) => {
    console.log(e);
    // happy path??

    drinkID = e.target.parentNode.dataset.cocktailId;

    $('#suggested-cocktails').addClass("hidden");

    let cocktailsIDURL = `https://www.thecocktaildb.com/api/json/v2/${API_KEY_COCKTAIL_DB}/lookup.php?i=${drinkID}`;
    fetch(cocktailsIDURL)
        .then(response => response.json())
        .then(data => {
            cocktail = data.drinks[0];

            $('#mixing-instructions').html(mixingInstructionsTemplate(cocktail));
            $('#mixing-instructions').removeClass('hidden');
        })
});


function mixingInstructionsTemplate(cocktail) {

    i = 1;
    ingHTML = '';

    while (cocktail[`strIngredient${i}`] != null) {
        ingAndMeasure = cocktail[`strMeasure${i}`] + ' of ' + cocktail[`strIngredient${i}`];
        ingHTML = ingHTML + `<li>${ingAndMeasure } </li>`;
        i++; // very important
    }

    return `    <div class="mx-auto bg-gray-700 h-screen flex items-center justify-center px-8">
    <div class="flex flex-col w-full bg-white rounded shadow-lg sm:w-1/2 md:w-3/4 lg:w-full">
        <div class="w-full h-64 bg-top bg-cover rounded-t" style="background-image: url(${cocktail.strDrinkThumb})"></div>
        <div class="flex flex-col w-full md:flex-row">
            <div class="flex flex-row justify-around p-4 font-bold leading-none text-gray-800 uppercase bg-gray-400 rounded md:flex-col md:items-center md:justify-center md:w-1/4">
                <div class="subtitle-js">Ingredients</div>
                <div class="md:text-xl">
                    <ul id="cocktail-ingredients">
                  ${ingHTML}  
                    </ul>
                </div>

            </div>
            <div class="p-4 font-normal text-gray-800 md:w-3/4">
                <h1 class="mb-4 text-4xl font-bold leading-none tracking-tight text-gray-800">Method</h1>
                <p>${cocktail.strDrink}</p>
                <p class="leading-normal">
                  ${cocktail.strInstructions}                </p>
                <div class="flex flex-row items-center mt-4 text-gray-700">
                    <div class="w-1/2 md:text-xl font-bold">
                        Enjoy your homemade cocktail!!
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`
}





window.addEventListener('DOMContentLoaded', (e) => {
    // can assumme that this local storage always exists, but may be empty
    if (!localStorage.getItem('localIngredients')) {
        localStorage.setItem('localIngredients', JSON.stringify([]));
    }

    getAPIIngredients();
    // TEST_getRandomIngedientsIntoLocalStorage(7);
    loadIngredientCarousel();
    updateCarousel(4);
    noSuggestedDrinks();
});