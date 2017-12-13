const navButton = document.getElementById('nav-button');
const nav = document.querySelector('.nav-items');
const closeNav = document.getElementById('close-nav-area');
const db = firebase.database();
let userProfileLink;

closeNav.addEventListener('click', navOpen);
navButton.addEventListener('click', navOpen);

function PostManager() {
  this.posts = [];

  this.addPost = function(post) {
    this.posts.push(post);
  }

  this.createPostElement = function(post, profilePicLink) {
    const postEl = document.createElement('div');
    postEl.className += 'post';
    
    postEl.innerHTML = `
      <div class="post-block">
        <div class="post-left">
          <a href="profile.html?user=${post.user_id}">
            <img src="${profilePicLink || post.user_profile_url}" class="post-profile">
          </a>
        </div>
        <div class="post-right">
          <h5 class="post-title"><a href="profile.html?user=${post.user_id}">${post.name}</a></h5>
          <p class="post-text">${post.content}</p>
          <span class="small">${new Date(post.posted_at) == 'Invalid Date' ? new Date().toString().slice(0,21) : new Date(post.posted_at).toString().slice(0,21) }</span>
        </div>
        ${
          post.user_id !== currentUser.uid ? '' : 
          '<span style="z-index: 1;"><i data-post-id="' 
          + post.post_id + 
          '" style="z-index: 0;" class="fa fa-trash delete-post" aria-hidden="true"></i></span>'
        }
      </div>
    `
    
    return postEl;
  }

  this.renderPosts = function() {
    postHolder.innerHTML = '';
    const reversePosts = this.posts.reverse();
    for (const post of reversePosts) {
      const link = getProfilePic(post.user_id);
      console.log(link);
      const postEl = this.createPostElement(post, link.i);
      postHolder.appendChild(postEl);
      applyListeners();

    }
  }
}

function applyListeners() {
  const removePostButtons = document.querySelectorAll('.delete-post');
  removePostButtons.forEach(btn => {
    btn.addEventListener('click', deletePost);
  });
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
    return url;
  })
}

function deletePost(e) {
  const postId = e.target.dataset.postId;
  if (confirm('Really delete post?')) {
    firebase.database().ref('/posts/' + postId).remove();
    e.target.parentElement.parentElement.parentElement.remove()
  }
}
