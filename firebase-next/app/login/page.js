"use client";
import { useEffect, useState } from "react";
import { app } from "@/firebaseConfig";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";

function Login() {
  const auth = getAuth(app);
  const googleServiceProvider = new GoogleAuthProvider();
  googleServiceProvider.setCustomParameters({ prompt: "select_account" });
  const githubServiceProvider = new GithubAuthProvider();
  githubServiceProvider.setCustomParameters({ prompt: "select_account" });
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleEmailWithPasswordSignUp = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.push("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  const handleGoogleSignUp = () => {
    signInWithPopup(auth, googleServiceProvider)
      .then(() => {
        router.push("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const handleGithubSignUp = () => {
    signInWithPopup(auth, githubServiceProvider)
      .then(() => {
        router.push("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  useEffect(() => {
    let token = sessionStorage.getItem("Token");
    if (token) {
      router.push("/");
    }
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign In
        </h2>

        {/* Email and Password Sign-Up Form */}
        <form className="space-y-4" onSubmit={handleEmailWithPasswordSignUp}>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Sign In with Email
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center space-x-2 text-gray-400">
          <hr className="w-full border-gray-300" />
          <span>OR</span>
          <hr className="w-full border-gray-300" />
        </div>

        {/* Google Sign-Up Button */}
        <button
          onClick={handleGoogleSignUp}
          className="w-full px-4 py-2 font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-200"
        >
          Sign In with Google
        </button>
        <button
          onClick={handleGithubSignUp}
          className="w-full px-4 py-2 font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-red-200"
        >
          Sign In with Github
        </button>
      </div>
    </div>
  );
}

export default Login;
