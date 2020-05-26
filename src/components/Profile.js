import React from "react"
import firebase from "firebase"

function Profile() {
  return (
    <div className="component-layout">
      <button onClick={() => firebase.auth().signOut()}>退出</button>
    </div>
  )
}

export default Profile
