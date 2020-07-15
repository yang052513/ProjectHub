import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import { Comment } from './Comment'
import { timeFormat } from 'current-time-format'
import { Feedback } from '../Common/Feedback'

interface Props {
  docRef?: string
  hideComment: () => void
}

const { year, monthStrShort, day, hours, minutes } = timeFormat

export const StoryComment: React.FC<Props> = ({ docRef, hideComment }) => {
  const user: any = firebase.auth().currentUser
  const db = firebase.firestore()
  const [currUserInfo, setCurrUserInfo] = useState<any>({
    name: '',
    id: '',
    avatar: '',
  })

  const [commentText, setCommentText] = useState<string>('')
  const [commentList, setCommentList] = useState<any>([])

  const commentRef = db.collection('moment').doc(docRef).collection('Comments')

  useEffect(() => {
    db.collection('user')
      .doc(user.uid)
      .collection('Setting')
      .doc('Profile')
      .get()
      .then((doc: any) => {
        setCurrUserInfo({
          name: doc.data().profile.profileName,
          id: user.uid,
          avatar: doc.data().avatar,
        })
      })

    commentRef.get().then(docs => {
      docs.forEach(document => {
        setCommentList((prevComment: any) => [...prevComment, document.data()])
      })
    })
  }, [])

  const handleInput = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCommentText(event.target.value as string)
  }

  const sumbitComment = () => {
    firebase.auth().onAuthStateChanged((user: any) => {
      db.collection('moment')
        .doc(docRef)
        .collection('Comments')
        .add({
          UserName: currUserInfo.name,
          UserId: currUserInfo.id,
          UserAvatar: currUserInfo.avatar,
          CommentBody: commentText,
          CommentDate: `${monthStrShort} ${day}, ${year} ${hours}:${minutes}`,
        })
        .then(commentRef => {
          db.collection('moment')
            .doc(docRef)
            .collection('Comments')
            .doc(commentRef.id)
            .update({
              CommentId: commentRef.id,
            })
        })
    })
  }
  console.log(commentList)
  return (
    <div>
      <div onClick={hideComment} className="overlay-post"></div>

      <div className="story-comment-container">
        <div className="comment-list-container">
          <h3>Comments</h3>
          {commentList.map((comment: any) => (
            <Comment
              userId={comment.UserId}
              userName={comment.UserName}
              userAvatar={comment.UserAvatar}
              commentBody={comment.CommentBody}
              key={comment.CommentId}
              commentId={comment.CommentId}
              commentDate={comment.CommentDate}
            />
          ))}
          <div className="write-comment-container">
            <input
              type="text"
              onChange={handleInput}
              placeholder="Write your comments..."
            />
            <button onClick={sumbitComment}>Post</button>
          </div>
        </div>
      </div>
    </div>
  )
}
