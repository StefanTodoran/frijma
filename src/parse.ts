interface FoodItem {
  name: string,
  
  // until expiration in days, provide at least 1
  pantry?: number,
  fridge?: number,
  freezer?: number,
  on_open?: number,
  
  group?: string, // food type 
  tip?: string,
  no_data?: boolean, // no expiration data
}

var keywords_to_food_items: any[] = [];

fetch('data/foodkeeper.json', {mode: 'no-cors'})
  .then((response) => response.json())
  .then((food_data) => process_food_data(JSON.parse(JSON.stringify(food_data))));
  //.then((response) => {console.log})

function get_days(max_time: number, metric: string) {
  //console.log(metric);
  
  if (JSON.stringify(metric).includes("Days")) {
    return max_time;
  } else if (JSON.stringify(metric).includes("Weeks")) {
    return max_time * 7;
  } else if (JSON.stringify(metric).includes("Months")) {
    return max_time * 30;
  } else if (JSON.stringify(metric).includes("Years")) {
    return max_time * 365;
  } else if (JSON.stringify(metric).includes("Hours")) {
    return 1; // someone will know if the food is bad if it only lasts hours
  } else {
    console.log("this should never be called!");
  }
}

function process_food_data(food_data: any) {
  // let food = JSON.parse(JSON.stringify(food_entry))
  // console.log("-------------------")
  // console.log(JSON.stringify(food.Pantry_Max))
  // console.log("-------------------")

  for (let food_entry of food_data.sheets[2].data) {
    // find expiration by iterating through storage types for 1st non-null
    let food_name: string = food_entry[2]["Name"];
    let food_item: FoodItem = {name: food_name};

    if (food_entry[6] && !JSON.stringify(food_entry[6]).includes(null)) {
      food_item.pantry = get_days(food_entry[6]["Pantry_Max"], food_entry[7]);
    } else if (food_entry[10] && !JSON.stringify(food_entry[10]).includes(null)) {
      food_item.pantry = get_days(food_entry[10]["DOP_Pantry_Max"], food_entry[11]);
    }
    if (food_entry[17] && !JSON.stringify(food_entry[17]).includes(null)) {
      food_item.fridge = get_days(food_entry[17]["Refrigerate_Max"], food_entry[18]);
    } else if (food_entry[21] && !JSON.stringify(food_entry[21]).includes(null)) {
      food_item.fridge = get_days(food_entry[21]["DOP_Refrigerate_Max"], food_entry[22]);
    }
    if (food_entry[31] && !JSON.stringify(food_entry[31]).includes(null)) {
      food_item.freezer = get_days(food_entry[31]["Freeze_Max"], food_entry[32]);
    } else if (food_entry[35] && !JSON.stringify(food_entry[35]).includes(null)) {
      food_item.freezer = get_days(food_entry[35]["DOP_Freeze_Max"], food_entry[36]);
    }
    if (!food_item.pantry && !food_item.fridge && !food_item.freezer) {
      console.log("This item doesn't have storage info")
      continue;
    }         

    let keywords_string: string = food_entry[4]["Keywords"];
    if (!keywords_string) {
      // if there are no keywords, use the food item name as a keyword
      keywords_to_food_items.push([food_name], food_item);
    } else {
      keywords_to_food_items.push(keywords_string.split(','), food_item);
    }
  }
}

const COST_RATIO = 10;

function reconstruction_cost(abbr: string, keyword: string) {
  var dp: number[][] = [];
  for (let i = 0; i < abbr.length + 1; i++) {
    dp.push(new Array(keyword.length + 1).fill(0));
  }
  for (let i = 0; i < abbr.length + 1; i++) {
    for (let j = 0; j < keyword.length + 1; j++) {
      if (i == 0) {
        dp[i][j] = j;
      } else if (j == 0) {
        dp[i][j] = COST_RATIO * i;
      } else if (abbr.charAt(i - 1) == abbr.charAt(j - 1)) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          1 + dp[i][j - 1],
          COST_RATIO + dp[i - 1][j],
          1 + COST_RATIO + dp[i - 1][j - 1]
        );
      }
    }
  }
  return dp[abbr.length][keyword.length];  
}

function search(abbr: string) {
  for (let [keywords, food_item] of keywords_to_food_items) {

  }
}

// console.log(reconstruction_cost("crt", "carrot"));
search("crt");

//  0. "ID"
//  1. "Category_ID"
//  2. "Name"
//  3. "Name_subtitle"
//  4. "Keywords"
//  5. "Pantry_Min"
//  6. "Pantry_Max"
//  7. "Pantry_Metric"
//  8. "Pantry_tips"
//  9. "DOP_Pantry_Min"
// 10. "DOP_Pantry_Max"
// 11. "DOP_Pantry_Metric"
// 12. "DOP_Pantry_tips"
// 13. "Pantry_After_Opening_Min"
// 14. "Pantry_After_Opening_Max"
// 15. "Pantry_After_Opening_Metric"
// 16. "Refrigerate_Min"
// 17. "Refrigerate_Max"
// 18. "Refrigerate_Metric"
// 19. "Refrigerate_tips"
// 20. "DOP_Refrigerate_Min"
// 21. "DOP_Refrigerate_Max"
// 22. "DOP_Refrigerate_Metric"
// 23. "DOP_Refrigerate_tips"
// 24. "Refrigerate_After_Opening_Min"
// 25. "Refrigerate_After_Opening_Max"
// 26. "Refrigerate_After_Opening_Metric"
// 27. "Refrigerate_After_Thawing_Min"
// 28. "Refrigerate_After_Thawing_Max"
// 29. "Refrigerate_After_Thawing_Metric"
// 30. "Freeze_Min"
// 31. "Freeze_Max"
// 32. "Freeze_Metric"
// 33. "Freeze_Tips"
// 34. "DOP_Freeze_Min"
// 35. "DOP_Freeze_Max"
// 36. "DOP_Freeze_Metric"
// 37. "DOP_Freeze_Tips"
