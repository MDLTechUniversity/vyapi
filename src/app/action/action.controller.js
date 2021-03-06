export class ActionController {
  constructor($firebaseArray, $stateParams,$log) {

    'ngInject';
    this.person='';
    this.items='';
    this.text='';
    this.assignee=[];
    this.clog = $log;

    this.roomID=$stateParams.roomKey;

    var roomRef = new Firebase('https://vyapi.firebaseio.com/rooms/'+this.roomID);
    this.actionLabel='';
    roomRef.on("value",(snapshot)=>{
      let labelData = snapshot.val();
      this.actionLabel = labelData.actionLabel;
    });
    var room = roomRef.child("members");
    room.on("value", (snapshot) => {
      snapshot.forEach((uid)=>{
        var personRef = new Firebase('https://vyapi.firebaseio.com/users/');
        var googleData=personRef.child(''+uid.key()+'/google/');
        $firebaseArray(googleData);
        googleData.on('value',(userSnapshot)=>{
          var userNames=userSnapshot.val()['displayName'];
          this.assignee.push(userNames);
        });
      });
    });


    this.myDataRef = new Firebase('https://vyapi.firebaseio.com/action/'+this.roomID);
    this.items=$firebaseArray(this.myDataRef);
  }


  add() {
    this.items.$add({task:this.text,name:this.person});
    this.text = '';
  }
  
  saveEdit(item) {
    (new Firebase('https://vyapi.firebaseio.com/action/'+this.roomID+'/'+item.$id+'/task/')).set(item.task);
  }

  change(person)
  {
    this.person=person;
  }

  modify(person)
  {
    this.myDataRef.child(person.$id).set({task:person.task,name:person.name});
    this.person=person;
  }

  remove(item)
  {
     var result=window.confirm("This action item will be deleted.Are you sure?");
      if(result)
      {
        this.items.$remove(item);
      }
  }
}
