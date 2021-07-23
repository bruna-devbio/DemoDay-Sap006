const database = firebase.firestore()
const storage = firebase.storage()

export const loginPage = (email,password) => {
  if (firebase.auth().currentUser){
      firebase.auth().signOut()
  }
  firebase
  .auth()
  .signInWithEmailAndPassword(email, password)
  .then(() => {
      alert("Login realizado")
      feed()
      setTimeout( () => {
          window.location.replace(feed)
      }, 1000)
  })
  .catch((error) => {
      const errorCode = error.code
      if(errorCode == "auth/user-not-found"){
          alert(`Usuário não encontrado`)
      }
      else if(errorCode == "auth/wrong-password"){
          alert("Senha invalida")
      }
      else if(errorCode == "auth/invalid-email"){
          alert("E-mail invalido")
      }
      else{
          alert(error.message)
      }
  })
}



export const signInHome = {
  loginPage: (feed) => {
      if (firebase.auth().currentUser){
          firebase.auth().signOut()
      }
      const email = document.getElementById("login-email").value
      const password = document.getElementById("login-password").value
      firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
          document.getElementById("root").innerHTML = feed;
          setTimeout( () => {
              window.location.replace("index.html")
          }, 1000)
      })
      .catch((error) => {
          const errorCode = error.code
          if(errorCode == "auth/user-not-found"){
              document.getElementById("user-error").style.display = "block";
              document.getElementById("login-email").style.border = "1px solid red";
              document.getElementById("login-password").style.border = "1px solid red";
          }
          else if(errorCode == "auth/invalid-email"){
            document.getElementById("login-email").style.border = "1px solid red";
            document.getElementById("email-error").innerHTML = "E-mail inválido";
          }
          else if(errorCode == "auth/wrong-password"){
            document.getElementById("login-password").style.border = "1px solid red";
            document.getElementById("password-error").innerHTML = "Senha inválida";
          }
          else{
              alert(error.message)
          }
      })
   }
  }

export const createUser = async(email, password) =>{
  await firebase
  .auth()
  .createUserWithEmailAndPassword(email, password)

}

export const currentUser = () =>{
  const user = firebase.auth().currentUser;
  return user
}

export const getUser = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if(user){
      console.log(user)
      return user.uid

    }else{
      setTimeout(()=>{
        window.location.replace("./index.html")
      },1000)

    }
  })
}

export const asyncGetProfileData = async () => {
  const logProfiles = await database.collection("profiles").get()
  for ( data of logProfiles.docs){
    profile = {
      name: document.id,
      image: document.image
    }
    console.log(profile)
  }
}

export const asyncSendProfileData= async (name, image) => {
  await database.collection("profiles").add({
    name:name,
    image:image,
  })
  console.log("deu certo")
}

export const signInGoogleAccount = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase
    .auth()
    .signInWithPopup(provider)
    .then(() => {
      alert("Login realizado")
  })
  .catch((error) => {
      const errorCode = error.code
     if(errorCode == "auth/invalid-email"){
        alert("E-mail invalido")
      }
      else{
        alert(error.message)
      }
  })
  
}
/*
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    .then((result) => {
    //@type {firebase.auth.OAuthCredential} 
    var credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  })
  .catch((error) => {
    
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
*/

 
export const signOut = () => {
  firebase
  .auth()
  .signOut()
  /*
  .then(() => {
    // Sign-out successful.
  }).catch((error) => {
    swal.fire({
      icon: "error",
      title: error.message,
    })// An error happened.
  });
 */
}
export const uploadImage = (id, userid) =>{
  const ref = storage.ref()
  const file = document.getElementById(id).files[0]
  const imageName = userid
  const metadata = {
    contentType:file.type,
  }

  ref.child(imageName).put(file, metadata)

  // uploading
  // .then(snapshot => snapshot.ref.getDownloadURL())
  // .then (url => {
  //   const urlImage = url
  //   alert("Imagem enviada com sucesso")
  //   return urlImage
  // })

}

export const getURLImage = (imageName) => {
  storage.ref().child(imageName).getDownloadURL()
  .then((url)=> {
    return url
  })

  .catch((error) => {
  switch (error.code) {
    case 'storage/object-not-found':
      // File doesn't exist
      break;

    case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;

    case 'storage/canceled':
      // User canceled the upload
      break;

    case 'storage/unknown':
      // Unknown error occurred, inspect the server response
      break;
  }
});
}
