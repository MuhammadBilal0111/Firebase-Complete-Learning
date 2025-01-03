import "./App.css";
import { useRef } from "react";
import { app, database } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import {
  signInWithPopup,
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  const usernameElement = useRef();
  const emailElement = useRef();
  const passwordElement = useRef();
  const IdElement = useRef();
  const auth = getAuth();
  const collectionRef = collection(database, "user");
  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState({});
  const googleAuthProvider = new GoogleAuthProvider();
  const emailQuery = query(
    collectionRef,
    where("email", "==", "m.bilal0111@gmail.com")
  );

  googleAuthProvider.setCustomParameters({
    prompt: "select_account", // always the popup open either you're sign in or not
  });

  const UpdateData = (e) => {
    setUpdateData({ ...updateData, [e.target.id]: e.target.value });
  };
  // function to add data in firebase
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(emailElement.current.value, passwordElement.current.value);
    const newObject = {
      username: usernameElement.current.value,
      email: emailElement.current.value,
      password: passwordElement.current.value,
    };
    addDoc(collectionRef, newObject)
      .then(() => {
        alert("Data added successfully");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  // function to get all data from firebase
  const handleFetchData = () => {
    getDocs(collectionRef)
      .then((response) => {
        setData(
          response.docs.map((item) => {
            return { id: item.id, ...item.data() };
          })
        );
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  // function to get delete data from firebase
  const handleDeleteData = () => {
    const itemToDelete = doc(database, "user", IdElement.current.value);
    deleteDoc(itemToDelete)
      .then(() => {
        alert("Data deleted successfully");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  // function to get update data from firebase
  const handleUpdateData = () => {
    const itemToUpdate = doc(database, "user", IdElement.current.value);
    updateDoc(itemToUpdate, updateData)
      .then(() => {
        alert("Data updated successfully");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  // function to handle the real time update on firebase

  const getRealtimeData = () => {
    onSnapshot(collectionRef, (data) => {
      setData(
        data.docs.map((item) => {
          return { id: item.id, ...item.data() };
        })
      );
    });
  };
  // function to handle the google authentication service
  const handleGoogleAuth = () => {
    signInWithPopup(auth, googleAuthProvider)
      .then((response) => {
        console.log(response.user);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  // function to handle the create user with email and password
  const handleCreateUserWithEmailAndPassword = () => {
    createUserWithEmailAndPassword(
      auth,
      emailElement.current.value,
      passwordElement.current.value
    )
      .then((response) => {
        console.log(response.user);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  // function to handle the signin with email and password service
  const handleSignInWithEmailAndPassword = () => {
    signInWithEmailAndPassword(
      auth,
      emailElement.current.value,
      passwordElement.current.value
    )
      .then((response) => {
        console.log(response.user);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  // query data

  // function to handle the signOut
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        alert("logout successfull");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  // function that is used to access the querydata
  const getQueryData = () => {
    onSnapshot(emailQuery, (data) => {
      console.log(
        data.docs.map((item) => {
          return { id: item.id, ...item.data() };
        })
      );
    });
  };
  getQueryData();
  useEffect(() => {
    getRealtimeData();
  }, []);
  useEffect(() => {
    onAuthStateChanged(auth, (data) => {
      if (data) {
        alert("Logged in");
      } else {
        alert("logged out");
      }
    });
  }, []);
  console.log(data);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <input
          type="text"
          placeholder="Enter User Name"
          ref={usernameElement}
        />
        <input type="email" placeholder="Enter Email" ref={emailElement} />
        <input
          type="password"
          placeholder="Enter Passwword"
          ref={passwordElement}
        />
        <button type="submit">Submit</button>
      </form>

      <h3>Or</h3>
      <button type="button" onClick={handleGoogleAuth}>
        Sign In With Google
      </button>
      {/* Sign In with email and password */}
      <div className="">
        <input type="email" placeholder="Enter Email" ref={emailElement} />
        <input
          type="password"
          placeholder="Enter Passwword"
          ref={passwordElement}
        />
        <button type="button" onClick={handleCreateUserWithEmailAndPassword}>
          Create User With Email and Password
        </button>
        <button type="button" onClick={handleSignInWithEmailAndPassword}>
          Sign In With Email and Password
        </button>
        <button onClick={handleSignOut} type="button">
          Log out
        </button>
      </div>
      {/* ---------------------------------------------------------- */}
      <button type="button" onClick={handleFetchData}>
        Fetch all data
      </button>
      <div className="deleteContainer">
        <h1>Item to Delete or Update</h1>
        <input
          type="text"
          id="id"
          placeholder="Enter ID to Delete"
          ref={IdElement}
        />
        <input
          type="text"
          id="username"
          placeholder="Enter User Name"
          onChange={UpdateData}
        />
        <input
          type="email"
          id="email"
          placeholder="Enter Email"
          onChange={UpdateData}
        />
        <input
          type="password"
          id="password"
          placeholder="Enter Passwword"
          onChange={UpdateData}
        />
        <button className="deleteButton" onClick={handleDeleteData}>
          Delete
        </button>
        <button onClick={handleUpdateData}>Update</button>
      </div>
    </div>
  );
}

export default App;
