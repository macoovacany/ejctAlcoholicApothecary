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
// Available Ingredients section 
// ******************************************
$('#ingredients-selection-ui').on("click", (e) => {
    let clickedIngredient = e.target.parent;
    let stockItem = {
        ingredient: clickedIngredient.data.ingredient,
        isSelected: clickedIngredient.data.isSelected
    };
    console.log("clicked on an ingredient" + e.target);
    // get the target of the click
    // toggle the data attribute of the ingredient
    // 
});

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
        loop: false,
        autoWidth: true,
        width: "auto",
        height: "100px"
    };


    if (localIngredients.length === 0) {
        html = `<div class="owl-carousel flex items-center" id="ingredients-carousel">
        <div class="ingredient-select" data-is-selected="null" data-ingredient="undefined">
        <img src="./assets/images/empty-pantry.jpg" alt="No Ingredients Available" style="{position:absolute; height:100px; width:151px;} :hover {}">
        </div>`;

        owlSettings.items = 1;

    } else {
        localIngredients.forEach(ing => {
            html = html + ingredientsCarouselTemplate(ing);
        });

        owlSettings.items = localIngredients.length;
    }

    $('#ingredients-carousel').html(html);
    $('.owl-carousel').owlCarousel(owlSettings);

}

function ingredientsCarouselTemplate(ing) {
    let imgURL = `https://www.thecocktaildb.com/images/ingredients/${encodeURI(ing)}-Small.png`;
    html = `<div class="ingredient-select" data-is-selected="false" data-ingredient="${ing}">
    <img src="${imgURL}" alt="${ing}">
</div>`;
    return html;
}

$('#suggestCocktailsButton').on("click", (e) => {
    fetchingDrinks(); //update ui
    drinks = ["Vodka", "Gin", "Tequila"];
    let suggestedCocktailsURL = `https://www.thecocktaildb.com/api/json/v2/${API_KEY_COCKTAIL_DB}/filter.php?i=${drinks.join(',')}`

    fetch(suggestedCocktailsURL)
        .then(response => response.json())
        .then(data => {
            // build the html list items from the drinks arrat
            html = '';
            data.drinks.forEach(drink => {
                html = html + suggestedCocktailTemplate(drink);
            });
            // update the DOM
            $("#suggested-cocktails").html(`<ul>${html}</ul>`);
        })
});


function suggestedCocktailTemplate(cocktail) {
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
const $modalItem = document.querySelector("#modalItem"); // missing
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

//  ***************************
// modalItem is missing

// $modalItem.addEventListener("click", (e) => {
//     if (e.currentTarget.dataset.toggle === "true") {
//         e.currentTarget.removeClass("selected");
//         e.currentTarget.querySelector("#modalSpan").removeClass("spanSelected");
//         e.currentTarget.dataset.toggle = "false";
//     } else {
//         e.currentTarget.addClass("selected");
//         e.currentTarget.querySelector("#modalSpan").addClass("spanSelected");
//         e.currentTarget.dataset.toggle = "true";
//     };
// });



$modalCancel.addEventListener("click", () => {
    // TODO
});

$modalOK.addEventListener("click", () => {
    // TODO
});



// window loaded section

function initLocalIngredients() {
    if (!localStorage.getItem('localIngredients')) {
        localStorage.setItem('localIngredients', JSON.stringify([]));
    }
};


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





window.addEventListener('DOMContentLoaded', (e) => {
    initLocalIngredients();
    getAPIIngredients();
    TEST_getRandomIngedientsIntoLocalStorage(7);
    loadIngredientCarousel();
    updateCarousel(4);
    noSuggestedDrinks();
});