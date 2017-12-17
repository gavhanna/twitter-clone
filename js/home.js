const cardUsernameDisplay = document.getElementById('username');
const userPostCountDisplay = document.getElementById('post-count');
const postHolder = document.getElementById('post-holder');
const submitButton = document.getElementById('submit-button');
const postContent = document.getElementById('post-content');

const form = document.getElementById('form');
const Posts = new PostManager();

submitButton.addEventListener('click', onSubmit);

postContent.addEventListener('focus', focused);
postContent.addEventListener('blur', unfocused);



function onSubmit() {
  if (postContent.value !== '') {
    const content = postContent.value;
    userPostCountDisplay.innerText = +userPostCountDisplay.innerText + 1;
    const pLink = getProfilePic(currentUser.uid);
    pLink.then(link => {
      console.log(link);
      
      const newPost = {
        name: userDisplayName, 
        content: content,
        user_id: currentUser.uid,
        posted_at: firebase.database.ServerValue.TIMESTAMP,
        user_profile_url: link || null
      };
      sendPost(newPost);
    });    
  } else {
    postContent.placeholder = `${currentUser.displayName.split(' ')[0]}, you didn't blab about anything...`;
    setTimeout(() => {
      postContent.focus();
    }, 100);
  }
  postContent.value = '';
  return;
}

function sendPost(post) {
  const data = db.ref('posts').push(post);
  const newEl = Posts.createPostElement(post, post.user_profile_url);
  postHolder.prepend(newEl);
  applyListeners();
}

function getData() {
  const postArray = [];
  db.ref('/posts').orderByChild('post_at').once('value')
    .then(function(snapshot) {
      snapshot.forEach(el => {
        const post = el.val();
        post.post_id = el.key;
        postArray.push(post);
      });
      return postArray;
    }).then(posts => {
      
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
}

function focused(e) {
  //submitButton.style.display = 'block';
}

function unfocused(e) {
  postContent.placeholder = `Blab about something...`;

}


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    currentUser = user;
    userDisplayName = user.displayName;
    cardUsernameDisplay.innerText = user.displayName;
    getProfilePic(user.uid);
  } else {
    console.log('No user logged in.');
    location.pathname = baseURL + 'login.html';
  }
});


getData();