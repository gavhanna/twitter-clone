const cardUsernameDisplay = document.getElementById('username');
const userPostCountDisplay = document.getElementById('post-count');
const postHolder = document.getElementById('post-holder');
const submitButton = document.getElementById('submit-button');
const postContent = document.getElementById('post-content');
const logoutButton = document.getElementById('log-out');
const form = document.getElementById('form');
const db = firebase.database();
const Posts = new PostManager();
let currentUser;

submitButton.addEventListener('click', onSubmit);
logoutButton.addEventListener('click', signOut);
postContent.addEventListener('focus', focused);
postContent.addEventListener('blur', unfocused);



function onSubmit() {
  if (postContent.value !== '') {
    const newPost = {
      name: userDisplayName, 
      content: postContent.value,
      user_id: currentUser.uid,
      posted_at: firebase.database.ServerValue.TIMESTAMP
    }

    Posts.addPost(newPost);
    writeData(newPost).then(() => {
      Posts.renderPosts();
    });
  } else {
    postContent.placeholder = `${currentUser.displayName.split(' ')[0]}, you didn't blab about anything...`;
    console.log('Empty field(s), doing nothing.');
    setTimeout(() => {
      postContent.focus();
    }, 100);
  }
  postContent.value = '';
  return;
}

function signOut() {
  firebase.auth().signOut().then(function() {
    console.log('Logged out.');
    window.location.href="/";
  }).catch(function(error) {
    console.log('Error logging out:', error);
  });
}

function writeData(post) {
  return db.ref('posts').push(post);
}

function getData() {
  const postArray = [];
  return db.ref('/posts').orderByChild('post_at').once('value')
    .then(function(snapshot) {
      snapshot.forEach(el => {
        const post = el.val();
        postArray.push(post);
      });
      return postArray;
    })
}

  function focused(e) {
    console.log('Focused on textarea!');
    submitButton.style.display = 'block';
  }

  function unfocused(e) {
    console.log('Not focused!');
    postContent.placeholder = `Blab about something...`;
    setTimeout(() => {
      console.log('BOOM');
      submitButton.style.display = 'none';
      
    }, 100);
  }


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    currentUser = user;
    userDisplayName = user.displayName;
    cardUsernameDisplay.innerText = user.displayName;
  } else {
    console.log('No user logged in.');
  }
});


getData().then(posts => {
  let userPostCount = 0;
  posts.forEach(post => {
    Posts.addPost(post);
    if (post.user_id === currentUser.uid) {
      userPostCount++;
    }
    userPostCountDisplay.innerText = userPostCount;
  })
}
).then(() => {
  Posts.renderPosts();
});



