var keywords_to_food_items: any[] = [];

var final_food_items: FoodItem[] = [];

function parse_data(raw_receipt: string) {
    keywords_to_food_items = [];
    final_food_items = [];
    console.log(raw_receipt);
    fetch('data/foodkeeper.json', { mode: 'no-cors' })
        .then((response) => response.json())
        .then((food_data) => process_food_data(JSON.parse(JSON.stringify(food_data)), raw_receipt));
}

function get_days(max_time: number, metric: string) {
    if (JSON.stringify(metric).includes("Day")) {
        return max_time;
    } else if (JSON.stringify(metric).includes("Week")) {
        return max_time * 7;
    } else if (JSON.stringify(metric).includes("Month")) {
        return max_time * 30;
    } else if (JSON.stringify(metric).includes("Year")) {
        return max_time * 365;
    } else if (JSON.stringify(metric).includes("Hour")) {
        return 1; // someone will know if the food is bad if it only lasts hours
    } else {
        console.log("this should never be called! metric: " + metric);
    }
}

function get_category(category_id_object: any) {
    let category_id = category_id_object["Category_ID"];
    if ((category_id >= 10 && category_id <= 17) || (category_id >= 20 && category_id <= 22)) {
        return "meat"
    } else if (category_id == 19 || category_id == 24) {
        return "vegetable"
    } else if (category_id == 19) {
        return "fruit"
    } else if ((category_id >= 2 && category_id <= 4) || category_id == 9) {
        return "grains"
    } else if (category_id == 7) {
        return "dairy"
    } else {
        return "default"
    }
}

function process_food_data(food_data: any, raw_receipt: string) {
    for (let food_entry of food_data.sheets[2].data) {
        // find expiration by iterating through storage types for 1st non-null
        let food_name: string = food_entry[2]["Name"];
        let food_item: FoodItem = { name: food_name, raw: "" };

        let food_category: string = get_category(food_entry[1]);
        if (food_category != "default") {
            food_item.group = food_category;
        }

        food_item.days_left = 0;

        if (food_entry[6] && !JSON.stringify(food_entry[6]).includes(null)) {
            let num_days = get_days(food_entry[6]["Pantry_Max"], food_entry[7]);
            food_item.pantry = num_days;
            food_item.days_left += num_days;
        } else if (food_entry[10] && !JSON.stringify(food_entry[10]).includes(null)) {
            let num_days = get_days(food_entry[10]["DOP_Pantry_Max"], food_entry[11]);
            food_item.pantry = num_days;
            food_item.days_left += num_days;
        }
        if (food_entry[14] && !JSON.stringify(food_entry[14]).includes(null)) {
            let num_days = get_days(food_entry[14]["Pantry_After_Opening_Max"], food_entry[15]);
            food_item.on_open_pantry = num_days;
            food_item.days_left += num_days;
        }
        if (food_entry[17] && !JSON.stringify(food_entry[17]).includes(null)) {
            let num_days = get_days(food_entry[17]["Refrigerate_Max"], food_entry[18]);
            food_item.fridge = num_days;
            food_item.days_left += num_days;
        } else if (food_entry[21] && !JSON.stringify(food_entry[21]).includes(null)) {
            let num_days = get_days(food_entry[21]["DOP_Refrigerate_Max"], food_entry[22]);
            food_item.fridge = num_days;
            food_item.days_left += num_days;
        }
        if (food_entry[25] && !JSON.stringify(food_entry[25]).includes(null)) {
            let num_days = get_days(food_entry[25]["Refrigerate_After_Opening_Max"], food_entry[26]);
            food_item.on_open_fridge = num_days;
            food_item.days_left += num_days;
        }
        if (food_entry[31] && !JSON.stringify(food_entry[31]).includes(null)) {
            let num_days = get_days(food_entry[31]["Freeze_Max"], food_entry[32]);
            food_item.freezer = num_days;
            food_item.days_left += num_days;
        } else if (food_entry[35] && !JSON.stringify(food_entry[35]).includes(null)) {
            let num_days = get_days(food_entry[35]["DOP_Freeze_Max"], food_entry[36]);
            food_item.freezer = num_days;
            food_item.days_left += num_days;
        }
        if (!food_item.pantry && !food_item.fridge && !food_item.freezer &&
            !food_item.on_open_pantry && !food_item.on_open_fridge) {
            // this item doesn't have storage info
            continue;
        }

        let keywords_string: string = food_entry[4]["Keywords"];
        if (!keywords_string || keywords_string == '') {
            // if there are no keywords, use the food item name as a keyword
            keywords_to_food_items.push([[food_name.toLowerCase()], food_item]);
        } else {
            keywords_string = keywords_string.split(' ').join('');
            let keywords = keywords_string.split(',');
            let filtered_keywords = [];
            for (let keyword of keywords) {
                if (keyword !== '') {
                    filtered_keywords.push(keyword.toLowerCase());
                }
            }
            keywords_to_food_items.push([filtered_keywords, food_item]);
        }
    }

    process_receipt(raw_receipt);
}

var INSERTION_COST = 1;
var DELETION_COST = 3;

function reconstruction_cost(receipt_name: string, keyword: string) {
    let dp: number[][] = [];
    for (let i = 0; i < receipt_name.length + 1; i++) {
        dp.push(new Array(keyword.length + 1).fill(0));
    }
    for (let i = 0; i < receipt_name.length + 1; i++) {
        for (let j = 0; j < keyword.length + 1; j++) {
            if (i == 0) {
                dp[i][j] = INSERTION_COST * j;
            } else if (j == 0) {
                dp[i][j] = DELETION_COST * i;
            } else if (receipt_name.charAt(i - 1) == keyword.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    INSERTION_COST + dp[i][j - 1],
                    DELETION_COST + dp[i - 1][j],
                    INSERTION_COST + DELETION_COST + dp[i - 1][j - 1]
                );
            }
        }
    }
    return dp[receipt_name.length][keyword.length];
}

var NAME_CONSIDERATION = 0.1;

function search(receipt_name: string) {
    let min_cost = Number.MAX_SAFE_INTEGER;
    let closest_food_item = null;
    // let closest_keywords = null;  // for logging
    let receipt_words = receipt_name.split(' ');
    let receipt_word_count = receipt_words.length;
    for (let [keywords, food_item] of keywords_to_food_items) {
        let total_over_words = 0;
        for (let receipt_word of receipt_words) {
            let keyword_min_cost = Number.MAX_SAFE_INTEGER;
            for (let keyword of keywords) {
                let cost = reconstruction_cost(receipt_word, keyword);
                if (cost < keyword_min_cost) {
                    keyword_min_cost = cost;
                }
            }
            total_over_words += keyword_min_cost;
        }
        let curr_avg_cost = total_over_words / receipt_word_count;
        let name_cost = reconstruction_cost(receipt_name, food_item.name);
        let true_cost = (NAME_CONSIDERATION * name_cost + (1 - NAME_CONSIDERATION) * curr_avg_cost) / receipt_name.length;
        if (true_cost < min_cost) {
            closest_food_item = food_item;
            min_cost = true_cost;
        }
    }

    return [closest_food_item, min_cost];
}

function is_letter(char: string) {
    return char.toLowerCase() != char.toUpperCase();
}

function is_number(char: string) {
    return !isNaN(parseInt(char, 10));
}

const MAX_COST = 1;

function process_receipt(receipt: string) {
    let receipt_lines = receipt.toLowerCase().split('\n');
    let receipt_names: string[] = [];
    for (let receipt_line of receipt_lines) {
        if (receipt_line.includes("total")) {
            break;
        }
        let re = new RegExp("(^.*[0-9]{1,2}[.][0-9]{2}|^.*[0-9]{1,2}[\s][0-9]{2})");
        if (re.test(receipt_line)) {
          let re_money = new RegExp("[0-9]{1,2}[.][0-9]{2}");
          let re_result = re_money.exec(receipt_line);
          receipt_line = receipt_line.slice(0, re_result.index);

          receipt_line = receipt_line.replace(/[^a-zA-Z, \s]/g, '');
          receipt_line = receipt_line.replace(/(\s.\s|\s.$|^.\s)/g, '');

          if (receipt_line == '') {
            continue;
          }

          receipt_names.push(receipt_line.trim());
        }
    }
    console.log(receipt_names)

    for (let receipt_name of receipt_names) {
        let [food_item, cost] = search(receipt_name);
        if (cost > MAX_COST) {
            continue;
        }
        if (food_item.raw == "") {
            food_item.raw = receipt_name;
            final_food_items.push(food_item);
        }
        let prev_cost = reconstruction_cost(food_item.raw, food_item.name);
        let curr_cost = reconstruction_cost(receipt_name, food_item.name);
        if (curr_cost < prev_cost) {
            food_item.raw = receipt_name;
        }
    }

    displayFoodItems(final_food_items);
    queryRecipes(final_food_items);
    final_food_items = [];
}

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