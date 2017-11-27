const navButton = document.getElementById('nav-button');
const nav = document.querySelector('.nav-items');
const closeNav = document.getElementById('close-nav-area');

closeNav.addEventListener('click', navOpen);
navButton.addEventListener('click', navOpen);

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


function navOpen() {
  nav.classList.toggle('open');
  navButton.classList.toggle('nav-btn-open');
  closeNav.classList.toggle('close-open');
}