import { conectaApi } from "./conectaApi.js"

const form_register= document.querySelectorAll('.form_register')



async function createUser(evento,typeUser) {
  
    evento.preventDefault()

    const nome_user = document.getElementById(`nome_${typeUser}`).value
    const email_user = document.getElementById(`email_${typeUser}`).value
    const password_user = document.getElementById(`password_${typeUser}`).value


    const response_register = await conectaApi.register_user(nome_user,email_user,password_user,typeUser)

    if (response_register){
        await conectaApi.log_in_user(nome_user,password_user)
        location.href='/'
    }

} 

form_register.forEach((form)=>{
    let typeUser = form.getAttribute('name')
    form.addEventListener('submit',evento => {
        createUser(evento,typeUser)})
})


