const usernameDisplay = document.getElementById('username');
const userPostCountDisplay = document.getElementById('user-post-count')
const postHolder = document.getElementById('post-holder');
const db = firebase.database();
const Posts = new PostManager();



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
        }
      })
      userPostCountDisplay.innerText = 'Posts: ' + count;  
      Posts.renderPosts();
    });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    getUserPosts(firebase.auth().currentUser.uid);
    usernameDisplay.innerText = firebase.auth().currentUser.displayName;
  } else {
    console.log('No user logged in.');
  }
});
