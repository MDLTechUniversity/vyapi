export class ActionController {
  constructor($firebaseArray,$stateParams) {
    'ngInject';
    this.person='';
    this.items='';
    this.text='';
    this.assignee=[];
    var self=this.assignee;

    this.roomID=$stateParams.roomKey; //temporary
    var roomRef = new Firebase('https://vyapi.firebaseio.com/rooms/'+this.roomID);
    var room = roomRef.child("members");
    room.once("value", function(snapshot) {
    var data1 = snapshot.forEach(function(uid){
      var personRef = new Firebase('https://vyapi.firebaseio.com/users/');
      //console.log(''+child.key()+'/google/');
      var data2=personRef.child(''+uid.key()+'/google/');
      $firebaseArray(data2);
      data2.once('value',function(userSnapshot){
              var userNames=userSnapshot.val()['displayName'];
              self.push(userNames);
              //console.log(self);
      });
    });
    // data === "hello"
  });


    //this.assignee=['mayuresh','abhimanyu','aishwarya'];
    //console.log(self);


    this.myDataRef = new Firebase('https://vyapi.firebaseio.com/action');
    this.items=$firebaseArray(this.myDataRef);
    this.myDataRef.on('value',(snapshot)=>{
    //console.log(this.items);
    let actions=snapshot.val();
    //console.log(actions);
    this.items = _.map(actions,(action,key)=>{
      action.key=key;
      //console.log("key "+action.key)
     // console.table(action);
      return action;
    });
    console.table(this.items);
    //this.myDataRef = new Firebase('https://vyapi.firebaseio.com');
    //console.log(this.items[0].key);
  });
  }

  add()
  {
    this.items.push({task:this.text,name:this.person,roomid:this.roomID});
    //console.log(this.roomID);
    this.myDataRef.push({task:this.text,name:this.person,roomid:this.roomID});
    //myDataRef.child("users/"+ authData.uid).set(authData);
    this.text = '';
  }

  change(person)
  {
    //console.log(person);
    this.person=person;
  }

  modify(person)
  {
    console.log('modify'+person.name);
    /*this.myDataRef.child('action/'+$person.key).remove();
    this.myDataRef.child('action').push({task:$person.task,name:$person.name,roomid:this.roomID});*/
    this.myDataRef.child(person.key).set({task:person.task,name:person.name,roomid:this.roomID});
    this.person=person;
  }

  remove(index)
  {
    console.log(index);
    this.myDataRef.child(this.items[index].key).remove();
    //console.log(this.items);
    //this.items.splice(index, 1);
    //console.log(this.items);
  }
}
