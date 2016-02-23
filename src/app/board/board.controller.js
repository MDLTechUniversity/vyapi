export class BoardController {
  constructor ($firebaseArray, $location,$log, $stateParams, Dashboard, $timeout) {

    'ngInject';

    var userName = "";
    var appURL = "https://vyapi.firebaseio.com/";
    var roomID = $location.path().split("/")[2];
    var roomId = $stateParams.roomKey;
    this.anonymous = true;
    $("#delete-confirmation").hide();
    $("#anonymous-confirmation").hide();
    $("#visible-confirmation").hide();
    $log.log("roomID is " + roomID);


    var userRef = new Firebase("https://vyapi.firebaseio.com/messages");
    var authData = userRef.getAuth();
    var googleId = authData.google.id;
    var userId = "google:"+googleId;

    this.plusLabel='';
    this.minusLabel='';
    this.roomName='';
    var roomRef= new Firebase("https://vyapi.firebaseio.com/rooms/" + roomID);
    roomRef.on("value",(snapshot)=>{
      console.log(snapshot.val());
      let labelData = snapshot.val();
      this.roomName = labelData.roomName;
      this.plusLabel = labelData.plusLabel;
      this.minusLabel = labelData.minusLabel;
      console.log(this.plusLabel);
      console.log(this.minusLabel);
    });

    var roomURL= "https://vyapi.firebaseio.com/messages/" + roomID;
    this.msgRef = new Firebase(roomURL);
    this.messages = $firebaseArray(this.msgRef);

    var onlineUsersRef = new Firebase(appURL + "onlineUsers/");
    this.onlineUsers = {};

    //CODE TO MAKE THE USER ANONYMOUS
    this.toggle = function() {
      this.anonymous = !this.anonymous;
      if(!this.anonymous){
        userName = authData.google.displayName;

        $("#visible-confirmation").show();
        $timeout(function() { $("#visible-confirmation").hide(); }, 1500);
      } else {
        userName = "anonymous";

        $("#anonymous-confirmation").show();
        $timeout(function() { $("#anonymous-confirmation").hide(); }, 1500);
      }
    };

    //CODE TO ENTER THE OBJECT IN FIREBASE DATABASE
    this.submit = function (id) {
      let userMessage = (id == 'plus') ? this.userMessagePlus : this.userMessageMinus;
      var ref = new Firebase("https://vyapi.firebaseio.com/rooms/" + roomID);
      var dashboard;
      var num;
      if (id == 'plus')
        dashboard = new Firebase(ref + "/pos");
      else
        dashboard=new Firebase(ref+"/neg");

      dashboard.once("value",(snapshot)=>{
        num = parseInt(snapshot.val());
        num++;
        if(id =='plus')
         ref.update({pos : num});
       else
         ref.update({neg : num});

     });

      if (userMessage) {
        if(!userName) userName = "anonymous";
        // $log.log(authData);

        this.messages.$add({
          from: userName,
          uid: authData.uid,
          text: userMessage,
          lane: id,
          dl: 0
        });
        (new Firebase("https://vyapi.firebaseio.com/messages/" + roomID)).endAt().limit(1).on('child_added',(snapshot)=>{
          let lastchildadded=snapshot.val();
          (new Firebase(roomURL + "/" + lastchildadded.key)).setPriority(1);
          let currPriority = 2;
          let children = $document.getElementById("chat-messages-plus").childNodes;
          for(var c in children) {
            if(children[c].childNodes[1] != undefined) {
              var uniqueMsgID = children[c].childNodes[1].getAttribute('id');
              (new Firebase(roomURL + "/" + uniqueMsgID)).setPriority(currPriority);
              currPriority++;
            }
          }
        });
        (new Firebase("https://vyapi.firebaseio.com/messages/" + roomID)).endAt().limit(1).on('child_added',(snapshot)=>{
          let lastchildadded=snapshot.val();
          (new Firebase(roomURL + "/" + lastchildadded.key)).setPriority(1);
          let currPriority = 2;
          let children = $document.getElementById("chat-messages-minus").childNodes;
          for(var c in children) {
            if(children[c].childNodes[1] != undefined) {
              var uniqueMsgID = children[c].childNodes[1].getAttribute('id');
              (new Firebase(roomURL + "/" + uniqueMsgID)).setPriority(currPriority);
              currPriority++;
            }
          }
        });
        this.userMessagePlus = '';
        this.userMessageMinus = '';

      }
    };

    //CODE TO DISPLAY THE 5 SECOND NOTIFICATION FOR ANONYMITY
    $('#anonymousWarn').fadeIn().delay(5000).fadeOut();

    //CODE TO COUNT THE NO. OF LIKES ON A MESSAGE
    (new Firebase(roomURL)).on('child_added', (messagesObj) => {


      (new Firebase(encodeURI(roomURL + "/" + messagesObj.key() + "/like"))).on('value', (userId) => {
        if(userId.val() != null && messagesObj.key()) { //likes are there for this message
          //this.noOfLikes [messagesObj.val().uid] =userId.numChildren();
          let fredNameRef = new Firebase(roomURL + "/" + messagesObj.key());
          // Modify the 'first' and 'last' children, but leave other data at fredNameRef unchanged
          fredNameRef.update({ dl: userId.numChildren() });
        }
        else
        {
          //this.noOfLikes [messagesObj.val().text] =userId.numChildren();
          let fredNameRef = new Firebase(roomURL + "/" + messagesObj.key());
          // Modify the 'first' and 'last' children, but leave other data at fredNameRef unchanged
          fredNameRef.update({ dl: userId.numChildren() });
        }
      });
    });

    //handle like button click for a message
    this.like = function(msg) {
      let googleId = msg.$id;
      if(msg.uid != userId){
        let msgLike = (new Firebase(roomURL)).child(msg.$id + "/like/" +authData.uid);
        msgLike.once("value" , function(value){
          if(value.exists()){
              msgLike.remove();
          }
          else{
            msgLike.set(1);
            msgLike.off();
          }
        });
        let msgLikes = (new Firebase(roomURL)).child(msg.$id + "/like/");
          msgLikes.once('value', function(snapshot) {
          msg.noOfLikes=snapshot.numChildren();
        });
      }
    }

    //CODE TO ENABLE DRAG AND DROP OF STICKYs
    $("#chat-messages-plus").disableSelection();
    $("#chat-messages-minus").disableSelection();

    $("#chat-messages-plus").sortable({
      start: function(event, ui) {
      },
      change: function(event, ui) {
      },
      update: function(event, ui) {
        var currPriority = 1;
        var children = $('.grab-handle').childNodes;
        for(var c in children) {
          if(children[c].childNodes[1] != undefined) {
            var uniqueMsgID = children[c].childNodes[1].getAttribute('id');
            (new Firebase(roomURL + "/" + uniqueMsgID)).setPriority(currPriority);
            currPriority++;
          }
        }
      }
    });

    $("#chat-messages-minus").sortable({
      start: function(event, ui) {
      },
      change: function(event, ui) {
      },
      update: function(event, ui) {
        var currPriority = 1;
        var children = $('.grab-handle').childNodes;
        for(var c in children) {
          if(children[c].childNodes[1] != undefined) {
            var uniqueMsgID = children[c].childNodes[1].getAttribute('id');
            (new Firebase(roomURL + "/" + uniqueMsgID)).setPriority(currPriority);
            currPriority++;
          }
        }
      }
    });

    //CODE TO DELETE THE MESSAGE POSTED
    this.delete=function(msg,temp){
      var result=$window.confirm("This card will be deleted.Are you sure?");
      if(result)
      {
      var ide=msg.$id;
      var refe = new Firebase("https://vyapi.firebaseio.com/rooms/"+roomID);
      var dash;
      var number;
      if(temp === 5)
        dash=new Firebase(refe+"/pos");
      else
        dash=new Firebase(refe+"/neg");
      dash.once("value",(snapshot)=>{
        number = parseInt(snapshot.val());
        number=number-1;
        if(temp === 5)
          refe.update({pos : number});
        else
          refe.update({neg : number});
      });

      let messageId=msg.$id;
      if(msg.uid === userId){
        this.msgRef.child(messageId).remove();
      }

      $("#delete-confirmation").show();
      $timeout(function() { $("#delete-confirmation").hide(); }, 1200);
    }
    };

    //CODE TO SHOW THE EDIT BUTTON ONLY ON SELF STICKYs
    this.getListId = function (msgId) {
      return msgId;
    }

    //CODE TO EDIT THE STICKY NOTES
    this.isOwner = function (msgId) {
      if (msgId === userId)
        return true;
      else
        return false;
    }

    this.currentMessageText = "hello";
    this.currentMessage;

    this.edit = function(msg) {
      this.currentMessageText= msg.text;
      this.currentMessage = msg;
      // // $('#stickyTextarea').setAttribute("disabled","disabled");
      // $('#stickyTextarea').focus();
      // $('.edit-btn').css({'display' : 'none'});
      // $('.save-btn').css({'display' : 'inline-block'});
    }

    this.saveEdit = function (msg) {
      (new Firebase(roomURL + "/" + msg.$id+"/text")).set(msg.text);
      /*if(msg.uid == userId) {
        $('.edit-btn').css({'display' : 'inline-block'});
        $('.save-btn').css({'display' : 'none'});
        $('#stickyTextarea').blur();
        // $('#stickyTextarea').removeAttribute("disabled");
      }*/
    }

    this.userPic = [];
    this.anonymousImage = function(msg){
      if(msg.from != "anonymous")
        return false;
      else
        return true;
    }
    this.getUserPic = function(userId){
      if(angular.isUndefined(this.userPic[userId]))
      {
        (new Firebase ("https://vyapi.firebaseio.com/users/" + userId+ "/google/profileImageURL")).once("value",(snapshot)=>{
          this.userPic[userId] = snapshot.val();
        });
      }
      return this.userPic[userId];
    }

    //CODE TO LIMIT THE CHARACTER IN TEXTAREA
    $('.sticky-textarea').keypress(function(event) {
      if (event.keyCode == 13) {
        event.preventDefault();
      }
    });
  }
}




