import React, { useState, useEffect } from 'react'
import StoryEditor from './Moment/StoryEditor'
import StoryCard from './Moment/StoryCard'
import firebase from 'firebase'

export default function Moment(props) {
  const db = firebase.firestore()

  const [editor, setEditor] = useState(false)
  const [moment, setMoment] = useState([])
  const displayEditor = () => {
    setEditor(true)
  }

  const offEditor = () => {
    setEditor(false)
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      db.collection('moment')
        .orderBy('Time', 'desc')
        .get()
        .then((query) => {
          query.forEach((doc) => {
            setMoment((prevMoment) => [...prevMoment, doc.data()])
          })
        })
    })
  }, [])

  const momentList = moment.map((moment) => (
    <StoryCard
      key={moment.Key}
      docRef={moment.Key}
      userId={moment.UserId}
      avatar={moment.Avatar}
      name={moment.Author}
      time={moment.Time}
      content={moment.Content}
      picture={moment.Picture}
      like={moment.Like}
      comment={moment.Comments}
    />
  ))

  return (
    <div className="component-layout moment-container">
      {/* Display the moment editor container */}
      {editor ? (
        <StoryEditor
          profile={props.profile}
          avatar={props.avatar}
          toggle={offEditor}
        />
      ) : null}

      {/* Display all the moments from database */}
      <div className="moment-story-card-wrap">{momentList}</div>

      {/* Creat a new moment button */}
      <div className="post-moment-container">
        <i onClick={displayEditor} className="fas fa-feather"></i>
      </div>
    </div>
  )
}
