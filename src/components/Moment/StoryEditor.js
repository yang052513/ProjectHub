import React, { useState } from 'react'
import firebase from 'firebase'
import Progress from '../Common/Progress'

export default function StoryEditor(props) {
  const db = firebase.firestore()
  const storageRef = firebase.storage().ref()

  const [loading, setLoading] = useState(false)
  const [post, setPost] = useState('')
  const [picture, setPicture] = useState('')
  const [pictureInfo, setPictureInfo] = useState({
    Status: false,
    Name: '',
  })
  const date = new Date()
  let month
  switch (date.getMonth()) {
    case 0:
      month = 'Jan'
      break
    case 1:
      month = 'Feb'
      break
    case 2:
      month = 'Mar'
      break
    case 3:
      month = 'Apr'
      break
    case 4:
      month = 'May'
      break
    case 5:
      month = 'June'
      break
    case 6:
      month = 'July'
      break
    case 7:
      month = 'Aug'
      break
    case 8:
      month = 'Sep'
      break
    case 9:
      month = 'Oct'
      break
    case 10:
      month = 'Nov'
      break
    case 11:
      month = 'Dec'
      break
  }

  const currentTime = `${date.getHours()}:${
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  } ${month} ${
    date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  },${date.getFullYear()}`

  const handleMoment = () => {
    if (post !== '') {
      firebase.auth().onAuthStateChanged((user) => {
        db.collection('moment')
          .add({
            Author: props.profile.profileName,
            Time: currentTime,
            Content: post,
            Like: 0,
            Comments: {},
            Avatar: props.avatar,
            UserId: user.uid,
            Picture: picture,
          })
          .then((docRef) => {
            db.collection('moment').doc(docRef.id).update({
              Key: docRef.id,
            })
          })
      })

      props.toggle()
    } else {
      alert('说点什么吧')
    }
  }

  const handleContent = (event) => {
    setPost(event.target.value)
  }

  const handleImage = (event) => {
    setLoading(true)
    let file = document.getElementById(event.currentTarget.id).files[0]
    let metadata = {
      contentType: file.type,
    }

    let task = storageRef.child(file.name).put(file, metadata)
    task
      .then((snapshot) => snapshot.ref.getDownloadURL())
      .then((url) => {
        setPicture(url)
        console.log('朋友圈图片上传成功 链接为: ' + url)
        setLoading(false)
        setPictureInfo({
          Status: true,
          Name: file.name,
        })
      })
  }

  return (
    <div>
      {loading ? <Progress /> : null}
      <div onClick={props.toggle} className="overlay-post"></div>
      <div className="moment-editor-container">
        <div className="moment-editor-textarea">
          <img src="images/user.jpg" width="50px" height="50px" />
          <textarea
            onChange={handleContent}
            placeholder="What's happening?"
          ></textarea>
        </div>

        <div className="moment-editor-social">
          <button onClick={handleMoment}>Post</button>
          <input onChange={handleImage} type="file" id="image-input" />
          <label htmlFor="image-input">
            <i className="far fa-image"></i>
          </label>

          <i className="far fa-laugh"></i>

          {pictureInfo.Status ? <p>{pictureInfo.Name}</p> : null}
        </div>
      </div>
    </div>
  )
}
