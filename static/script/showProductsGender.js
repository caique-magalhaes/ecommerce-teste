import { show_products } from "./showProducts.js";

const gender_type = document.querySelector('.gender_type')

show_products.getGender(gender_type.textContent)
