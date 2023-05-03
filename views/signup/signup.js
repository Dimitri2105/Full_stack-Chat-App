let myForm = document.querySelector('#my-form')
let userInput = document.querySelector('#user')
let emailInput = document.querySelector('#emailAdd')
let phoneNumberInput = document.querySelector('#phoneNumberAdd')
let passwordInput = document.querySelector('#passwordAdd')

myForm.addEventListener("submit",saveToStorage)

function saveToStorage(e) {
    e.preventDefault();
    let userAdd = userInput.value;
    let emailAdd = emailInput.value;
    let phonenumberAdd = phoneNumberInput.value
    let passwordAdd = passwordInput.value;

    let obj = {userAdd,emailAdd,passwordAdd,phonenumberAdd}
    console.log(obj)

    axios
    .post(`http://localhost:8000/user/signup`, obj)
    .then(response =>{
        console.log(response.data)
        if (response.data.message === 'User already exists') {
            window.alert('User already exists, Please Login');
        } else {
            window.alert('Successfully signed up');
        }
        
    })
    .catch((error) => {
        document.body.innerHTML =
          document.body.innerHTML + "<h3> Something Went Wrong </h3>";
        console.log(error);
      })

    myForm.reset()

}