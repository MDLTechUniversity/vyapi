export class DashboardController {
	constructor ($firebaseArray,Auth, FireData, Dashboard,$location,$log,$window,$cookies, Email, $localStorage){
		'ngInject';
		this.path = $location.absUrl().replace('dashboard', 'room');
		this.location = $location;
		this.cookies = $cookies;
		this.auth = Auth;
		this.clog = $log;
        //this.firedata = FireData;
        this.localStorage = $localStorage;
		this.rooms = [];
		this.userPic = '';
		this.car= [];
		this.roomName='';
		this.plusName='';
		this.minusName='';
		this.actionName='';
		this.rName='';
		this.aName='';
		this.mName='';
		this.pName='';
		this.editKey='';
        this.inviteEmails = '';
        this.inviteRoomKey = '';
        this.Email = Email;
		this.cards(Dashboard);
		this.setParam(Dashboard);

		this.createRoom = function(){
			if(!this.roomName)
			{
				return false;
			}
			else
			{
				this.create(Dashboard);
			}
		};
		this.removeRoom = function(roomKey){
			this.remove(Dashboard,roomKey);
		};
		this.editRoom = function(roomKey){
			this.edit(Dashboard,roomKey);
		};
		this.saveValues = function(){
			this.save(Dashboard);
		};
		// Changes to redirect to cookie path
		var path = $cookies.get('path');
		if(path){
			$cookies.remove('path');
			$location.path(path);
		}
		// Finish of changes to cookie path
	}

	cards(Dashboard)
	{
		let card_count=0;
		let car = [];
		let userID = this.localStorage.userInfo['id'];//this.firedata.getUid();
		if(!userID){
			return;
		}
		Dashboard.getRooms(userID).on("value",(snapshot)=>{
			snapshot.forEach(function(childSnapshot){
				var n = childSnapshot.child("members").numChildren();
				car[card_count]=parseInt(n);
				card_count++;
			});
			this.car= car;
			return car;
		});
	}

	setParam(Dashboard){
		if(!Dashboard)
		{
			return;
		}
		let userID = this.localStorage.userInfo['id'];//this.firedata.getUid();
        console.log("userID: " + userID);
		if(!userID){
			this.rooms = ["mock data"];
			return "set param is being called";
		}
		
		this.userPic = this.localStorage.userInfo['picture'];
		
		let roomsPromise = Dashboard.getRooms(userID);
		if(!roomsPromise)
			return;
		roomsPromise.on("value",(snapshot)=>{
			let i=0;
			let rooms = snapshot.val();
			rooms = _.map(rooms,(room,key,url,mem)=>{
				room.key = key;
				room.url = this.path + '/' +  key;
				room.mem = this.car[i];
				i++;
				return room;
			});
			this.rooms = rooms;
		});
	}
	create(Dashboard)
	{
		let userID = this.localStorage.userInfo['id'];//this.firedata.getUid();
		if(!userID)
			return;
		let d=new Date();
		let p= d.toDateString();
		Dashboard.createRoom(userID,this.roomName,this.plusName,this.minusName,this.actionName,p);
	}

	remove(Dashboard,roomKey){
		Dashboard.remove(roomKey);
	}

  firebaseAuthlogout(){
    this.auth.logout()
    this.clog.log("Logged out");
    this.location.path('/');
  }

  googleAuthLogout() {
    this.auth.googleLogout();
    this.location.path('/');
  }

  edit(Dashboard,roomKey){
    this.editKey = roomKey;
    let currentRoom = _.find(this.rooms,{key : roomKey});
    this.rName = currentRoom.roomName;
    this.pName = currentRoom.plusLabel;
    this.mName = currentRoom.minusLabel;
    this.aName = currentRoom.actionLabel;
    Dashboard.editRoom();
  }

  save(Dashboard){
    Dashboard.saveValues(this.editKey,this.rName,this.pName,this.mName,this.aName);
  }
  
  inviteSetup(key) {
    this.inviteRoomKey = key;
  }
  
  invite() {
    if(this.inviteEmails == '')
      return;
    var roomURL = this.location.protocol() + "://" + this.location.host() + ":" + this.location.port() + "/" + this.inviteRoomKey ;
    var text = "Hi,\n You have been invited to this room. Click on the link below.\n\t" + roomURL;
    var to = this.inviteEmails;
    var subject = "Invite to Vyapi";
    
    this.Email.sendInvite({'to': to, 'subject': subject, 'text': text});
    this.inviteEmails = '';
  }
}
