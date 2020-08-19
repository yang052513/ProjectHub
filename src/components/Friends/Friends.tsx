import React, { useState, useEffect } from 'react'

import * as firebase from 'firebase/app'
import 'firebase/firestore'

import { FriendCard } from './FriendCard'
import { Loading } from '../shared/Loading'
import { CSSTransition } from 'react-transition-group'

export const Friends: React.FC = () => {
  const [user, setUser] = useState<Array<object | null | undefined>>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchFriends = () => {
    firebase
      .firestore()
      .collection('friends')
      .get()
      .then(friendQuery => {
        friendQuery.forEach(doc => {
          setUser(prevUser => [...prevUser, doc.data()])
        })
        setLoading(false)
      })
  }
  useEffect(fetchFriends, [])

  const userList = user.map((user: any) => (
    <FriendCard
      key={user.Key}
      userId={user.Key}
      avatar={user.avatar}
      info={user.profile}
    />
  ))

  return (
    <div className="component-layout friend-container">
      {loading && <Loading />}
      <CSSTransition
        in={!loading}
        timeout={500}
        classNames="fade-in"
        unmountOnExit
      >
        <div className="friend-card-list">{userList}</div>
      </CSSTransition>
    </div>
  )
}
