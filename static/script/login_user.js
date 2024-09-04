import { conectaApi } from "./conectaApi.js"

const form_register= document.querySelector('.form_register')
async function loginUser(evento) {
    evento.preventDefault()
    const nome_user = document.getElementById("nome_user").value
    const password_user = document.getElementById("password_user").value
    
    await conectaApi.log_in_user(nome_user,password_user)

    location.href='/user-info/'
} 

form_register.addEventListener('submit',evento=>loginUser(evento))

