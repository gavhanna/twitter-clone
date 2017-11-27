const usernameDisplay = document.getElementById('username');
const userPostCountDisplay = document.getElementById('user-post-count')
const postHolder = document.getElementById('post-holder');
const db = firebase.database();
const Posts = new PostManager();



function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getUserPosts(uid) {
  if (!uid) {
    var uid = firebase.auth().currentUser.uid;
  }
  db.ref('/posts/')
    .orderByChild('user_id')
    .equalTo(uid)
    .on('value', snap => {
      let count = 0;
      snap.val().forEach(el => {
        if (el) {
          Posts.addPost(el);
          count++;
          if (getParameterByName('user')) {
            usernameDisplay.innerText = el.name;
          }
        }
      })
      userPostCountDisplay.innerText = 'Posts: ' + count;  
      Posts.renderPosts();
    });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    if (getParameterByName('user')) {
      getUserPosts(getParameterByName('user'));
      console.log('It got to here!');
      
    } else {
      getUserPosts(firebase.auth().currentUser.uid);
      usernameDisplay.innerText = firebase.auth().currentUser.displayName;
    }
  } else {
    console.log('No user logged in.');
  }
});
