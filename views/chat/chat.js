let userLogged = document.querySelector("#userLogged");
let currentGroupInfo = document.querySelector("#currentGroupName");
let myForm = document.querySelector("#my-form");
let groupForm = document.querySelector("#groupInfo");
let inviteForm = document.querySelector("#inviteUser");
let message = document.querySelector("#message");
let chatMessage = document.querySelector("#chat-messages");
const signOutButton = document.querySelector("#sign-out-button");
let createGroupName = document.querySelector("#groupName");
let inviteUser = document.querySelector("#userName");
let groupList = document.querySelector("#group-list");
let users = document.querySelector("#user-list");

const token = localStorage.getItem("token");
const name = localStorage.getItem("userName");
const groupName = localStorage.getItem("groupName");
const groupId = localStorage.getItem("groupId");

userLogged.innerHTML = userLogged.innerHTML + `${name}`;

// if (groupName != null) {
//   currentGroupInfo.innerHTML = currentGroupInfo.innerHTML + `${groupName}`;
// } else {
//   currentGroupInfo.innerHTML = "Select a Group";
// }
if (groupName == null) {
  currentGroupInfo.innerHTML = "Select a Group";
}

myForm.addEventListener("submit", saveToStorage);
groupForm.addEventListener("submit", createGroup);
inviteForm.addEventListener("submit", inviteUserToGroup);
users.addEventListener("click", getActiveUsers);

async function saveToStorage(e) {
  e.preventDefault();
  try {
    const userMessage = message.value;
    const groupName = localStorage.getItem("groupName");
    const groupId = localStorage.getItem("groupId");

    const response = await axios.post(
      `http://localhost:8000/user/send-message`,
      { userMessage, groupId },
      { headers: { Authorization: token } }
    );
    console.log("sent message is >>>>", response.data);

    getChatMessages();
  } catch (error) {
    console.log(error);
    document.body.innerHTML =
      document.body.innerHTML + "<h3> Something Went Wrong </h3>";
  }
  myForm.reset();
}
function addChatMessageOnScreen(message) {
  const messageDiv = document.createElement("div");
  messageDiv.className = "form-control mt-1";
  messageDiv.innerHTML = `<b>${message.user.userName} : </b> ${message.chatMessage}`;

  if(chatMessage.children.length % 2 === 0){
    messageDiv.classList.add('bg-light');
  }
  chatMessage.appendChild(messageDiv);
}

async function getChatMessages() {
  try {
    let chatMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    const groupId = JSON.parse(localStorage.getItem("groupId"));

    let lastMessageId;
    if (chatMessages.length > 0) {
      lastMessageId = chatMessages[chatMessages.length - 1].id;
    } else {
      lastMessageId = null;
    }
    const newMessage = await axios.get(
      `http://localhost:8000/user/get-message?lastMessageId=${lastMessageId}&groupId=${groupId}`,
      { headers: { Authorization: token } }
    );
    const newMessages = newMessage.data.userMessage;

    const mergedMessages = [...chatMessages, ...newMessages];

    localStorage.setItem("chatMessages", JSON.stringify(mergedMessages));

    chatMessage.innerHTML = "";

    const filteredMessages = mergedMessages.filter((message) => {
      return message.groupId === groupId;
    });

    switchGroup(groupName, groupId);

    filteredMessages.forEach((message) => {
      addChatMessageOnScreen(message);

      // addChatMessageOnScreen(message.chatMessage);
    });
  } catch (error) {
    console.log(error);
    document.body.innerHTML =
      document.body.innerHTML + "<h3> Something Went Wrong </h3>";
  }
}
window.addEventListener("DOMContentLoaded", () => {
  getChatMessages();
  getGroups();
  switchGroup(groupName, groupId);
  // inviteUserToGroup(e)
});

// setInterval(getChatMessages,1000);

signOutButton.addEventListener("click", () => {
  localStorage.clear();

  window.location.href = "../login/login.html";
});

async function createGroup(e) {
  e.preventDefault();
  try {
    const groupName = createGroupName.value;

    const response = await axios.post(
      `http://localhost:8000/user/createGroup`,
      { groupName },
      { headers: { Authorization: token } }
    );
    addGroupToList(response.data.groupName.groupName);
    localStorage.setItem("groupName", response.data.groupName.groupName);
    localStorage.setItem("groupId", response.data.groupName.id);
  } catch (error) {
    console.log(error);
    document.body.innerHTML = document.body.innerHTML + "Something went wrong";
  }
  groupForm.reset();
}

async function getGroups() {
  try {
    const response = await axios.get(`http://localhost:8000/user/getGroup`, {
      headers: { Authorization: token },
    });
    const groups = response.data.groups;
    groups.forEach((group) => {
      addGroupToList(group);
    });

    const groupName = localStorage.getItem("groupName");
    const groupId = localStorage.getItem("groupId");
    if (groupName && groupId) {
      getChatMessages(groupName, groupId);
      // currentGroupInfo.innerHTML = groupName
      currentGroupInfo.innerHTML = currentGroupInfo.innerHTML + `${groupName}`;
    }
  } catch (error) {
    console.log(error);
    document.body.innerHTML = document.body.innerHTML + "Something went wrong";
  }
}
async function switchGroup(group, groupId) {
  try {
    localStorage.setItem("groupName", group);
    localStorage.setItem("groupId", groupId);

    const response = await axios.get(
      `http://localhost:8000/user/getGroupMessages?groupId=${groupId}`,
      { headers: { Authorization: token } }
    );
    console.log(`Chat of particular ${groupName} group is >>>>>>>`, response);
    const messages = response.data.messages;

    chatMessage.innerHTML = "";

    messages.forEach((message) => {
      addChatMessageOnScreen(message);
    });
  } catch (error) {
    console.log(error);
    document.body.innerHTML = document.body.innerHTML + "Something went wrong";
  }
}

function addGroupToList(group) {
  const groupDiv = document.createElement("div");
  groupDiv.className = "group-list-item";

  groupDiv.innerHTML = `<button class = "btn btn-primary m-1" onclick="switchGroup('${group.groupName}','${group.id}')">${group.groupName}</button>`;
  groupList.appendChild(groupDiv);
}

async function getActiveUsers() {
  try {
    const response = await axios.get(
      `http://localhost:8000/user/getActiveUsers`,
      { headers: { Authorization: token } }
    );
    console.log(response.data.activeUsers);

    // users.innerHTML = "";

    response.data.activeUsers.forEach((user) => {
      let listItem = document.createElement("div");
      listItem.className = "users-list-items";
      listItem.innerHTML = `<button class = "btn btn-primary m-1"><span title="${user.email}">${user.userName}</span></button>`;
      users.appendChild(listItem);
    });
  } catch (error) {
    document.body.innerHTML =
      document.body.innerHTML + "<h3> Something Went Wrong </h3>";
    console.log(error);
  }
}

async function inviteUserToGroup(e) {
  e.preventDefault();
  try {
    const userEmail = inviteUser.value;
    console.log("Invited user email >>>", userEmail);

    const groupId = localStorage.getItem("groupId");

    const response = await axios.post(
      `http://localhost:8000/user/inviteUser`,
      { userEmail, groupId },
      { headers: { Authorization: token } }
    );
    alert("invite succesfull");
    // getChatMessages()

    console.log("invited user info is >>>>>>", response);
  } catch (error) {
    console.log(error);
    document.body.innerHTML = document.body.innerHTML + "Something Went Wrong";
  }
  inviteForm.reset();
}
