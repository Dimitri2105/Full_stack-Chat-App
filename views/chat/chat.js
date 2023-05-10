let userLogged = document.querySelector("#userLogged");
let myForm = document.querySelector("#my-form");
let message = document.querySelector("#message");
let chatMessage = document.querySelector("#chat-messages");
const signOutButton = document.querySelector('#sign-out-button');


const token = localStorage.getItem("token");
const name = localStorage.getItem("userName");

userLogged.innerHTML = userLogged.innerHTML + `${name}`;

myForm.addEventListener("submit", saveToStorage);

async function saveToStorage(e) {
  e.preventDefault();
  try {
    const userMessage = message.value;

    const response = await axios.post(
      `http://localhost:8000/user/send-message`,
      {userMessage},
      { headers: { Authorization: token } }
    );
    console.log("sent message is >>>>>>" , response.data.chatMessage.chatMessage)
    
    
  
    // addChatMessageOnScreen(response.data.chatMessage.chatMessage);
    getChatMessages()

    // let chatMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];

    // chatMessages.push(response.data.chatMessage);
    // localStorage.setItem("chatMessages", JSON.stringify(chatMessages));
  } catch (error) {
    console.log(error);
    document.body.innerHTML =
      document.body.innerHTML + "<h3> Something Went Wrong </h3>";
  }
  myForm.reset();
}
function addChatMessageOnScreen(message) {
  const messageDiv = document.createElement("div");
  messageDiv.className = "form-control";
  messageDiv.innerHTML = `<b>${name} : </b> ${message}`;
  chatMessage.appendChild(messageDiv);
}

async function getChatMessages() {
  try {
    let chatMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    console.log("local storage messages are >>>>>" , chatMessages)
    let lastMessageId;
    if (chatMessages.length > 0) {
      lastMessageId = chatMessages[chatMessages.length - 1].id;
    } else {
      lastMessageId = null;
    }
    console.log("last message ID" , lastMessageId)
    const newMessage = await axios.get(
      `http://localhost:8000/user/get-message?lastMessageId=${lastMessageId}`,
      { headers: { Authorization: token } }
    );
    const newMessages = newMessage.data.userMessage;
    console.log("new message are >>>" , newMessages)

    const mergedMessages = [...chatMessages, ...newMessages];
    console.log("merged messages are >>>>>" , mergedMessages)
    
    localStorage.setItem("chatMessages", JSON.stringify(mergedMessages));

    chatMessage.innerHTML = "";

    chatMessages.forEach((message) => {
      addChatMessageOnScreen(message.chatMessage)      
    });
  } catch (error) {
    console.log(error);
    document.body.innerHTML =
      document.body.innerHTML + "<h3> Something Went Wrong </h3>";
  }
}
window.addEventListener("DOMContentLoaded", getChatMessages);

// setInterval(getChatMessages,1000);


signOutButton.addEventListener('click' ,() =>{
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
  localStorage.removeItem('chatMessages')

  window.location.href="../login/login.html"

})