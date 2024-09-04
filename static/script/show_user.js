import { conectaApi } from "./conectaApi.js"
import { show_products } from "./showProducts.js"


const user_info = document.querySelector(".user_info")
const token = localStorage.getItem("token")
const btn_log_off = document.querySelector('.btn_log-off')
const profile = document.querySelector('.user_all_info')
const user_order = document.querySelector('.user_order')
const create_product = document.querySelector('.create_product')
const send_image = document.querySelector('.send_image')

if(token === null){
    location.href="/login/"
}
async function showUser() {
    const user_data = await conectaApi.log_in_authenticate(token);
    return user_data
   
}

const user_data = await showUser()


if(user_data[0].user_type === "user"){
    user_order.removeAttribute('hidden')
}else{
    create_product.removeAttribute('hidden')
    send_image.removeAttribute('hidden')
}

function show_info(user_data){
        user_info.innerHTML=`
        <div class="user_profile">
                <p class="user_name">Username:${user_data[0].username}</p>
                <p class="user_email">Email:${user_data[0].email}</p>
        </div>
        `
}

async function create_Product_info(){

    user_info.innerHTML = `
    <div>
        <div class="product_info">
            <form class="form_create_user">
                <h3 create_product_title>Create product</h3>
                <div>
                    <input class="input_product_info" id="input_name_product" type="text" placeholder="Escreva o Nome Do Produto" required></input>
                </div>
                <div>            
                    <input class="input_product_info" id="input_price_product" type="text" placeholder="Insira o Preco" required>
                </div>
                <div>
                    <input class="input_product_info" id="input_new_price_product" type="text" placeholder="Insira o novo Preco" value=0>
                </div>
                <div>
                    <input class="input_product_info" id="input_category" type="text" placeholder="Insira a Categoria Do Produto">
                </div>
                <div>
                    <input class="input_product_info" id="input_gender" type="text" placeholder="Insira o Genero do Produto">
                </div>
                <div>
                <textarea name="description" id="input_description_product" placeholder="Insira a Descricao Do Produto" row=5 cols=70></textarea>
                </div>

                <button class="submit_product_info">Enviar</button>
            </form>
        </div>
    </div>
    `
    const form_create_user = document.querySelector('.form_create_user')

    form_create_user.addEventListener('submit',evento =>send_product_info(evento,token))
}

async function image_product() {
    user_info.innerHTML = ''
    const div = document.createElement('div')
    div.className="product_info"

    user_info.appendChild(div)
    div.innerHTML = '<h3>Products</h3>'

    const all_procuts = await conectaApi.findProducts()
    const ul =  document.createElement('ul')
    ul.className = 'list_product'
    
    div.appendChild(ul)

    all_procuts.forEach(product=>{
        ul.innerHTML+=`
            <li class="each_product">
                <p class="each_product_id">ID:${product.id}</p>
                <p>${product.nome}</p>
                <p>
                    <a class="btn_delete">
                        <img alt="delete-product image" src="../static/image/delete.png"/>
                    </a>
                    
                </p>
            </li>
            
        `
    })

    user_info.innerHTML += `
    <div>
        <div class="product_info">
            <form class="form_image_product" enctype="multipart/form-data">
                <div>
                    <input name="id" class="product_id" type="text" placeholder="Digite o ID do Produto">
                </div>
                <label for="image_product">Escolha uma Imagem para o Produto</label>
                <div> 
                    <input type="file" name="file" id="image_product"  accept=".png, .jpg">
                </div>
                <button class="submit_product_image">Enviar</button>
            </form>
        </div>
    </div>
    `
    const btn_delete = document.querySelectorAll('.btn_delete')
    const form_image_product = document.querySelector('.form_image_product')
    const each_product_id = document.querySelectorAll('.each_product_id')
    
    form_image_product.addEventListener('submit',async function (evt){
        
        evt.preventDefault();

        const product_id = document.querySelector('.product_id').value
        
        conectaApi.send_image(product_id,form_image_product,token)

    })

    btn_delete.forEach((element,id)=>element.addEventListener('click',()=>{
        conectaApi.delete_product(each_product_id[id].textContent)
    }))
    
}

send_image.addEventListener('click',image_product)


async function send_product_info(evento,token) {
    evento.preventDefault()

    const name_product = document.getElementById('input_name_product').value
    const input_price_product = parseFloat(document.getElementById('input_price_product').value)
    const input_new_price_product = parseFloat(document.getElementById('input_new_price_product').value)
    const input_description_product= document.getElementById('input_description_product').value
    const input_gender = document.getElementById('input_gender').value
    const input_category = document.getElementById('input_category').value

    const product = await conectaApi.register_product(name_product,input_price_product,input_new_price_product,input_description_product,input_gender,input_category,token)
    
    return product  
}

create_product.addEventListener('click',create_Product_info)

async function show_order(){
    user_info.innerHTML = ""

    const orders = await conectaApi.read_order()
  
    const list_orders = orders.data[0]
    
    list_orders.forEach(order => {
        user_info.innerHTML +=`
       <div class="user_order_product">
           <p class="order_id">id:${order.id}</p>
           <p class="order_name">${order.nome_product}</p>
           <p class="order_price">Price:R$${parseFloat(order.price)}</p>
           <p class="order_size">Size:${order.size}</p>
       </div
   `
    });   
}



profile.addEventListener("click",()=> show_info(user_data))

user_order.addEventListener("click",()=> show_order(user_data[0].order_id))

async function logOff(token) {
   try{
      await conectaApi.log_off_user(token)
      localStorage.removeItem("token")
      alert("successful logoff")
      location.href="/"

   }catch(error){
        alert("something is wrong")
   }
    
}
btn_log_off.addEventListener("click", () => logOff(token))



export const show_user = {
    showUser,
}
