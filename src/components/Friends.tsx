import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import { FriendCard } from './Friends/FriendCard'
import { Loading } from './Common/Loading'
import { useFetch } from './Hooks/useFetch'

export const Friends: React.FC = () => {
  const [user, setUser] = useState<Array<object | null | undefined>>([])
  const db = firebase.firestore()
  const [loading, setLoading] = useState<boolean>(true)

  const fetchFriends = () => {
    db.collection('friends')
      .get()
      .then(friendQuery => {
        friendQuery.forEach(doc => {
          setUser(prevUser => [...prevUser, doc.data()])
        })
        setLoading(false)
      })
  }
  useEffect(fetchFriends, [])

  const test = useFetch('friends')
  console.log(test)

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
      <p>Appreciate for everyone who uses Projecthub!</p>
      {loading ? (
        <Loading />
      ) : (
        <div className="friend-card-list">{userList}</div>
      )}
    </div>
  )
}
