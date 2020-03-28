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
    panel = document.getElementById("wrong-input-login");
    panel.style.visibility="hidden";
    panel.textContent = "Please check input";
    panel = document.getElementById("wrong-input-register");
    panel.style.visibility="hidden";
    panel.textContent = "Please check input";
    panel = document.getElementById("wrong-input-roomName");
    panel.style.visibility="hidden";
    panel.textContent = "Please check input";

}

//login
function login() {

    let login_username = document.getElementById("login_username").value;
    let login_password = document.getElementById("login_password").value;
    let wrong_input_display = document.getElementById("wrong-input-login");

    const regex = /^[\sa-zA-Z0-9,.:;"?!@#$%^&*()_+<>]+$/g;
    if(!login_username.match(regex)) {
        wrong_input_display.style.visibility = "visible";
        return;
    }

    axios.post('php/login.php',{
        username:login_username,
        password:login_password

    })
        .then(function (response) {
            if(response.data.success!=="false") {
                username = login_username;
                login_username = "";
                login_password = "";
                let login = document.getElementById("login");
                login.style.display="none";
                let register = document.getElementById("register");
                register.style.display="none";
                let logout = document.getElementById("logout");
                logout.style.display="list-item";
                let btn_groupMem = document.getElementById("btn_groupMem");
                btn_groupMem.style.display="list-item";
                let btn_createRoom = document.getElementById("btn_createRoom");
                btn_createRoom.style.display="list-item";
                let btn_roomList = document.getElementById("btn_roomList");
                btn_roomList.style.display="list-item";

                document.getElementById("sendMSM").disabled = false;
                closePanel();
            }
            else{
                wrong_input_display.style.visibility = "visible";
                wrong_input_display.textContent = response.data.message;
            }
        })
        .catch(function (error) {
            console.log(error);
        });

}

//logout
function logout() {
    axios.post('php/logout.php',{
    })
        .then(function (response) {
            let logout = document.getElementById("logout");
            logout.style.display="none";
            let login = document.getElementById("login");
            login.style.display="list-item";
            let register = document.getElementById("register");
            register.style.display="list-item";
            let btn_groupMem = document.getElementById("btn_groupMem");
            btn_groupMem.style.display="none";
            let btn_createRoom = document.getElementById("btn_createRoom");
            btn_createRoom.style.display="none";
            let btn_roomList = document.getElementById("btn_roomList");
            btn_roomList.style.display="none";
        })
        .catch(function (error) {
            console.log(error);
        });

}

//sign up
function signup() {
    let register_username = document.getElementById("register_username").value;
    let register_password = document.getElementById("register_password").value;
    let register_repassword = document.getElementById("register_repassword").value;

    const regex = /^[\sa-zA-Z0-9,.:;"?!@#$%^&*()_+<>]+$/g;
    if(!register_username.match(regex) || register_password !== register_repassword) {
        document.getElementById("wrong-input-register").style.visibility = "visible";
        return;
    }
    axios.post('php/register.php',{

        username:register_username,
        password:register_password,
        repassword:register_repassword

    })
        .then(function (response) {
            if(String(response.data.success)==="true"){
                register_username = "";
                register_password = "";
                register_repassword = "";
                closePanel();
                alert("registration success");
            }
            else{
                document.getElementById("wrong-input-register").style.visibility = "visible";
                document.getElementById("wrong-input-register").textContent = response.data.message;
            }
        })
        .catch(function (error) {
            console.log(error);
        });

}

//groupMemChat
function groupMemChat() {
    axios.post('php/groupMem.php',{
        currentRoom:currentRoom

    })
        .then(function (response) {
            let members = response.data.members;
            let list_user = document.getElementById("inputGroupSelect01");
            list_user.innerHTML = "<option selected value=\"0\">Public</option>";

            for(let i =0;i<members.length;i++){
                    list_user.innerHTML += "<option value=\""+members[i].user_id+"\">"+members[i].username+"</option>";
            }

        })
        .catch(function (error) {
            console.log(error);
        });
}

//group members
function groupMem(){
    axios.post('php/groupMem.php',{
        currentRoom:currentRoom

    })
        .then(function (response) {
            let members = response.data.members;
            let list_user = document.getElementById("list-user");
            if(response.data.message === "true"){
                for(let i =0;i<members.length;i++){
                    list_user.innerHTML +="            <div class=\"form-group\">" +
                        "                <label>"+members[i].username+"</label>" +
                        "                <button class=\"btn btn-outline-danger\" type=\"button\" onclick=\"removeuser("+members[i].user_id+")\">Remove</button>" +
                        "                <button class=\"btn btn-outline-secondary\" type=\"button\" onclick=\"banuser("+members[i].user_id+")\">Ban</button>" +
                        "            </div>";
                }
            }
            else{
                for(let i =0;i<members.length;i++){
                    list_user.innerHTML +="            <div class=\"form-group\">" +
                        "                <label>"+members[i].username+"</label>" +
                        "            </div>";
                }
            }

        })
        .catch(function (error) {
            console.log(error);
        });
}

//remove a user from room
function removeuser(id) {
    axios.post('php/removeMem.php',{
        user_id:id,
        currentRoom:currentRoom
    })
        .then(function (response) {
            alert("Remove Successfully!");
            closePanel();
        })
        .catch(function (error) {
            console.log(error);
        });

}

//ban a user from room
function banuser(id) {
    axios.post('php/banMem.php',{
        user_id:id,
        currentRoom:currentRoom
    })
        .then(function (response) {
            alert("Ban Successfully!");
            closePanel();
        })
        .catch(function (error) {
            console.log(error);
        });
}
//room list
function roomList() {

    axios.post('php/roomList.php',{})
        .then(function (response) {
            let rooms = response.data.rooms;
            let list_room = document.getElementById("room-list");
            for(let i =0;i<rooms.length;i++){
                list_room.innerHTML +="            <div class=\"form-group\">" +
                    "                <label>"+rooms[i].roomname+"</label>" +
                    "                <label>Creater:"+rooms[i].creater+"</label>" +
                    "                <button class=\"btn btn-outline-primary\" type=\"button\" onclick=\"enterRoom("+rooms[i].room_id+","+rooms[i].roomname+")\">Enter</button>" +
                    "            </div>";
            }

        })
        .catch(function (error) {
            console.log(error);
        });
}

//create new chat room
function newRoom() {
    let newRoomName = document.getElementById("newRoomName").value;
    let password = document.getElementById("private_password").value;
    const regex = /^[\sa-zA-Z0-9,.:;"?!@#$%^&*()_+<>]+$/g;
    if(!newRoomName.match(regex)){
        document.getElementById("wrong-input-roomName").style.visibility = "visible";
        return;
    }

    if(document.getElementById("private").checked) {
        if (password === ""){
            document.getElementById("wrong-input-roomName").style.visibility = "visible";
            return;
        }
        axios.post('php/privateRoom.php',{
            newRoomName:newRoomName,
            password:password
        })
            .then(function (response) {
                closePanel();
                alert("Create Successfully!");
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    else{
        axios.post('php/newRoom.php',{
            newRoomName:newRoomName
        })
            .then(function (response) {
                closePanel();
                alert("Create Successfully!");
            })
            .catch(function (error) {
                console.log(error);
            });
    }


}

//enter a room
function enterRoom(id,roomname) {
    axios.post('php/enterRoom.php',{
        room_id:id
    })
        .then(function (response) {
            let curRoomName = document.getElementById("cur_roomName");
            curRoomName.textContent = roomname;

            let chat_content = document.getElementById("chat_content");
            chat_content.innerHTML = "";

            let input = document.getElementById("message");
            input.value="";

            currentRoom = parseInt(id);
            closePanel();
            alert("Enter Room Successfully!");
            groupMemChat();
        })
        .catch(function (error) {
            console.log(error);
        });

}

//send message
function sendMsg() {
    let input = document.getElementById("message");
    let message = input.value;

    let select = document.getElementById("inputGroupSelect01");
    toWhom = select.value;

    socketio.emit("message_to_server", {message:message,room:currentRoom});

    input.value="";
}
//check user status
let username = "";
//current room id. default is main lobby.
let currentRoom = -1;
//send message to whom
let toWhom = 0;
//room owner's id
let currentRoomOwner = 0;
axios.post('php/enterRoom.php',{
})
    .then(function (response) {
        if(response.data.message=== "true"){
            username = response.data.username;
            let logout = document.getElementById("logout");
            logout.style.display="list-item";
        }
        else{
            document.getElementById("sendMSM").disabled = true;
            let logout = document.getElementById("logout");
            logout.style.display="none";
            let btn_groupMem = document.getElementById("btn_groupMem");
            btn_groupMem.style.display="none";
            let btn_createRoom = document.getElementById("btn_createRoom");
            btn_createRoom.style.display="none";
            let btn_roomList = document.getElementById("btn_roomList");
            btn_roomList.style.display="none";
            let login = document.getElementById("login");
            login.style.display="list-item";
            let register = document.getElementById("register");
            register.style.display="list-item";
        }
    })
    .catch(function (error) {
        console.log(error);
    });
groupMemChat();
let socketio = io.connect();
socketio.on("message_to_client",function(data) {
    if(data['room'] === currentRoom) {
        //Append an HR thematic break and the escaped HTML of the new message
        let chat_content = document.getElementById("chat_content");
        let time = new Date().toLocaleString();
        chat_content.innerHTML += "        <div class=\"chat-mes\">" +
            "            <div class=\"card-body\">" +
            "                <h6 class=\"card-subtitle mb-2 text-muted\">"+username+"</h6>" +
            "                <p class=\"card-text\">" + data['message'] + "</p>" +
            "                <p class=\"card-text\"><small class=\"text-muted\">" + time + "</small></p>" +
            "            </div>" +
            "        </div>";
        window.scrollTo(0, document.body.scrollHeight * 2);
    }
});