const usernameDisplay = document.getElementById('username');
const userPostCountDisplay = document.getElementById('user-post-count')
const postHolder = document.getElementById('post-holder');
const uploadButtonContainer = document.getElementById('upload-profile-pic');
const profilePic = document.getElementById('profile-pic');
const progressBar = document.getElementById('progress-bar');
const optionsMenuButton = document.getElementById('options-menu-button');
const closeOptionsButton = document.getElementById('close-menu');
const optionsMenu = document.getElementById('options-menu');
const changeProfilePic = document.getElementById('change-profile-pic-button');
// const changeUsername = document.getElementById('change-username-input');
const uploadField = document.getElementById('file');
const Posts = new PostManager();
let isUserProfilePage = false;


uploadField.addEventListener('change', uploadProfilePic);
optionsMenuButton.addEventListener('click', openOptionsMenu);
closeOptionsButton.addEventListener('click', closeOptionsMenu);
// changeUsername.addEventListener('keyup', onChangeUsername);

function uploadProfilePic(e) {
  const file = this.files[0];
  const user = firebase.auth().currentUser;
  const storageRef = firebase.storage().ref(currentUser.uid + '/profilePicture/profile');
  const task = storageRef.put(file);
  progressBar.classList.add('bar-visible');

  task.on('state_changed',
    function progress(snapshot) {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressBar.value = percentage;
    },
    function error(err) {
      console.log(err);
    },
    function complete() {
      console.log('Upload complete');
      closeOptionsMenu();
      progressBar.classList.remove('bar-visible');
      getProfilePic(currentUser.uid, profilePic);
    }
  )
}

// function onChangeUsername(e) {
//   console.log(this.value);
//   if (e.keyCode === 13) {
//     e.preventDefault();
//     if (confirm(`Change username to ${this.value}?`)) {
//       const username = this.value
//       firebase.auth().onAuthStateChanged(function(user) {
        
//         user.updateProfile({
//           displayName: username
//         }).then((e) => {
//           console.log('changed');
//           this.value = 'Username changed!'
//           this.blur();
//           console.log(user.displayName);
//         }, (err) => {
//           console.log(err);
//         })
//       });
//     }
//   }
// }

function placeOptionsButton() {
  if (getParameterByName('user') === currentUser.uid || !getParameterByName('user')) {
    optionsMenuButton.innerHTML = `<i class="fa fa-cog" aria-hidden="true"></i>`;
  } 
}

function openOptionsMenu() {
  optionsMenu.style.display = 'flex';
}

function closeOptionsMenu() {
  optionsMenu.style.display = 'none';
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getUserPosts(uid) {
  if (!uid) {
    const uid = firebase.auth().currentUser.uid;
  }
  const postArray = [];
  db.ref('/posts/').once('value')
  .then(function(snapshot) {
    snapshot.forEach(el => {
      const post = el.val();
      if (post.user_id === uid) {
        post.post_id = el.key;
        postArray.push(post);
        Posts.addPost(post);
        usernameDisplay.innerText = post.name;
      }
    });
    Posts.renderPosts();
    userPostCountDisplay.innerText = 'Posts: ' + postArray.length; 
    return postArray;
  })
}


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    currentUser = user;
    if (getParameterByName('user')) {
      getUserPosts(getParameterByName('user'));
      getProfilePic(getParameterByName('user'), profilePic);
      isUserProfilePage = false;
    } else {
      getUserPosts(firebase.auth().currentUser.uid);
      getProfilePic(firebase.auth().currentUser.uid, profilePic);
      usernameDisplay.innerText = firebase.auth().currentUser.displayName;
      isUserProfilePage = true;
    }
  } else {
    console.log('No user logged in.');
    location.pathname = baseURL + 'login.html';
  }
  console.log(isUserProfilePage);

  if (isUserProfilePage === true) {
    //placeUploadButton();
    placeOptionsButton();
  }
  
});

