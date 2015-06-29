// Whenever the server emits 'login', log the login message
socket.on('login', function (data) {
  USER.connect();
  USER.setUsername(data.user.username);
  USER.setRanks(data.user.ranks);
  USER.setUid(data.user.uid);
  USERS = data.allUsers;

  DEFAULSERVERNAME = data.serverName;
  // Display the welcome message
  var message = "Welcome to Socket.IO Chat";

  saveUser();
  log(message);
  playSound('login');
});

socket.on('user joined', function (data) {
  log(data.username+' joined');
  USERS = data.allUsers;
  playSound('join');
});

socket.on('user left', function (data) {
  log(data.username+' left');
  USERS = data.allUsers;
  playSound('leave');
});

socket.on('update userlist', function (allUsers) {
  USERS = allUsers;
});

socket.on('new msg', function(data){
  data.message.mention = isMention(USER.getUsername(),data.message.text);
  data.user = getUserFromData(data.user);
  addChatMessage(data);
  WAITINGMESSAGES++;
  addNotifWaitingMessage();
  if(data.message.mention){
    playSound('mention');
  } else {
    playSound('newMsg');
  }
});

socket.on('msg', function(data){
  data.user = getUserFromData(data.user);
  addChatMessage(data);
  playSound('mention');
});

socket.on('user info', function(user){
  USER.setRanks(user.ranks);
  USER.setUsername(user.username);
  USER.setUid(user.uid);

  saveUser();
});

socket.on('cmd', function(data){

  switch(data.callback){
    case 'login':
      updateMeUserInfo();

    case 'logout':
      updateMeUserInfo();
      break;

    case 'kick':
      if(data.valRetour == USER.getUsername()){
        socket.disconnect();
        clearData();
        location.reload();
      }
      break;

    case 'ban':

      break;

    case 'removeMsg':
      removeMessage(data.valRetour);
      break;

    case 'clean':
      clearChat();
      break;

    case 'popup':
      if(data.valRetour !== 1){
        popupClose();
        var pop = new Popup();
        data.valRetour = addMessageEmoji(data.valRetour);
        pop.init('center','center','50%','',"Announce",data.valRetour,true);
        pop.draw();
      }
      break;

    default:
      addServerMessage(data.valRetour);
      break;
  }
  addServerMessage(data.message);
});