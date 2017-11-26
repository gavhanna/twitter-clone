
  let currentUser;
  let userDisplayName;

  const db = firebase.database();

  submitButton.addEventListener('click', onSubmit);
  signOutButton.addEventListener('click', signOut);
  linkToProfile.addEventListener('click', navigateToProfile);

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
            <h5 class="card-title">${post.name}</h5>
            <p class="card-text">${post.content}</p>
            <span class="small">${post.posted_at.slice(0, 21)}</span>
          </div>
        `
        cardHolder.appendChild(card);
      }
    }

    get getPosts() {
      return this.posts;
    }
  }

  

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
    const Posts = new PostManager();
    db.ref('/posts/').once('value')
      .then(function(snapshot) {
        snapshot.val().forEach(post => {
          Posts.addPost(post);
        });
      }).then(function() {
        Posts.renderPosts();
      })
  }

  function getUserPosts(uid) {
    const UserPosts = new PostManager();
    
    if (!uid) {
      var uid = firebase.auth().currentUser.uid;
    }
    db.ref('/posts/')
      .orderByChild('user_id')
      .equalTo(uid)
      .on('value', snap => {
        snap.val().forEach(post => {
          UserPosts.addPost(post);
        });
      }).then(() => {
        UserPosts.renderPosts();
      })
    }

  
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      currentUser = user;
      userDisplayName = user.displayName;
      usernameDisplay.innerText = user.displayName;
      console.log(userDisplayName);
    } else {
      console.log('No user logged in.');
    }
  });
  
  
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  
  function navigateToProfile(e) {
    window.location.href = `/app/profile.html?user=${currentUser.uid}`;
  }
  
  
  
  setTimeout(() => {
    getUserPosts(currentUser.uid);
    console.log('OK TIMER DONE');
    
  }, 2000);
  
  
  
  
  getData();
  getUserPosts();
