//display different panels by clicking different buttons
function showMembers(){
    groupMem();
    let panel = document.getElementById("panel_member");
    panel.style.visibility="visible";
}

function showPanelNewRoom(){
    let panel = document.getElementById("panel_newroom");
    panel.style.visibility="visible";
}

function showLogin() {
    let panel = document.getElementById("panel_login");
    panel.style.visibility="visible";
}

function showRegister() {
    let panel = document.getElementById("panel_register");
    panel.style.visibility="visible";
}

function showPanelAllRooms() {
    roomList();
    let panel = document.getElementById("panel_allrooms");
    panel.style.visibility="visible";
}

//close all panels
function closePanel() {
    let panel = document.getElementById("panel_member");
    panel.style.visibility="hidden";
    panel = document.getElementById("panel_newroom");
    panel.style.visibility="hidden";
    panel = document.getElementById("panel_login");
    panel.style.visibility="hidden";
    panel = document.getElementById("panel_register");
    panel.style.visibility="hidden";
    panel = document.getElementById("panel_allrooms");
    panel.style.visibility="hidden";
}

//login
function login() {

    let login_username = document.getElementById("login_username").value;
    let login_password = document.getElementById("login_password").value;

    let login = document.getElementById("login");
    login.style.display="none";
    let register = document.getElementById("register");
    register.style.display="none";
    let logout = document.getElementById("logout");
    logout.style.display="list-item";
    closePanel();
}

//logout
function logout() {
    let logout = document.getElementById("logout");
    logout.style.display="none";
    let login = document.getElementById("login");
    login.style.display="list-item";
    let register = document.getElementById("register");
    register.style.display="list-item";
}

//sign up
function signup() {

    closePanel();
}

//group members
function groupMem(){
    let list_user = document.getElementById("list-user");
    list_user.innerHTML = "            <div class=\"form-group\">" +
        "                <label>User1</label>" +
        "                <button class=\"btn btn-outline-danger\" type=\"button\">Remove</button>" +
        "                <button class=\"btn btn-outline-secondary\" type=\"button\">Ban</button>" +
        "            </div>";
    for(let i =0;i<5;i++){
        list_user.innerHTML +="            <div class=\"form-group\">" +
            "                <label>User"+i+"</label>" +
            "                <button class=\"btn btn-outline-danger\" type=\"button\">Remove</button>" +
            "                <button class=\"btn btn-outline-secondary\" type=\"button\">Ban</button>" +
            "            </div>";
    }
}

//room list
function roomList() {
    let list_room = document.getElementById("room-list");
    list_room.innerHTML = "            <div class=\"form-group\">" +
        "                <label>Room Name</label>" +
        "                <label>Creater: user1</label>" +
        "                <button class=\"btn btn-outline-primary\" type=\"button\" onclick=\"enterRoom(0)\">Enter</button>" +
        "            </div>";
    for(let i =1;i<3;i++){
        list_room.innerHTML +="            <div class=\"form-group\">" +
            "                <label>Room Name"+i+"</label>" +
            "                <label>Creater: user1</label>" +
            "                <button class=\"btn btn-outline-primary\" type=\"button\" onclick=\"enterRoom("+i+")\">Enter</button>" +
            "            </div>";
    }
}

//create new chat room
function newRoom() {
    let newRoomName = document.getElementById("newRoomName").value;
    const regex = /^[\sa-zA-Z0-9,.:;"?!@#$%^&*()_+<>]+$/g;
    if(!newRoomName.match(regex)){
        document.getElementById("wrong-input-roomName").style.visibility = "visible";
        return;
    }

    if(document.getElementById("private").checked) {

    }
    else{

    }
    closePanel();

}

//enter a room
function enterRoom(id) {
    let curRoomName = document.getElementById("cur_roomName");
    curRoomName.textContent = "wooo";

    let chat_content = document.getElementById("chat_content");
    chat_content.innerHTML = "";

    let input = document.getElementById("message");
    input.value="";

    currentRoom = parseInt(id);
    closePanel();
}

//send message
function sendMsg() {
    let input = document.getElementById("message");
    let message = input.value;

    let select = document.getElementById("inputGroupSelect01").value;

    socketio.emit("message_to_server", {message:message,room:currentRoom});

    input.value="";
}

let currentRoom = -1;
let socketio = io.connect();
socketio.on("message_to_client",function(data) {
    if(data['room'] === currentRoom) {
        //Append an HR thematic break and the escaped HTML of the new message
        let chat_content = document.getElementById("chat_content");
        let time = new Date().toLocaleString();
        chat_content.innerHTML += "        <div class=\"chat-mes\">" +
            "            <div class=\"card-body\">" +
            "                <h6 class=\"card-subtitle mb-2 text-muted\">Username</h6>" +
            "                <p class=\"card-text\">" + data['message'] + "</p>" +
            "                <p class=\"card-text\"><small class=\"text-muted\">" + time + "</small></p>" +
            "            </div>" +
            "        </div>";
        window.scrollTo(0, document.body.scrollHeight * 2);
    }
});