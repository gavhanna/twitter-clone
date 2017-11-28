const navButton = document.getElementById('nav-button');
const nav = document.querySelector('.nav-items');
const closeNav = document.getElementById('close-nav-area');
let userProfileLink;

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
      const imgEl = document.createElement('img');      
      const postEl = document.createElement('div');
      postEl.className += 'post';
      postEl.innerHTML = `
        <div class="post-block">
          <div class="post-left">
            <a href="profile.html?user=${post.user_id}">
              <img src="${post.user_profile_url}" class="post-profile">
            </a>
          </div>
          <div class="post-right">
            <h5 class="post-title"><a href="profile.html?user=${post.user_id}">${post.name}</a></h5>
            <p class="post-text">${post.content}</p>
            <span class="small">${new Date(post.posted_at) == 'Invalid Date' ? new Date().toString().slice(0,21) : new Date(post.posted_at).toString().slice(0,21) }</span>
          </div>
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

function getProfilePic(user, element) {
  const storage = firebase.storage();
  const pathRef = storage.ref(user + '/profilePicture/profile');
   return pathRef.getDownloadURL().then(url => {
     if (element) {
       element.src = url;
     }
    userProfileLink = url;
  })
}
