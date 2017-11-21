(function(){
  const cardHolder = document.getElementById('card-holder');
  const nameInput = document.getElementById('name-input');
  const messageInput = document.getElementById('message-input');
  const submitButton = document.getElementById('message-submit');
  const cardArray = [];
  const signOutButton = document.getElementById('sign-out');
  const usernameDisplay = document.getElementById('username');
  let currentUser;
  let userDisplayName;

  const db = firebase.database();

  submitButton.addEventListener('click', onSubmit);
  signOutButton.addEventListener('click', signOut);

  class PostManager {
    constructor() {
      this.posts = [];
    }

    addPost(post) {
      this.posts.push(post);
    }

    renderPosts() {
      cardHolder.innerHTML = '';
      const reversePosts = this.posts.reverse();
      for (const post of reversePosts) {
        const card = document.createElement('div');
        card.className += 'card';
        card.innerHTML = `
          <div class="card-block">
            <h4 class="card-title">${post.name}</h4>
            <p class="card-text">${post.content}</p>
          </div>
        `
        cardHolder.appendChild(card);
      }
    }

    get getPosts() {
      return this.posts;
    }
  }

  const Posts = new PostManager();

  function onSubmit() {
    if (messageInput.value !== '') {
      Posts.addPost(
        {
          name: userDisplayName, 
          content: messageInput.value,
          user_id: currentUser.uid,
          posted_at: new Date().toString()
        }
      );
      Posts.renderPosts();
      writeData(Posts.posts);
    } else {
      console.log('Empty field(s), doing nothing.');
    }
    messageInput.value = '';
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
    db.ref('posts').set(posts);
  }

  function getData() {
    db.ref('/posts/').once('value')
      .then(function(snapshot) {
        snapshot.val().forEach(post => {
          Posts.addPost(post);
        });
      }).then(function() {
        Posts.renderPosts();
      })
  }

  getData();
  
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      currentUser = user;
      userDisplayName = user.displayName;
      usernameDisplay.innerText = user.displayName;
      console.log(currentUser);
    } else {
      console.log('No user logged in.');
    }
  });

  
})();
