(function(){
  const cardHolder = document.getElementById('card-holder');
  const nameInput = document.getElementById('name-input');
  const messageInput = document.getElementById('message-input');
  const submitButton = document.getElementById('message-submit');
  const cardArray = [];

  const db = firebase.database();

  submitButton.addEventListener('click', onSubmit);


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

    getPosts() {
      return this.posts;
    }
  }

  const Posts = new PostManager();

  function onSubmit() {
    if (nameInput.value !== '' && messageInput.value !== '') {
      Posts.addPost({name: nameInput.value, content: messageInput.value});
      Posts.renderPosts();
      writeData(Posts.posts);
    } else {
      console.log('Empty field(s), doing nothing.');
      return;
    }
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
  


})();
