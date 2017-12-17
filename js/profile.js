const usernameDisplay = document.getElementById('username');
const userPostCountDisplay = document.getElementById('user-post-count')
const postHolder = document.getElementById('post-holder');
const uploadButtonContainer = document.getElementById('upload-profile-pic');
const profilePic = document.getElementById('profile-pic');
const progressBar = document.getElementById('progress-bar');
let uploadField;

const Posts = new PostManager();


//
let isUserProfilePage = false;


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
      progressBar.classList.remove('bar-visible');
      getProfilePic(currentUser.uid, profilePic);
      uploadButtonContainer.innerHTML = "Done!";
      setTimeout(() => {
        uploadButtonContainer.innerHTML = `
        <input type="file" name="file" id="file" class="inputfile" />
        <label for="file"><i class="fa fa-upload" aria-hidden="true"></i> Upload Profile Pic</label>
      <progress class="progress-bar" value="0" max="100" id="progress-bar">0%</progress>   `;
      }, 2000);
    }
  )
}

function placeUploadButton() {
  const uploadInput = `
    <input type="file" name="file" id="file" class="inputfile" />
    <label for="file"><i class="fa fa-upload" aria-hidden="true"></i></label>`;
  if (getParameterByName('user') === currentUser.uid || !getParameterByName('user')) {
    uploadButtonContainer.innerHTML = uploadInput;
    uploadField = document.getElementById('file');
    uploadField.addEventListener('change', uploadProfilePic);
  } 
  
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
    placeUploadButton();
  }
  
});

