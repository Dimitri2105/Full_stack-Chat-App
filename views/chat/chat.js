
let userLogged = document.querySelector('#userLogged')

const token = localStorage.getItem('token');
const name  = localStorage.getItem('userName')

userLogged.innerHTML = userLogged.innerHTML + `${name}`
