import React, { useContext, useState, useEffect } from 'react'
import { auth, db, provider } from "../firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { getAuth, signInAnonymously, signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, linkWithCredential, EmailAuthProvider } from "firebase/auth";

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    const [hasFolder, setHasFolder] = useState(false)


    function loginGoogle() {
        return signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          console.log(user)
        }).catch((error) => {
          console.log(error)
        });
    }

    function loginDemo() {
      return (
        signInAnonymously(auth)
        )
    }

    function upgradeDemo(email, password) {
      const credential = EmailAuthProvider.credential(email, password)
      return linkWithCredential(auth.currentUser, credential)
    }

    function logout() {
        return auth.signOut()
    }

     
     useEffect(() => {
         const unsubscribe = auth.onAuthStateChanged(user => {
           setCurrentUser(user)
           setLoading(false)
         })
    
         return unsubscribe
       }, [])

        //Check is user has a database folder. If not, creates one with their UID
      useEffect(() => {
       if(currentUser && !loading) {
         const checkFolder = async () => {
           const docRef = doc(db, "users", currentUser.uid);
           const docSnap = await getDoc(docRef);
           if (docSnap.exists()) {
             setHasFolder(true);
           } else {
              try {
                await setDoc(doc(db, "users", currentUser.uid), {
                    quizzes: [],
                    totalQuizzes: 0,
                    wins: 0
                  })
            } catch(error) {
                console.log(error)
            }
           }
         };
         checkFolder();
       }
      }, [currentUser]);
      
    const value = { 
        loading,
        currentUser,
        loginGoogle,
        loginDemo,
        logout,
        upgradeDemo,
        hasFolder
    }

  return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  )
}