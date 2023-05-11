let myForm = document.querySelector("#my-form");
let emailInput = document.querySelector("#emailAdd");
let passwordInput = document.querySelector("#passwordAdd");

myForm.addEventListener("submit", saveToStorage);

function saveToStorage(e) {
  console.log("Inside frontend");

  e.preventDefault();
  let emailAdd = emailInput.value;
  let passwordAdd = passwordInput.value;

  let obj = { emailAdd, passwordAdd };
  console.log(obj);

  axios
    .post(`http://localhost:8000/user/logIn`, obj)
    .then((response) => {
      console.log(response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.username);
      alert("Successfull");

      ProceedToChat()
      // getAllLoggedUsers()
      

      // window.location.href="../chat/chat.html"
    })
    .catch((error) => {
      document.body.innerHTML =
        document.body.innerHTML + "<h3> Something Went Wrong </h3>";
      console.log(error);
    });

  myForm.reset();
}

async function getAllLoggedUsers() {
  
  try {
    const response = await axios.get(
      `http://localhost:8000/user/allloggedUsers`
    );
    console.log(response.data.activeUsers);

    let activeUsersList = document.querySelector("#active-users-list");
    activeUsersList.innerHTML = "";

    let title = document.createElement("h4");
    title.innerText = "Active Users";
    activeUsersList.appendChild(title);

    response.data.activeUsers.forEach((user) => {
      let listItem = document.createElement("li");
      listItem.className = "form-control";
      listItem.innerText = user;
      activeUsersList.appendChild(listItem);
    });
  } catch (error) {
    document.body.innerHTML =
      document.body.innerHTML + "<h3> Something Went Wrong </h3>";
    console.log(error);
  }
}
window.addEventListener("load",() =>{
    getAllLoggedUsers();
  
})

function ProceedToChat(){
    let chatButton = document.createElement("button");
    chatButton.textContent = "Proceed to Chat";
    chatButton.className = "btn btn-primary";
    chatButton.addEventListener("click", () => {
      window.location.href = "../chat/chat.html";
    });
    myForm.appendChild(chatButton);
  

}