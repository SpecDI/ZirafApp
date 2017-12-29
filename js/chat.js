var selectedChat = {
  chatName : "All Zirafers",
  chatId : 1
};

var messages;

$(function() {
  $('#chatMenu').hide();
  $('#chatMenuBtn').click(function() {
    $('#chatMenu').toggle('slide');
    $('#chatMessageInputBox').slideToggle();
  });
  
  //create payload to select 20 messages from this chat
  dataPayload = selectedChat;
  dataPayload['messageIndex'] = -1;
  //load all message from the database associtaed with the given chat
  $.ajax({
    data: dataPayload,
    url: "../php/phpDirectives/getMessages.php",
    type: "GET",
    success: function(data){
      messages = JSON.parse(data);
      displayChat(messages);
    },
    error: function(){
      alert("Error");
    }
  });

  //check if the user pressed the send button
  $('#sendChatMessage').click(function(){
    //get the value of the message box
    var sentMessage = $('#chatMessageInput').val();
    var messageData = {
      content: sentMessage,
      chatId: selectedChat.chatId
    };
    //check if the message is not empty
    if(sentMessage !== ''){
      //make an ajax request and send the message
      $.ajax({
        data: messageData,
        url: "../php/phpDirectives/insertMessage.php",
        type: "POST",
        error: function(){
          alert("error occured");
        }
      });
      //clear the value of the text box
      $('#chatMessageInput').val("");
      $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    }
  });

  //check for new message every 0.5 seconds
  window.setInterval(function(){
    messageTimeout();
  }, 500);

  //check if the user pressed enter
  $('#chatMessageInput').keydown(function(e){
    //verify what key was pressed
    if(e.keyCode == 13){
      $('#sendChatMessage').click();
    }
  });

  //check if user clicked load more
  $('.loadLink').click(function(){
    //create payload to select 20 messages from this chat
    linkPayload = selectedChat;
    //get the present messages as an array of children
    var currentMessages = $(".chatBox").children();
    //check the length of the children
    if(currentMessages.length > 1){
      linkPayload['messageIndex'] = currentMessages.first().next().attr('id');
      //load all message from the database associtaed with the given chat
      $.ajax({
        data: linkPayload,
        url: "../php/phpDirectives/getMessages.php",
        type: "GET",
        success: function(data){
          response = JSON.parse(data);
          displayPreviousMessages(response);
        },
        error: function(){
          alert("Error");
        }
      });
    }
  });

  //check if an option for creating a new group has been created
  $('#selectUserEmails').keydown(function(e){
    if(e.keyCode == 13){
      //get the value of the selected email
      var selectedEmail = $('#selectUserEmails').val();
      //get the list of all options
      var allOptions = $('select').children();
      if(checkOptionValue(allOptions, selectedEmail)){
        //add the selected email to the list of selected emails
        $('#addedMembers').append('<div class="members row">' +
                                  '<p class="emails col-8">' + selectedEmail + '</p>' +
                                  '<button type="button" class="removeMemberBtn col-4">&times;</button>' +
                                  '</div>');
        //delete the input data
        $('#selectUserEmails').val("");
      }
    }

    //chekc if a row from the selected emails list has been deleted
    $('.removeMemberBtn').click(function(){
      $(this).parent().remove();
    });
  });

  //check if the user pressed the create chat button
  $('#createChatBtn').click(function(){
    var selectedOptions = $('#addedMembers').children();
    var chatEmails = {
      chatEmails : ""
    };
    for(var i=0;i<selectedOptions.length;i++){
      chatEmails.emailList += selectedOptions[i].val() + "&";
    }
    chatEmails.emailList = chatEmails.emailList.slice(0, -1);
    console.log(chatEmails);
  });
});

function displayChat(messageList){
  //display first batch of messages
  for(var i=0;i<messageList.length;i++){
    //get the message at given index
    var message = messageList[i];
    var messageElement = parseMessage(message);
    $('.chatBox').append(messageElement);
  }
}

function displayPreviousMessages(messageList){
  for(var i=messageList.length - 1;i>=0;i--){
    var message = messageList[i];
    var messageElement = parseMessage(message);
    $(messageElement).insertAfter('.loadLink');
  }
}

function parseMessage(message){
  var messageElement = (message.myMessage) ? '<div class="messageBox myMessage float-right" id="'+ message.messageId +'">' : '<div class="messageBox otherMessage float-left" id="'+ message.messageId +'">'
  messageElement +=       '<div class="messageHeader">' + 
                            '<img src="../img/userIcons/'+ message.userId + '.' + message.iconExtension + '" alt="Pic" class="messageImage float-left">' +
                            '<p class="messageName float-left">'+ message.userName +'</p>' +
                            '<p class="messageTime float-right">'+ message.dateCreated.slice(0, -3) +'</p>' +
                          '</div>' +
                          '<div class="clear"></div>' +
                          '<div class="messageBody">' +
                            '<p class="messageContent">'+ message.content +'</p>' +
                          '</div>' +
                        '</div>' +
                        '<div class="clear"></div>';
  return $.parseHTML(messageElement);

}

function messageTimeout(){
  //check if there are any new messages
  if(messages.length === 0){
    var lastMessage = {
      messageId : 0,
      chatId : selectedChat.chatId
    };
  }else{
    var lastMessage = {
      messageId : messages[messages.length - 1].messageId,
      chatId : selectedChat.chatId
    };
  }
  //check if there are any new messages and get the number of messages
  $.ajax({
    data: lastMessage,
    url: "../php/phpDirectives/getNumberOfNewMessages.php",
    type: "GET",
    success: function(result){
      if(result > 0){
        //query the last reuslt messages
        var queryMessages = {
          count : result,
          chatId : selectedChat.chatId
        };
        $.ajax({
          data: queryMessages,
          url: "../php/phpDirectives/getLastMessages.php",
          type: "GET",
          success: function(response){
            var messageArray = JSON.parse(response);
            if(messageArray.length > 0){
              displayChat(messageArray);
              messages = messages.concat(messageArray);
              $("html, body").animate({ scrollTop: $(document).height() }, 1000);
            }
          }
        });
      }
    }
  });
}

function checkOptionValue(options, value){
  for(var i=0;i<options.length;i++){
    if(options[i].value == value){
      return true;
    }
  }
  return false;
}
