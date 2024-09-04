import { show_products} from "./showProducts.js";
const category_header_type = document.querySelector('.category_header_type')
const content_products = document.querySelector('.content_products')

async function show_category (){
    content_products.innerHTML=""
    await show_products.getCategory(category_header_type.textContent)
}


show_category()




