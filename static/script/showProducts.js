import {conectaApi} from "./conectaApi.js";

const content_products = document.querySelector('.content_products')
const product_id = document.querySelector('.product_id')
const content_single_product = document.querySelector('.content_single_product')
const gender_title = document.querySelector('.gender_title')
const content_gender = document.querySelector('.content_gender')
const gender_female = document.querySelector('.gender_female')
const gender_male = document.querySelector('.gender_male')
const show_category =  document.querySelector('.show_category')
const category_title = document.querySelector('.category_title')
const product_description = document.querySelector('.products_description')
const category_header_type = document.querySelector('.category_header_type')
const footer_category_div = document.querySelector('.footer_category')
const btn_search_icon = document.querySelector('.btn_search_icon')
const input_search = document.querySelector('.input_search')
const search_header_type = document.querySelector('.search_header_type')



btn_search_icon.addEventListener('click', ()=>{
    if (input_search.value === ''){
        location.href=`/products-page/`
    }else{
        location.href = `/search-products/${input_search.value}`
    }
    
})


function constructProducts(id,image,nome,price,new_price){

    const product = document.createElement('li')
    product.className="product_item"

    const product_detail = document.createElement('div')
    product_detail.className = "product_detail"
   
    if(new_price == 0){
        product_detail.innerHTML = `
        <div class="product_detail"> 
            <h3><a href="/product-page/${id}">${nome}</a></h3>
            <p>R$${parseFloat(price)}</p>
        </div>
    `
    }else{
        product_detail.innerHTML=`
        <h3><a href="/product-page/${id}">${nome}</a></h3>
        <p><strike>R$${parseFloat(price)}</strike>&nbsp<b>R$${parseFloat(new_price)}</b></p>
        `
    }
    
    product.innerHTML = `
        <span hidden>id:${id}</span>
        <div>
            <a href="/product-page/${id}"><img class="products_image" src="../static/image/${image}" alt="Imagem do Produto"></a>
        </div>
    `

    product.appendChild(product_detail)
    
    content_products.appendChild(product)
}

async function constructSingleProduct(id,image,nome,price,new_price,description,discount){
    const product = document.createElement('div')
    product.className="single_product_item"
    product.innerHTML = `
        <span hidden>id:${id}</span>
        <div><img class="single_products_image" src="../static/image/${image}" alt="Imagem do Produto"></div>
        <div class="content_single-product">
            <h3 class="products_title">${nome}</h3>
            <div class="product_prices">
                <p class="single_product_price">R$${parseFloat(price)}</p>
            </div>
            <div class="content_info_single_product">
                <p class="size_products">SIZE</p>
                
                <label class="size_radio_product">
                    <input class="input_size" type="radio" name="size_radio_product">
                    <span class="size_product_name">P<span>
                </label>
                 <label class="size_radio_product">
                    <input class="input_size" type="radio" name="size_radio_product">
                    <span class="size_product_name">M<span>
                </label>
                 <label class="size_radio_product">
                    <input class="input_size" type="radio" name="size_radio_product">
                    <span class="size_product_name">G<span>
                </label>
                <button class="btn_product-comprar">Comprar</button>
            </div>
        </div>
    `
    content_single_product.appendChild(product)
    product_description.innerHTML = description

    const product_prices = document.querySelector('.product_prices')
    if(new_price != 0){
        product_prices.innerHTML = `
        <p class="single_product_price"><strike>R$${parseFloat(price)}</strike></p>
        <p class="single_product_new_price">R$${parseFloat(new_price)}
        <span class="products_discount">-%${discount}</span></p>
        `
    }
    

    const btn_product_comprar = document.querySelector('.btn_product-comprar')
    const input_size =  document.querySelectorAll('.input_size')
    const size_product_name = document.querySelectorAll('.size_product_name')
    let size = null

    input_size.forEach((element,i) => {
            element.addEventListener('input',()=>{
                size = size_product_name[i].textContent
            })
    })

    btn_product_comprar.addEventListener('click',async function(){
        await conectaApi.order_product(parseInt(product_id.textContent),size)
        
    })
}

async function showProducts(){
    try{
        if(product_id){
            const singleProduct = await conectaApi.findSingleProduct(product_id.textContent)
            constructSingleProduct(singleProduct.id,singleProduct.product_image,singleProduct.nome,singleProduct.price,singleProduct.new_price,singleProduct.description,singleProduct.percentage_discount)
        
        }else{

            const listProducts = await conectaApi.findProducts()
            const list = listProducts

            list.forEach(element => {
                constructProducts(element.id,element.product_image,element.nome,element.price,element.new_price,element.description,element.percentage_discount)
            });
        }
        
    }catch(erro){
        content_products.innerHTML=`Something is wrong: ${erro}`
    }
}

if(gender_female && gender_male){
    gender_female.addEventListener('click',() => getGender(gender_female.textContent))
    gender_male.addEventListener('click',()=>getGender(gender_male.textContent))
}


if (category_title){
    category_title.addEventListener('click',async function(){
        if(show_category.getAttribute('hidden')=== null){
            show_category.setAttribute('hidden',true)
        }else{
            
            show_category.removeAttribute('hidden')
        }
        
        await constructionCategory();
    
        const category_type = document.querySelectorAll('.category_type')


        category_type.forEach(element=>{
            element.addEventListener('click', async function(){
                await getCategory(element.textContent)
            })
        })
    })
}





if(gender_title){
    gender_title.addEventListener('click',()=>{
        
        if(content_gender.getAttribute('hidden')=== null){
            content_gender.setAttribute('hidden',true)
        }else{
            
            content_gender.removeAttribute('hidden')
        }
        
    })
}


if(!category_header_type && !search_header_type){
    showProducts()
}

async function list_category(){
    const listProducts = await conectaApi.findProducts();
    return await listProducts
}


async function constructionCategory() {
    show_category.innerHTML = '';
    const list = []
    list.push(await list_category())

    console.log(list[0][0])

    let list_category_html = [];

    list[0].forEach((element) => {
        if (!list_category_html.includes(element.category)) {
            list_category_html.push(element.category);

            const li = document.createElement('li');
            li.className = 'category_product';
            const a = document.createElement('a');
            a.className = 'category_type';
            a.innerHTML = element.category;
            li.appendChild(a);

            show_category.appendChild(li);

        }

    });

}

async function buildCategoryFooter() {
    
    const list = []
    list.push( await list_category())

    let list_category_html = [];

    list[0].forEach((element) => {
        if (!list_category_html.includes(element.category)) {
            list_category_html.push(element.category);

            const a = document.createElement('a');
            a.className = 'category_foot';
            a.innerHTML = element.category;

            footer_category_div.appendChild(a);

        }

    });
    const category_foot = document.querySelectorAll('.category_foot')
    category_foot.forEach(category=>{
        category.addEventListener('click',()=>{
            location.href=`/category/${category.textContent}`
        })
    })

   
}

async function getGender(gender) {
    const listProducts = await conectaApi.findProducts();
    const list = await listProducts;
    content_products.innerHTML = '';

    list.forEach(element => {
        if (element.gender === `${gender}`) {
            console.log(element.gender)
            constructProducts(element.id, element.product_image, element.nome, element.price, element.new_price, element.description, element.percentage_discount);
        }

    });
}

async function getCategory(category) {
    const listProducts = await conectaApi.findProducts(category);
    const list = listProducts;
    content_products.innerHTML = '';

    list.forEach(element => {
        constructProducts(element.id, element.product_image, element.nome, element.price, element.new_price, element.description, element.percentage_discount);
    });



}

buildCategoryFooter()


export const show_products = {
    constructProducts,
    getGender,
    getCategory,
    buildCategoryFooter
}