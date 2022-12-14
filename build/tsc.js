var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function setupCamera() {
    var _this = this;
    var imageInps = document.querySelectorAll('.camera-inp');
    var loader = document.getElementById('loader');
    var loader_txt = document.getElementById('loader-text');
    var scan_btns = document.querySelectorAll('.scan-btn');
    var loaderProgress = function (status) {
        var percent = Math.floor((status.progress / 1) * 100);
        loader_txt.textContent = nbsp(status.status + "... (".concat(percent, "%)"));
        loader.style.setProperty('--progress', status.progress);
        if (status.status === 'recognizing text' && status.progress === 1) {
            loader.classList.add('fade-out');
            setTimeout(function () {
                for (var i = 0; i < scan_btns.length; i++) {
                    scan_btns[i].classList.remove('hidden');
                }
                loader.classList.add('hidden');
                loader.classList.remove('fade-out');
            }, 5000);
        }
    };
    var on_click = function (event) { return __awaiter(_this, void 0, void 0, function () {
        var i, y, files, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    for (i = 0; i < scan_btns.length; i++) {
                        scan_btns[i].classList.add('hidden');
                    }
                    loader.classList.remove('hidden');
                    y = document.getElementById('icons').getBoundingClientRect().top + window.pageYOffset + -35;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                    files = event.target.files;
                    if (!(files.length > 0)) return [3, 2];
                    return [4, parseReceipt(files[0], loaderProgress)];
                case 1:
                    data = _a.sent();
                    parse_data(data.text);
                    _a.label = 2;
                case 2: return [2];
            }
        });
    }); };
    for (var i = 0; i < imageInps.length; i++) {
        imageInps[i].addEventListener('change', on_click);
    }
    return null;
}
window.addEventListener('load', init);
function init() {
    var examples = [
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
    var show_more_btn = document.getElementById('show-more-btn');
    var show_more_section = document.querySelectorAll('.show-more-section');
    var demo = document.getElementById('demo');
    show_more_btn.addEventListener('click', function () {
        demo.classList.toggle('shown');
        if (show_more_btn.textContent == "See More") {
            show_more_btn.textContent = "Go Back";
        }
        else {
            show_more_btn.textContent = "See More";
        }
        for (var i = 0; i < show_more_section.length; i++) {
            show_more_section[i].classList.toggle('shown');
        }
    });
}
function displayRecipes(recipe_items, message) {
    if (message === void 0) { message = "Your Recipes"; }
    var container = document.getElementById('recipes');
    var template = document.getElementById('recipe-template');
    container.innerHTML = "";
    container.appendChild(template);
    var MAX_RECIPES = 8;
    var _loop_1 = function (i) {
        var item = recipe_items[i];
        var node = template.cloneNode(true);
        node.classList.remove('hidden');
        node.id = "";
        node.querySelector('h2.recipe-name').textContent = item.title;
        node.querySelector('span').textContent = nbsp(" (") + item.time + " mins)";
        node.querySelector('.recipe-img').setAttribute('src', item.img);
        node.querySelector('.recipe-url').setAttribute('href', item.url);
        node.addEventListener('click', function () {
            window.open(item.url, '_blank');
        });
        var MAX_INGREDIENTS = 10;
        var utilized = "Includes ";
        for (var j = 0; j < Math.min(MAX_INGREDIENTS, item.utilized.length); j++) {
            if (item.utilized[j]) {
                utilized += item.utilized[j].toLowerCase() + ", ";
            }
        }
        utilized.slice(0, -2);
        utilized += "...";
        node.querySelector('p').textContent = utilized;
        container.insertBefore(node, template);
    };
    for (var i = 0; i < Math.min(MAX_RECIPES, recipe_items.length); i++) {
        _loop_1(i);
    }
    var text = document.createElement('h2');
    text.innerText = message;
    text.style.textAlign = "center";
    container.insertBefore(text, container.firstChild);
    container.classList.remove('hidden');
}
function displayFoodItems(food_items, message) {
    if (message === void 0) { message = "Your Data"; }
    var container = document.getElementById('visualizer');
    var template = document.getElementById('food-item-template');
    container.innerHTML = "";
    container.appendChild(template);
    for (var i = 0; i < food_items.length; i++) {
        var item = food_items[i];
        var node = template.cloneNode(true);
        node.classList.remove('hidden');
        node.id = "";
        node.querySelector('h2').textContent = item.name;
        node.querySelector('h3').textContent = '(' + item.raw.toUpperCase() + ')';
        if (item.group) {
            node.classList.add(item.group);
        }
        var has_double = false;
        addDuration(node, "pantry", item.pantry);
        has_double = addDuration(node, "on_open_pantry", item.on_open_pantry);
        addDuration(node, "fridge", item.fridge);
        has_double = addDuration(node, "on_open_fridge", item.on_open_fridge) || has_double;
        addDuration(node, "freezer", item.freezer);
        if (has_double) {
            node.querySelector('.food-duration-container').classList.add('double-len');
        }
        container.insertBefore(node, template);
    }
    if (food_items.length === 0) {
        message = "Bad read. No data to display.";
    }
    var text = document.createElement('h2');
    text.innerText = message;
    text.style.textAlign = "center";
    container.insertBefore(text, container.firstChild);
}
function queryRecipes(food_items) {
    if (food_items.length == 0) {
        return;
    }
    var food_item1 = null;
    var min_days_left = Number.MAX_SAFE_INTEGER;
    for (var _i = 0, food_items_1 = food_items; _i < food_items_1.length; _i++) {
        var food_item = food_items_1[_i];
        if (food_item.days_left < min_days_left) {
            food_item1 = food_item;
            min_days_left = food_item.days_left;
        }
    }
    var food_item2 = null;
    min_days_left = Number.MAX_SAFE_INTEGER;
    for (var _a = 0, food_items_2 = food_items; _a < food_items_2.length; _a++) {
        var food_item = food_items_2[_a];
        if (food_item.group != food_item1.group && food_item.days_left < min_days_left) {
            food_item2 = food_item;
            min_days_left = food_item.days_left;
        }
    }
    var food_names = [food_item1.name];
    if (food_item2) {
        food_names.push(food_item2.name);
    }
    fetch('https://api.edamam.com/search?q=' + food_names.join('+') + '&app_id=95184d17&app_key=0f50ed3c9420a4de48414fe67d08b4bc')
        .then(function (response) { return response.json(); })
        .then(function (response) { return processRecipes(JSON.parse(JSON.stringify(response.hits))); });
}
function processRecipes(recipe_objs) {
    var recipes = [];
    for (var _i = 0, recipe_objs_1 = recipe_objs; _i < recipe_objs_1.length; _i++) {
        var recipe_obj = recipe_objs_1[_i];
        var recipe = recipe_obj.recipe;
        var ingredients = [];
        for (var i = 0; i < recipe.ingredients.length; i++) {
            ingredients.push(recipe.ingredients[i].food);
        }
        var recipe_item = {
            title: recipe.label,
            utilized: ingredients,
            img: recipe.image,
            time: Math.max(recipe.totalTime, 10),
            url: recipe.url
        };
        recipes.push(recipe_item);
    }
    displayRecipes(recipes);
}
function addDuration(node, type, duration) {
    var indicator = node.querySelector("." + type);
    if (duration) {
        var length_1 = (Math.pow(duration, 0.5)).toString();
        indicator.style.setProperty('--length', length_1);
        var raw_text = (duration > 1) ? duration.toString() + ' days' : duration.toString() + ' day';
        var display_duration = nbsp(quoted(raw_text));
        indicator.style.setProperty('--days', display_duration);
        if (duration < 7) {
            indicator.classList.add('short-duration');
        }
        return true;
    }
    else {
        node.querySelector('.food-duration-container').removeChild(indicator);
        return false;
    }
}
function nbsp(string) {
    return string.replace(/ /g, '\u00a0');
}
function quoted(string) {
    return '"' + string + '"';
}
var keywords_to_food_items = [];
var final_food_items = [];
function parse_data(raw_receipt) {
    keywords_to_food_items = [];
    final_food_items = [];
    console.log(raw_receipt);
    fetch('data/foodkeeper.json', { mode: 'no-cors' })
        .then(function (response) { return response.json(); })
        .then(function (food_data) { return process_food_data(JSON.parse(JSON.stringify(food_data)), raw_receipt); });
}
function get_days(max_time, metric) {
    if (JSON.stringify(metric).includes("Day")) {
        return max_time;
    }
    else if (JSON.stringify(metric).includes("Week")) {
        return max_time * 7;
    }
    else if (JSON.stringify(metric).includes("Month")) {
        return max_time * 30;
    }
    else if (JSON.stringify(metric).includes("Year")) {
        return max_time * 365;
    }
    else if (JSON.stringify(metric).includes("Hour")) {
        return 1;
    }
    else {
        console.log("this should never be called! metric: " + metric);
    }
}
function get_category(category_id_object) {
    var category_id = category_id_object["Category_ID"];
    if ((category_id >= 10 && category_id <= 17) || (category_id >= 20 && category_id <= 22)) {
        return "meat";
    }
    else if (category_id == 19 || category_id == 24) {
        return "vegetable";
    }
    else if (category_id == 19) {
        return "fruit";
    }
    else if ((category_id >= 2 && category_id <= 4) || category_id == 9) {
        return "grains";
    }
    else if (category_id == 7) {
        return "dairy";
    }
    else {
        return "default";
    }
}
function process_food_data(food_data, raw_receipt) {
    for (var _i = 0, _a = food_data.sheets[2].data; _i < _a.length; _i++) {
        var food_entry = _a[_i];
        var food_name = food_entry[2]["Name"];
        var food_item = { name: food_name, raw: "" };
        var food_category = get_category(food_entry[1]);
        if (food_category != "default") {
            food_item.group = food_category;
        }
        food_item.days_left = 0;
        if (food_entry[6] && !JSON.stringify(food_entry[6]).includes(null)) {
            var num_days = get_days(food_entry[6]["Pantry_Max"], food_entry[7]);
            food_item.pantry = num_days;
            food_item.days_left += num_days;
        }
        else if (food_entry[10] && !JSON.stringify(food_entry[10]).includes(null)) {
            var num_days = get_days(food_entry[10]["DOP_Pantry_Max"], food_entry[11]);
            food_item.pantry = num_days;
            food_item.days_left += num_days;
        }
        if (food_entry[14] && !JSON.stringify(food_entry[14]).includes(null)) {
            var num_days = get_days(food_entry[14]["Pantry_After_Opening_Max"], food_entry[15]);
            food_item.on_open_pantry = num_days;
            food_item.days_left += num_days;
        }
        if (food_entry[17] && !JSON.stringify(food_entry[17]).includes(null)) {
            var num_days = get_days(food_entry[17]["Refrigerate_Max"], food_entry[18]);
            food_item.fridge = num_days;
            food_item.days_left += num_days;
        }
        else if (food_entry[21] && !JSON.stringify(food_entry[21]).includes(null)) {
            var num_days = get_days(food_entry[21]["DOP_Refrigerate_Max"], food_entry[22]);
            food_item.fridge = num_days;
            food_item.days_left += num_days;
        }
        if (food_entry[25] && !JSON.stringify(food_entry[25]).includes(null)) {
            var num_days = get_days(food_entry[25]["Refrigerate_After_Opening_Max"], food_entry[26]);
            food_item.on_open_fridge = num_days;
            food_item.days_left += num_days;
        }
        if (food_entry[31] && !JSON.stringify(food_entry[31]).includes(null)) {
            var num_days = get_days(food_entry[31]["Freeze_Max"], food_entry[32]);
            food_item.freezer = num_days;
            food_item.days_left += num_days;
        }
        else if (food_entry[35] && !JSON.stringify(food_entry[35]).includes(null)) {
            var num_days = get_days(food_entry[35]["DOP_Freeze_Max"], food_entry[36]);
            food_item.freezer = num_days;
            food_item.days_left += num_days;
        }
        if (!food_item.pantry && !food_item.fridge && !food_item.freezer &&
            !food_item.on_open_pantry && !food_item.on_open_fridge) {
            continue;
        }
        var keywords_string = food_entry[4]["Keywords"];
        if (!keywords_string || keywords_string == '') {
            keywords_to_food_items.push([[food_name.toLowerCase()], food_item]);
        }
        else {
            keywords_string = keywords_string.split(' ').join('');
            var keywords = keywords_string.split(',');
            var filtered_keywords = [];
            for (var _b = 0, keywords_1 = keywords; _b < keywords_1.length; _b++) {
                var keyword = keywords_1[_b];
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
function reconstruction_cost(receipt_name, keyword) {
    var dp = [];
    for (var i = 0; i < receipt_name.length + 1; i++) {
        dp.push(new Array(keyword.length + 1).fill(0));
    }
    for (var i = 0; i < receipt_name.length + 1; i++) {
        for (var j = 0; j < keyword.length + 1; j++) {
            if (i == 0) {
                dp[i][j] = INSERTION_COST * j;
            }
            else if (j == 0) {
                dp[i][j] = DELETION_COST * i;
            }
            else if (receipt_name.charAt(i - 1) == keyword.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            }
            else {
                dp[i][j] = Math.min(INSERTION_COST + dp[i][j - 1], DELETION_COST + dp[i - 1][j], INSERTION_COST + DELETION_COST + dp[i - 1][j - 1]);
            }
        }
    }
    return dp[receipt_name.length][keyword.length];
}
var NAME_CONSIDERATION = 0.1;
function search(receipt_name) {
    var min_cost = Number.MAX_SAFE_INTEGER;
    var closest_food_item = null;
    var receipt_words = receipt_name.split(' ');
    var receipt_word_count = receipt_words.length;
    for (var _i = 0, keywords_to_food_items_1 = keywords_to_food_items; _i < keywords_to_food_items_1.length; _i++) {
        var _a = keywords_to_food_items_1[_i], keywords = _a[0], food_item = _a[1];
        var total_over_words = 0;
        for (var _b = 0, receipt_words_1 = receipt_words; _b < receipt_words_1.length; _b++) {
            var receipt_word = receipt_words_1[_b];
            var keyword_min_cost = Number.MAX_SAFE_INTEGER;
            for (var _c = 0, keywords_2 = keywords; _c < keywords_2.length; _c++) {
                var keyword = keywords_2[_c];
                var cost = reconstruction_cost(receipt_word, keyword);
                if (cost < keyword_min_cost) {
                    keyword_min_cost = cost;
                }
            }
            total_over_words += keyword_min_cost;
        }
        var curr_avg_cost = total_over_words / receipt_word_count;
        var name_cost = reconstruction_cost(receipt_name, food_item.name);
        var true_cost = (NAME_CONSIDERATION * name_cost + (1 - NAME_CONSIDERATION) * curr_avg_cost) / receipt_name.length;
        if (true_cost < min_cost) {
            closest_food_item = food_item;
            min_cost = true_cost;
        }
    }
    return [closest_food_item, min_cost];
}
function is_letter(char) {
    return char.toLowerCase() != char.toUpperCase();
}
function is_number(char) {
    return !isNaN(parseInt(char, 10));
}
var MAX_COST = 1;
function process_receipt(receipt) {
    var receipt_lines = receipt.toLowerCase().split('\n');
    var receipt_names = [];
    for (var _i = 0, receipt_lines_1 = receipt_lines; _i < receipt_lines_1.length; _i++) {
        var receipt_line = receipt_lines_1[_i];
        if (receipt_line.includes("total")) {
            break;
        }
        var re = new RegExp("(^.*[0-9]{1,2}[.][0-9]{2}|^.*[0-9]{1,2}[\s][0-9]{2})");
        if (re.test(receipt_line)) {
            var re_money = new RegExp("[0-9]{1,2}[.][0-9]{2}");
            var re_result = re_money.exec(receipt_line);
            receipt_line = receipt_line.slice(0, re_result.index);
            receipt_line = receipt_line.replace(/[^a-zA-Z, \s]/g, '');
            receipt_line = receipt_line.replace(/(\s.\s|\s.$|^.\s)/g, '');
            if (receipt_line == '') {
                continue;
            }
            receipt_names.push(receipt_line.trim());
        }
    }
    console.log(receipt_names);
    for (var _a = 0, receipt_names_1 = receipt_names; _a < receipt_names_1.length; _a++) {
        var receipt_name = receipt_names_1[_a];
        var _b = search(receipt_name), food_item = _b[0], cost = _b[1];
        if (cost > MAX_COST) {
            continue;
        }
        if (food_item.raw == "") {
            food_item.raw = receipt_name;
            final_food_items.push(food_item);
        }
        var prev_cost = reconstruction_cost(food_item.raw, food_item.name);
        var curr_cost = reconstruction_cost(receipt_name, food_item.name);
        if (curr_cost < prev_cost) {
            food_item.raw = receipt_name;
        }
    }
    displayFoodItems(final_food_items);
    queryRecipes(final_food_items);
    final_food_items = [];
}
var debugImages = false;
function visImageCan(image) {
    return __awaiter(this, void 0, void 0, function () {
        var can, context, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!debugImages) return [3, 2];
                    can = document.createElement('canvas');
                    can.width = 600;
                    can.height = image.height * can.width / image.width;
                    context = can.getContext('2d');
                    _b = (_a = context).drawImage;
                    return [4, createImageBitmap(image)];
                case 1:
                    _b.apply(_a, [_c.sent(), 0, 0, can.width, can.height]);
                    document.body.appendChild(can);
                    _c.label = 2;
                case 2: return [2];
            }
        });
    });
}
function loadAndProcessImageCanvas(img_element) {
    return __awaiter(this, void 0, void 0, function () {
        var debugImage, debugImage2, debug, imageBitmap, width, height, canvas, context, tmp, image, i, average, scale, tmpBitmap, radius, x, y, blurred, maskimage, i, thresh, val, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    debugImage = document.getElementById('debug-img');
                    debugImage2 = document.getElementById('debug-img2');
                    debug = document.getElementById('loader');
                    return [4, createImageBitmap(img_element)];
                case 1:
                    imageBitmap = _a.sent();
                    width = imageBitmap.width;
                    height = imageBitmap.height;
                    if (width > 3000 || height > 3000) {
                        width = Math.floor(width * 0.75);
                        height = Math.floor(height * 0.75);
                    }
                    canvas = document.createElement('canvas');
                    context = canvas.getContext('2d');
                    if (['iPad', 'iPhone', 'iPod'].includes(navigator.platform)) {
                        tmp = width;
                        width = height;
                        height = tmp;
                        canvas.width = width;
                        canvas.height = height;
                        context.save();
                        context.translate(width / 2, height / 2);
                        context.rotate(90 * Math.PI / 180);
                        context.drawImage(imageBitmap, -height / 2, -width / 2, height, width);
                        context.restore();
                    }
                    else {
                        canvas.width = width;
                        canvas.height = height;
                        context.drawImage(imageBitmap, 0, 0);
                    }
                    delete imageBitmap;
                    image = context.getImageData(0, 0, width, height);
                    for (i = 0; i < width * height; i++) {
                        average = (image.data[i * 4 + 0] + image.data[i * 4 + 1] + image.data[i * 4 + 2]) / 3;
                        image.data[i * 4 + 0] = average;
                        image.data[i * 4 + 1] = average;
                        image.data[i * 4 + 2] = average;
                        image.data[i * 4 + 3] = 255;
                    }
                    visImageCan(image);
                    scale = 64;
                    return [4, createImageBitmap(image)];
                case 2:
                    tmpBitmap = _a.sent();
                    context.imageSmoothingEnabled = true;
                    context.imageSmoothingQuality = "high";
                    context.drawImage(tmpBitmap, 0, 0, width / scale, height / scale);
                    delete tmpBitmap;
                    return [4, createImageBitmap(context.getImageData(0, 0, width / scale, height / scale))];
                case 3:
                    tmpBitmap = _a.sent();
                    radius = 1;
                    context.globalCompositeOperation = 'lighten';
                    for (x = -radius; x <= radius; x++) {
                        for (y = -radius; y <= radius; y++) {
                            context.drawImage(tmpBitmap, x, y);
                        }
                    }
                    context.globalCompositeOperation = 'source-over';
                    delete tmpBitmap;
                    return [4, createImageBitmap(context.getImageData(0, 0, width / scale, height / scale))];
                case 4:
                    tmpBitmap = _a.sent();
                    context.drawImage(tmpBitmap, 0, 0, width, height);
                    delete tmpBitmap;
                    blurred = context.getImageData(0, 0, width, height);
                    visImageCan(blurred);
                    maskimage = new ImageData(width, height);
                    for (i = 0; i < width * height; i++) {
                        thresh = blurred.data[i * 4] - 50;
                        val = 255 * (thresh < image.data[i * 4]);
                        maskimage.data[i * 4 + 0] = val;
                        maskimage.data[i * 4 + 1] = val;
                        maskimage.data[i * 4 + 2] = val;
                        maskimage.data[i * 4 + 3] = 255;
                    }
                    visImageCan(maskimage);
                    return [4, createImageBitmap(maskimage)];
                case 5:
                    tmpBitmap = _a.sent();
                    delete maskimage;
                    context.drawImage(tmpBitmap, 0, 0);
                    delete tmpBitmap;
                    data = canvas.toDataURL('image/png');
                    delete context;
                    delete canvas;
                    return [2, data];
            }
        });
    });
}
function parseReceipt(img_element, logger) {
    return __awaiter(this, void 0, void 0, function () {
        var dataurl, worker, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, loadAndProcessImageCanvas(img_element)];
                case 1:
                    dataurl = _a.sent();
                    worker = Tesseract.createWorker({
                        logger: logger
                    });
                    return [4, worker.load()];
                case 2:
                    _a.sent();
                    return [4, worker.loadLanguage('eng')];
                case 3:
                    _a.sent();
                    return [4, worker.initialize('eng')];
                case 4:
                    _a.sent();
                    return [4, worker.recognize(dataurl)];
                case 5:
                    data = _a.sent();
                    return [4, worker.terminate()];
                case 6:
                    _a.sent();
                    return [2, data.data];
            }
        });
    });
}
//# sourceMappingURL=tsc.js.map