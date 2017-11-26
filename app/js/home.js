const cardUsernameDisplay = document.getElementById('username');
const userPostCountDisplay = document.getElementById('post-count');
const postHolder = document.getElementById('post-holder');
const submitButton = document.getElementById('submit-button');
const postContent = document.getElementById('post-content');
const logoutButton = document.getElementById('log-out');
const db = firebase.database();
const Posts = new PostManager();
let currentUser;

submitButton.addEventListener('click', onSubmit);
logoutButton.addEventListener('click', signOut);

function PostManager() {
  this.posts = [];

  this.addPost = function(post) {
    this.posts.push(post);
  }

  this.renderPosts = function() {
    postHolder.innerHTML = '';
    const reversePosts = this.posts.reverse();
    for (const post of reversePosts) {
      const postEl = document.createElement('div');
      postEl.className += 'post';
      postEl.innerHTML = `
        <div class="post-block">
          <h5 class="post-title">${post.name}</h5>
          <p class="post-text">${post.content}</p>
          <span class="small">${new Date(post.posted_at) == 'Invalid Date' ? new Date() : new Date(post.posted_at) }</span>
        </div>
      `
      postHolder.appendChild(postEl);
    }
  }
}

function onSubmit() {
  if (postContent.value !== '') {
    Posts.addPost(
      {
        name: userDisplayName, 
        content: postContent.value,
        user_id: currentUser.uid,
        posted_at: firebase.database.ServerValue.TIMESTAMP
      }
    );
    writeData(Posts.posts).then(() => {
      Posts.renderPosts();
    });
  } else {
    console.log('Empty field(s), doing nothing.');
  }
  postContent.value = '';
  return;
}

function signOut() {
  firebase.auth().signOut().then(function() {
    console.log('Logged out.');
    window.location.href="/app/";
  }).catch(function(error) {
    console.log('Error logging out:', error);
  });
}

function writeData(posts) {
  return db.ref('posts').set(posts);
}

function getData() {
  const postArray = [];
  return db.ref('/posts/').once('value')
    .then(function(snapshot) {
      console.log(snapshot.val());
      
      snapshot.val().forEach(post => {
        postArray.push(post);
      });
      return postArray;
    })
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
      snap.val().forEach(el => {if (el) {count++}})
      userPostCountDisplay.innerText = count;
    });
  }


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    currentUser = user;
    userDisplayName = user.displayName;
    cardUsernameDisplay.innerText = user.displayName;
    getUserPosts(firebase.auth().currentUser.uid);
  } else {
    console.log('No user logged in.');
  }
});


getData().then(posts => 
  posts.forEach(post => {
    Posts.addPost(post);
  })
).then(() => {
  Posts.renderPosts();
});



