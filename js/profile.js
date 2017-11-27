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
  // db.ref('/posts/')
  //   .orderByChild('user_id')
  //   .equalTo(uid)
  //   .on('value', snap => {
  //     let count = 0; 
  //     snap.val().forEach(el => {
  //       if (el) {
  //         Posts.addPost(el);
  //         count++;
  //         if (getParameterByName('user')) {
  //           usernameDisplay.innerText = el.name;
  //         }
  //       }
  //     })
  //     userPostCountDisplay.innerText = 'Posts: ' + count;  
  //     Posts.renderPosts();
  //   });
  const postArray = [];
  db.ref('/posts/').once('value')
  .then(function(snapshot) {
    console.log(snapshot.val());
    snapshot.val().forEach(post => {
      if (post.user_id === uid) {
        postArray.push(post);
        Posts.addPost(post);
        usernameDisplay.innerText = post.name;
      }
    });
    Posts.renderPosts();
    userPostCountDisplay.innerText = 'Posts: ' + postArray.length; 
    return postArray;
  })
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    if (getParameterByName('user')) {
      getUserPosts(getParameterByName('user'));

    } else {
      getUserPosts(firebase.auth().currentUser.uid);
      usernameDisplay.innerText = firebase.auth().currentUser.displayName;
    }
  } else {
    console.log('No user logged in.');
  }
});
