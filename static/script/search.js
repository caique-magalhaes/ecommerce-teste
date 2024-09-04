
import { show_products } from "./showProducts.js";
import { conectaApi } from "./conectaApi.js";

const search_header_type = document.querySelector('.search_header_type')
const content_products = document.querySelector('.content_products')

async function getSearch(search){
    content_products.innerHTML = ''
    const response = await conectaApi.findProducts();
    let expression = new RegExp(search,"i")

    if(search.length > 0 ){
        response.forEach(list=>{

            
            
            if(expression.test(list.nome)){
                show_products.constructProducts(list.id, list.product_image, list.nome, list.price, list.new_price); 
            }       
        })   
    }
}

getSearch(search_header_type.textContent)


