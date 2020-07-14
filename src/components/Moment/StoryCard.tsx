import React, { useState, useEffect } from 'react'
import { StorySocial } from './StorySocial'
import firebase from 'firebase'

interface Props {
  avatar: string
  name: string
  time: string
  content: string
  picture: string | null | any
  like: number
  comment: object | null | undefined
  docRef: string
  userId: string
}

export const StoryCard: React.FC<Props> = ({
  docRef,
  avatar,
  name,
  time,
  content,
  picture,
  like,
  comment,
}) => {
  const db = firebase.firestore()
  const [likeCnt, setLikeCnt] = useState<number>(like)

  const likePost = () => {
    setLikeCnt(prevState => prevState + 1)
  }

  useEffect(() => {
    db.collection('moment').doc(docRef).update({
      Like: likeCnt,
    })
  }, [likeCnt])
  return (
    <div className="moment-story-card-container">
      <img className="moment-story-user" src={avatar} alt="" />
      <div>
        <p className="moment-story-name">
          {name}
          <span className="moment-story-time"> @{time}</span>
        </p>
        <p className="moment-story-content">{content}</p>
        {picture === '' ? null : (
          <img className="moment-story-image" src={picture} alt="" />
        )}
        <StorySocial like={likeCnt} comment={comment} likePost={likePost} />
      </div>
    </div>
  )
}
