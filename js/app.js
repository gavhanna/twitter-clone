const navButton = document.getElementById('nav-button');
const nav = document.querySelector('.nav-items');
const closeNav = document.getElementById('close-nav-area');
const logoutButton = document.getElementById('log-out');
const db = firebase.database();
let userProfileLink;
let currentUser;

const baseURL = '/';

closeNav.addEventListener('click', navOpen);
navButton.addEventListener('click', navOpen);
logoutButton.addEventListener('click', signOut);

function PostManager() {
  this.posts = [];

  this.addPost = function(post) {
    this.posts.push(post);
  }

  this.createPostElement = function(post, profilePicLink) {
    const postEl = document.createElement('div');
    postEl.className += 'post';
    const commentCount = Object.size(post.comments);
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
          <div class="info">
            <span class="small">${new Date(post.posted_at) == 'Invalid Date' ? new Date().toString().slice(0,21) : new Date(post.posted_at).toString().slice(0,21) }</span>
            <span class="small comments-count">${post.comments ? commentCount : 0} comments</span>
          </div>
        </div>
        ${
          post.user_id !== currentUser.uid ? '' : 
          '<span style="z-index: 1;"><i data-post-id="' 
          + post.post_id + 
          '" style="z-index: 0;" class="fa fa-trash delete-post" aria-hidden="true"></i></span>'
        }
      </div>
    `

    const commentEl = document.createElement('div');
    commentEl.className += "comments-wrapper";
    commentEl.id = post.post_id;
    postEl.appendChild(commentEl);
    if (post.comments) {
      let commentsTotal = 0;

      for (let comment in post.comments) {
        if (post.comments.hasOwnProperty(comment)) {
          commentsTotal++;
          const com = post.comments[comment];
          const comEl = this.createCommentElement(post.post_id, com);
          commentEl.appendChild(comEl);
        }
      }
    }

    const commentInput = document.createElement('div');
    commentInput.classList += "comment-input";
    commentInput.innerHTML = `
      <form class="comment-form" data-post-id="${post.post_id}">
        <textarea rows="1" name="comment-input" placeholder="What do you think?"></textarea>
        <button type="submit" class="comment-submit"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
      </form>
    `;
    postEl.appendChild(commentInput);
    return postEl;
  }

  this.createCommentElement = function(postId, com) {
    const comEl = document.createElement('div');
    comEl.classList += 'comments';
    comEl.innerHTML = `
      <div class="comment-left">
        <a href="profile.html?user=${postId}">
          <img src="${userProfileLink}" class="comment-profile">
        </a>
      </div>
      <div class="comment-right">
        <h6>${com.username}</h6>
        <p>${com.content}</p>
        <span class="small">${new Date(com.posted_at) == 'Invalid Date' ? new Date().toString().slice(0,21) : new Date(com.posted_at).toString().slice(0,21) }</span>
      </div>
    `;
    return comEl;
  }

  this.renderPosts = function() {
    postHolder.innerHTML = '';
    const reversePosts = this.posts.reverse();
    for (const post of reversePosts) {
      const link = getProfilePic(post.user_id);
      const postEl = this.createPostElement(post, link.i);
      postHolder.appendChild(postEl);
      applyListeners();

    }
  }
}

function signOut() {
  firebase.auth().signOut().then(function() {
    console.log('Logged out.');
    window.location.pathname = baseURL +  "login.html";
  }).catch(function(error) {
    console.log('Error logging out:', error);
  });
}

function applyListeners() {
  const removePostButtons = document.querySelectorAll('.delete-post');
  const commentSubmitButtons = document.querySelectorAll('.comment-submit');
  const commentSubmitForms = document.querySelectorAll('.comment-form')
  // commentSubmitButtons.forEach(btn => {
  //   btn.addEventListener('click', submitComment);
  // });
  commentSubmitForms.forEach(btn => {
    btn.addEventListener('submit', submitComment);
  });
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


function sendComment(postId, comment) {
  const data = db.ref('posts').child(postId).child('comments').push(comment);
  const newComment = Posts.createCommentElement(postId, comment);
  const parentPost = document.getElementById(postId);
  console.log(parentPost);
  parentPost.appendChild(newComment);
  
  
  //applyListeners();
}

function submitComment(e) {
  e.preventDefault();
  let commentText = e.path[0][0].value;
  const postId = e.target.dataset.postId;
  

  if (commentText !== '') {
    const pLink = getProfilePic(currentUser.uid);
    pLink.then(link => {
      const newComment = {
        username: currentUser.displayName, 
        content: commentText,
        user_id: currentUser.uid,
        posted_at: firebase.database.ServerValue.TIMESTAMP,
        user_profile_url: link
      };
      sendComment(postId, newComment);
      const commentCountEl = document.querySelector('.comments-count');
      commentCountEl.innerText = parseInt(commentCountEl.innerText[0]) + 1 + ' comments';
      const textareas = document.querySelectorAll('textarea');
      textareas.forEach(el => {
        el.value = '';
      })
    });    
  } else {
    postContent.placeholder = `${currentUser.displayName.split(' ')[0]}, you didn't blab about anything...`;
    setTimeout(() => {
      postContent.focus();
    }, 100);
  }
  return;
  
} 

// for getting length of object
Object.size = function(obj) {
  var size = 0, key;
  for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
