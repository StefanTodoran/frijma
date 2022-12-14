window.addEventListener('load', init);

/**
 * Initialization function that should handle anything that needs to occur
 * on page load (include changing from one page to another).
 */
function init() {

  const examples: FoodItem[] = [
    { name: "Apples", raw: "appl", group: "fruit", pantry: 12, fridge: 24 },
    { name: "Carrots", raw: "crt", group: "vegetable", fridge: 21, pantry: 7 },
    { name: "Margarine", raw: "margrn", fridge: 124, on_open_fridge: 62 },
    { name: "Minced Beef", raw: "mncd beef", group: "meat", fridge: 2, freezer: 5 },
    { name: "Pancake Mix", raw: "pnck mix", group: "grains", pantry: 19, on_open_pantry: 12 },
    { name: "Yogurt", raw: "yogurt", group: "dairy", fridge: 7, freezer: 31, on_open_fridge: 3 },
    { name: "Broccoli", raw: "brcli", group: "vegetable", fridge: 5, pantry: 2 },
    { name: "Jam", raw: "jam", on_open_fridge: 365 },
    { name: "Bread", raw: "bread", group: "grains", pantry: 4, fridge: 22, on_open_fridge: 15 },
    { name: "Milk", raw: "milk", group: "dairy", on_open_fridge: 1, fridge: 7 },
  ];

  displayFoodItems(examples, "Example Data Visualization");
  setupCamera();

  const show_more_btn = document.getElementById('show-more-btn');
  const show_more_section = document.querySelectorAll('.show-more-section');
  const demo = document.getElementById('demo');
  show_more_btn.addEventListener('click', () => {
    demo.classList.toggle('shown');
    if (show_more_btn.textContent == "See More") {
      show_more_btn.textContent = "Go Back";
    } else {
      show_more_btn.textContent = "See More";
    }
    for (let i = 0; i < show_more_section.length; i++) {
      show_more_section[i].classList.toggle('shown');
    }
  });
}

interface RecipeItem {
  title: string,
  utilized: string[], // specific food items user used in this recipe
  time: number, // time to make in mins
  img: string,
  url: string, // link to the recipe
}

/**
 * Takes a list of RecipeItems and displays them in the recipe list with appropraite icons
 * and description, as well as a link. Clears the container.
 * @param recipe_items The list of recipe items
 * @param message Some text to display at the top of the list
 */
function displayRecipes(recipe_items: RecipeItem[], message: string = "Your Recipes") {
  const container = document.getElementById('recipes');
  const template = document.getElementById('recipe-template');

  // clear the container except the template child
  container.innerHTML = "";
  container.appendChild(template);

  const MAX_RECIPES = 8;
  for (let i = 0; i < Math.min(MAX_RECIPES, recipe_items.length); i++) {
    const item = recipe_items[i];
    // @ts-ignore
    const node: HTMLElement = template.cloneNode(true);

    node.classList.remove('hidden');
    node.id = "";
    node.querySelector('h2.recipe-name').textContent = item.title;
    node.querySelector('span').textContent = nbsp(" (") + item.time + " mins)";
    node.querySelector('.recipe-img').setAttribute('src', item.img);
    
    node.querySelector('.recipe-url').setAttribute('href', item.url);
    node.addEventListener('click', () => {
      window.open(item.url, '_blank');
    });

    const MAX_INGREDIENTS = 10;
    let utilized = "Includes ";
    for (let j = 0; j < Math.min(MAX_INGREDIENTS, item.utilized.length); j++) {
      if (item.utilized[j]) {
        utilized += item.utilized[j].toLowerCase() + ", ";
      }
    }
    utilized.slice(0, -2);
    utilized += "...";
    node.querySelector('p').textContent = utilized;

    // insert after template
    container.insertBefore(node, template);
  }

  const text = document.createElement('h2');
  text.innerText = message;
  text.style.textAlign = "center";
  container.insertBefore(text, container.firstChild);
  container.classList.remove('hidden');
}

interface FoodItem {
  name: string,
  raw: string, // raw text from receipt

  // until expiration in days, provide at least 1
  pantry?: number,
  on_open_pantry?: number,
  fridge?: number,
  on_open_fridge?: number,
  freezer?: number,

  days_left?: number, // not displayed

  group?: string, // fruit, vegetable, dairy, grains, or meat
  tip?: string,
}

/**
 * Takes a list of FoodItems and displays them in the visualizer with appropraite icons
 * as a bar graph of the duration that they keep in various environments. Clears the visualizer.
 * @param food_items The list of food items
 * @param message Some text to display at the top of the visualizer
 */
function displayFoodItems(food_items: FoodItem[], message: string = "Your Data") {
  const container = document.getElementById('visualizer');
  const template = document.getElementById('food-item-template');

  // clear the container except the template child
  container.innerHTML = "";
  container.appendChild(template);

  for (let i = 0; i < food_items.length; i++) {
    const item = food_items[i];
    // @ts-ignore
    const node: HTMLElement = template.cloneNode(true);

    node.classList.remove('hidden');
    node.id = "";
    node.querySelector('h2').textContent = item.name;
    node.querySelector('h3').textContent = '(' + item.raw.toUpperCase() + ')';
    if (item.group) {
      node.classList.add(item.group);
    }

    let has_double = false;

    addDuration(node, "pantry", item.pantry);
    has_double = addDuration(node, "on_open_pantry", item.on_open_pantry);
    addDuration(node, "fridge", item.fridge);
    has_double = addDuration(node, "on_open_fridge", item.on_open_fridge) || has_double;
    addDuration(node, "freezer", item.freezer);

    if (has_double) {
      node.querySelector('.food-duration-container').classList.add('double-len');
    }

    // insert after template
    container.insertBefore(node, template);
  }

  if (food_items.length === 0) {
    message = "Bad read. No data to display.";
  }

  const text = document.createElement('h2');
  text.innerText = message;
  text.style.textAlign = "center";
  container.insertBefore(text, container.firstChild);
}

function queryRecipes(food_items: FoodItem[]) {
  if (food_items.length == 0) {
    return;
  }
  let food_item1 = null;
  let min_days_left = Number.MAX_SAFE_INTEGER;
  for (let food_item of food_items) {
    if (food_item.days_left < min_days_left) {
      food_item1 = food_item;
      min_days_left = food_item.days_left;
    }
  }
  let food_item2 = null;
  min_days_left = Number.MAX_SAFE_INTEGER;
  for (let food_item of food_items) {
    if (food_item.group != food_item1.group && food_item.days_left < min_days_left) {
      food_item2 = food_item;
      min_days_left = food_item.days_left;
    }
  }
  let food_names = [food_item1.name];
  if (food_item2) {
    food_names.push(food_item2.name);
  }
  fetch('https://api.edamam.com/search?q=' + food_names.join('+') + '&app_id=95184d17&app_key=0f50ed3c9420a4de48414fe67d08b4bc')
    .then((response) => response.json())
    .then((response) => processRecipes(JSON.parse(JSON.stringify(response.hits))));
}

function processRecipes(recipe_objs: any) {
  let recipes: RecipeItem[] = []
  for (let recipe_obj of recipe_objs) {
    let recipe = recipe_obj.recipe;
    let ingredients: string[] = [];
    for (let i = 0; i < recipe.ingredients.length; i++) {
      ingredients.push(recipe.ingredients[i].food);
    }
    let recipe_item: RecipeItem = {
      title: recipe.label,
      utilized: ingredients,
      img: recipe.image,
      time: Math.max(recipe.totalTime, 10),  // minimum time is 10 min
      url: recipe.url
    }
    recipes.push(recipe_item);
  }
  displayRecipes(recipes);
}

/**
 * Sets up a food-duration bar inside a food-item, or if the food duration is unset,
 * hides the corresponding div. Returns true if the duration was set and the bar is visible.
 * @param node A food-item div, a clone of the foot-item template
 * @param type A duration type, one of the four options in the FoodItem interface 
 * @param duration The actual value stored for that duration in the FoodItem object, can be null
 * @returns A boolean that is true if the duration bar is visible and false otherwise
 */
function addDuration(node: HTMLElement, type: string, duration: number) {
  const indicator: HTMLElement = node.querySelector("." + type); //.food-duration.{some type}
  if (duration) {
    const length = (duration ** 0.5).toString();
    indicator.style.setProperty('--length', length);
    const raw_text = (duration > 1) ? duration.toString() + ' days' : duration.toString() + ' day';
    const display_duration = nbsp(quoted(raw_text));
    indicator.style.setProperty('--days', display_duration);

    if (duration < 7) {
      indicator.classList.add('short-duration');
    }

    return true;
  } else {
    node.querySelector('.food-duration-container').removeChild(indicator);
    return false;
  }
}

// Replaces spaces with non breaking spaces.
function nbsp(string: string) {
  return string.replace(/ /g, '\u00a0');
}

function quoted(string: string) {
  return '"' + string + '"';
}
