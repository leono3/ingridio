let ingredientCount = 0;
let ingredientArray = [];
let recipeList = [];
let recipeId = [];
let recipeInfo;

setUp();

function findLast(){
    console.log("last1");
    let lastRecipe = window.localStorage.getItem('lastRecipe');
    console.log(lastRecipe);
    const settings = {
        "async": false,
        "crossDomain": true,
        "url": `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${lastRecipe}/information`,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "10aec3ffa7mshdac16678f4fa80bp13ac63jsnadcdde4c2a5b",
            "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
        }
    };
    
    $.ajax(settings).done(function (response) {
        recipeList.push(response);
        console.log("last");
})
};

function findSnack(){
    console.log("snack1");
    const settings = {
        "async": false,
        "crossDomain": true,
        "url": `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?tags=dessert&number=1`,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "10aec3ffa7mshdac16678f4fa80bp13ac63jsnadcdde4c2a5b",
            "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
        }
    };
    
    $.ajax(settings).done(function (response) {
        recipeList.push(response.recipes[0]);
        console.log("random");
})};

function findRandom(){
    console.log("random1");
    const settings = {
        "async": false,
        "crossDomain": true,
        "url": `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?tags=lunch&number=1`,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "10aec3ffa7mshdac16678f4fa80bp13ac63jsnadcdde4c2a5b",
            "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
        }
    };
    
    $.ajax(settings).done(function (response) {
        recipeList.push(response.recipes[0]);
        console.log("random");
})};


function setUp() {
    findLast();
    findSnack();
    findRandom();
    console.log(recipeList);
    
    displayRecipe(recipeList);
  };

document.getElementById('ingredient-input').addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("add-button").click();
      document.getElementById("NAV-search-btn").click();
    }
  });

function addIngredient() {
    let newIngredient = document.getElementById("ingredient-input").value;
    
    ingredientArray[ingredientCount] = newIngredient;
    const ingridient = $("<span>");
    ingridient.text(newIngredient);

    const delButton = $("<button>").addClass("btn-close");
    delButton.attr("aria-label","Close");
    delButton.attr("item-count", ingredientCount);
    delButton.click(removeIngredient);

    const itemWrapper = $("<div>").addClass("list-item-wrapper");
    itemWrapper.append(ingridient);
    itemWrapper.append(delButton);

    const listItem = $("<li>").addClass(`list-group-item list-group-item-action ${ingredientCount}`);
    listItem.append(itemWrapper);

    const ingredientList = $(".ingredient-list");
    ingredientList.append(listItem);

    document.getElementById("ingredient-input").value = "";

    ingredientCount +=1;

    return delButton;
}

function removeIngredient(event){
    let number = event.target;
    console.log(number.getAttribute("item-count"));
    console.log(event.target);
    const removedItem = $(`.${number.getAttribute("item-count")}`);
    removedItem.remove();
    ingredientArray[number.getAttribute("item-count")] = null;
    console.log(ingredientArray);
}

function recipeFinder(){
    recipeCount = 0;
    const filtered = ingredientArray.filter(function (el) {
        return el != null;
    });
    searchRecipe(filtered.join(", "));
}

function NAVrecipeSearch(event){
    event.preventDefault();
    let searchQuery = document.getElementById("NAV-search").value;
    const settings = {
        "async": false,
        "crossDomain": true,
        "url": `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?query=${searchQuery}&number=18`,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "10aec3ffa7mshdac16678f4fa80bp13ac63jsnadcdde4c2a5b",
            "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
        }
    };
    
    $.ajax(settings).done(function (response) {
        console.log(response);
        recipeList = response.results;
        displayRecipe(recipeList);
});}

function searchRecipe(keyWords){
    const url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?ingredients=" + keyWords + "&number=18"
    const settings = {
        "async": false,
        "crossDomain": true,
        "url": url,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
            "X-RapidAPI-Key": "10aec3ffa7mshdac16678f4fa80bp13ac63jsnadcdde4c2a5b"
        }
    };
    $.ajax(settings).done(function (response) {
	console.log(response);
    recipeList = response;
    displayRecipe(recipeList);
})}

function displayRecipe(recipeList){
    for (let index = 0;index<3; index++){
        console.log(recipeList);
        console.log(index);
        console.log(recipeList[index]);
        recipeId.push(recipeList[index].id);
        let recipe = $(`.card${(index+1)}-img-top`);
        recipe.attr("src", recipeList[index].image);
        let label = $(`.card-title${(index+1)}`);
        if (isNaN(recipeList[index].likes)){
            label.text(recipeList[index].title);
        }
        else{
            label.text(recipeList[index].title + " (" + recipeList[index].likes +"👍)");    
            let usedIngredientCount = $(`.used-ingredient${(index+1)}`);
            usedIngredientCount.text(`Uses ${recipeList[index].usedIngredientCount} selected ingredient(s)`);
            let missedIngredientCount = $(`.missed-ingredient${(index+1)}`);
            missedIngredientCount.text(`Missing ${recipeList[index].missedIngredientCount} ingredient(s)`);
        }
    }

    let showMoreBtn = $("#show-more");
    showMoreBtn.removeClass("d-none").addClass("d-flex");
    recipeId.join("%");
    console.log(recipeId);
    getRecipe(recipeId);
    recipeId = [];
}

function getRecipe(recipeId){
    const url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk?ids=" + recipeId
    const settings = {
        "async": false,
        "crossDomain": true,
        "url": url,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
            "X-RapidAPI-Key": "10aec3ffa7mshdac16678f4fa80bp13ac63jsnadcdde4c2a5b"
        }
    };
    $.ajax(settings).done(function (response) {
	console.log(response);
    recipeInfo = response;
    return recipeInfo;
})}

function showRecipe(event){
    console.log("CLick")
    let num = event.getAttribute("number");
    number = parseInt(num);
    let id = recipeId[(number-1)];
    localStorage.setItem('lastRecipe', recipeInfo[(number-1)].id);
    let recipeUrl = recipeInfo[(number-1)].sourceUrl;
    window.open(recipeUrl, '_blank').focus();

}

function resetFind(){
    $(".list-group-item").remove();
    ingredientCount = 0;
    ingredientArray = [];
    recipeList = [];
}

function showMore(){
    console.log("SHOWMORE");
    console.log(recipeList);
    recipeList.splice(0,3);
    console.log(recipeList);
    displayRecipe(recipeList);
}


// function showInfo(event){
//     let cardNum = event.target.getAttribute("card")

// }
// function fetchRecipes() {
//     // API request for USDA food list
//     $.getJSON("https://api.nal.usda.gov/fdc/v1/foods/list?api_key=nZxmwjSMlpgFxlnvqEMSLAhOnpHCFmRxENBsiGIA", function(data){
    
//         console.log(data);
    
//     });

// // }

// const ingredientSearchButton = document.getElementById("ingredientSearchButton");
// ingredientSearchButton.addEventListener("click", fetchRecipes);