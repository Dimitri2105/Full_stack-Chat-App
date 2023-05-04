let userLogged = document.querySelector("#userLogged");
let myForm = document.querySelector("#my-form");
let message = document.querySelector("#message");
let chatMessage = document.querySelector("#chat-messages");

const token = localStorage.getItem("token");
const name = localStorage.getItem("userName");

userLogged.innerHTML = userLogged.innerHTML + `${name}`;

myForm.addEventListener("submit", saveToStorage);

async function saveToStorage(e) {
  e.preventDefault();
  try {
    const userMessage = message.value;
    console.log(userMessage);

    const response = await axios.post(
      `http://localhost:8000/user/send-message`,
      { userMessage },
      { headers: { Authorization: token } }
    );
    console.log(response.data);
    console.log(response.data.chatMessage.chatMessage);
    addChatMessagesOnscreen(response.data.chatMessage.chatMessage);
  } catch (error) {
    console.log(error);
    document.body.innerHTML =
      document.body.innerHTML + "<h3> Something Went Wrong </h3>";
  }
  myForm.reset();
}
async function addChatMessagesOnscreen() {
  try {
    const userMessage = await axios.get(
      `http://localhost:8000/user/send-message`,
      { headers: { Authorization: token } }
    );
    const chatContainer = document.createElement("div");
    chatContainer.className = "chat-container";

    const userAllMessages = userMessage.data.userMessage;

    userAllMessages.forEach((message, index) => {
      const messageDiv = document.createElement('div');
      messageDiv.className = "form-control"
      messageDiv.innerHTML = `<b>${message.user.userName}:</b> ${message.chatMessage}`;
      chatMessage.appendChild(messageDiv);
    });
} catch (error) {
    console.log(error);
    document.body.innerHTML =
      document.body.innerHTML + "<h3> Something Went Wrong </h3>";
  }
}
window.addEventListener('DOMContentLoaded', addChatMessagesOnscreen);