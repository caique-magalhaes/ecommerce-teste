async function findProducts(category) {
    let response = ''
    
    if(category){
        response = await fetch(`http://127.0.0.1:8000/products/?q=${category}`)
    }else{
        response = await fetch("http://127.0.0.1:8000/products/")
    }
    
    const products = await response.json()

    return products.data
}

export async function findSingleProduct(id){
    const response = await fetch(`/product/${id}`)
    const product = await response.json()
    
    return product.data
}

async function register_user(username,email,password,typeUser) {
    const createUser = await fetch(`http://127.0.0.1:8000/registration-${typeUser}`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            username:username,
            email:email,
            password:password
        })
    })

    const response = await createUser.json()
    if(response.error){
        alert("Email ja registrado no Banco")
        return
    }
    return response
    
}

async function register_product(nome,price,new_price,description,gender,category,token) {
    try{
        const create_product = await fetch(`/create-products`,{
            method:"POST",
            headers:{"Authorization": `Bearer ${token}`,
                    "Content-Type":"application/json"},
            body:JSON.stringify({
                nome:nome,
                price:price,
                new_price:new_price,
                description:description,
                gender:gender,
                category:category
            })
        })

        if(create_product.statusText === "Unauthorized"){
            alert("Voce nao deve estar logado ou nao tem permissao de administrador")
        }else{
            const response = await create_product.json();
            alert(`${nome} - Produto foi Criado!!`)
            return response
        }
        
        
    }catch(error){
        alert(`Algo de errado:${error}`)
    }
    
    
}

async function send_image(id,form,token) {
    
    const form_image = new FormData(form)

    try{
        const image_product = await fetch(`/uploadfile/product/${id}`,{
            method:"POST",
            headers:{"Authorization": `Bearer ${token}`},
            body:form_image,
        })

       
        if(image_product.ok){
            alert('Imagem Enviada')
        }
    }catch(error){
        alert(`Algo de errado: ${error}`)
    }
        

    
}

async function log_in_user(username,password) {
    try{
        const userLogin = await fetch("/token",{
            method:"POST",
            body: new URLSearchParams({
                username:username,
                password:password
            }),
            headers:{"Content-Type":"application/x-www-form-urlencoded"},
            
        })
        
        const response = await userLogin.json()
        

        if(userLogin.ok){
            alert("login successful!!")
            localStorage.setItem("token",response.access_token)
            return
            
            
        }else{
            alert(`Algo de errado: ${response.detail}`)
        }
        
    }catch(error){
        alert(`Um erro ocorreu durante o login: ${error}` )
    }
      
}

async function log_in_authenticate(token){
    const logado = await fetch("/user/me",{
        method:"GET",
        headers:{"Authorization": `Bearer ${token}`}
    })
    const response = await logado.json()
    return response
}

async function log_off_user(token){
    try{
        const upload = await fetch('/user-logoff/',{
            method:"PUT",
            headers:{"Authorization": `Bearer ${token}`}
        })

        const response = await upload.json() 
        if(upload.ok){
            return response
        }
    }catch(error){
        alert(error)
    }
}

async function order_product(id,size) {
    
    try{
        console.log(size)
        const order = await fetch(`/order-product/${id}?size=${size}`,{
            method:"POST",
            headers:{
                "Authorization":`Bearer ${localStorage.getItem('token')}`,
                "accept": "application/json",
                },
        })

        if(order.ok){
            alert('Pedido feito com sucesso')
            location.href='/user-checkout/'
            return
        }
        if(order.status === 404){
            alert('Tamanho deve ser selecionado')
        }
        if(order.status === 401){
            alert("Voce Deve Ser Um usuario ou estar logado para Comprar")
        }
        
    }catch(error){
        alert(`something is wrong: ${error}`)
    }
    

}

async function read_order() {
    try{
        const response = await fetch(`/read-order-product/`,{
            method:"GET",
            headers:{"Authorization": `Bearer ${localStorage.getItem('token')}`}
        })

        if(response.ok){
            const orders = await response.json()
            return orders
        }
    }catch(error){
        alert(`Something is wrong: ${error}`)
    }
    
}


async function delete_product(id) {
    try{
        const response = await fetch(`/product/${id}`,{
        method:"DELETE",
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
        })
    
        if (response.ok){
            alert('Produto Deletado com Sucesso')
            location.reload()
        }
    }catch(error){
        alert(`Algo Deu errado: ${error}`)
    }
}

export const conectaApi = {
    findProducts,
    findSingleProduct,
    register_user,
    log_in_user,
    log_in_authenticate,
    log_off_user,
    order_product,
    register_product,
    read_order,
    send_image,
    delete_product,
}

