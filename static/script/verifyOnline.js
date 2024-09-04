import { conectaApi } from "./conectaApi.js"


const account_image = document.querySelector('.account_image')
const header_myaccount = document.querySelector('.header_myaccount')
const login_text = document.querySelector('.header_login')

const token = localStorage.getItem('token')


if(token){
   async function verifyOnline(token){
      const response = await conectaApi.log_in_authenticate(token)
      
      if(response[0].log_in === true){
          header_myaccount.removeAttribute("hidden")
          account_image.removeAttribute('hidden')
          login_text.style.display = "none"
          
      }
   }

   verifyOnline(token)
}

 header_myaccount.addEventListener("click",()=>{
    location.href='/user-info/'
 })
 account_image.addEventListener('click',()=>{
    location.href = '/user-info/'
 })
 