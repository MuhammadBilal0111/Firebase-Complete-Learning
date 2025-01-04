"use client";

import { useEffect, useState } from "react";
import { database } from "@/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/firebaseConfig";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [data, setData] = useState([]);
  const auth = getAuth(app);
  const collectionRef = collection(database, "user");

  const handleAdd = () => {
    addDoc(collectionRef, {
      name,
      age: Number(age),
    })
      .then(() => {
        alert("Data added successfully");
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  useEffect(() => {
    const fetchData = () => {
      onSnapshot(collectionRef, (response) => {
        setData(
          response.docs.map((item) => {
            return { id: item.id, ...item.data() };
          })
        );
      });
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        sessionStorage.removeItem("Token");
        router.push("/register");
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  const handleDelete = (id) => {
    const itemToDelete = doc(database, "user", id);
    deleteDoc(itemToDelete)
      .then((response) => {
        alert("Item deleted successfully");
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  const handleUpdate = (id) => {
    const itemToUpdate = doc(database, "user", id);
    updateDoc(itemToUpdate, {
      name,
      age: Number(age),
    })
      .then((response) => {
        alert("Item updated successfully");
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Enter Name and Age
          </h1>
          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Age
              </label>
              <input
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <button
              onClick={handleAdd}
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
            >
              Add
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white w-full bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-200"
            >
              Logout
            </button>
          </div>

          {/* Data List */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              List of Entries
            </h2>
            {data.length > 0 ? (
              <ul className="space-y-2">
                {data.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between px-4 py-2 bg-gray-100 rounded-md"
                  >
                    <span>{item.name}</span>
                    <span>{item.age} years</span>
                    <button
                      className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-red-200"
                      onClick={() => handleUpdate(item.id)}
                    >
                      Update
                    </button>
                    <button
                      className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-200"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No entries yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
