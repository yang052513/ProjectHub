import React from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase'

interface Props {
  notificationData: any
}

export const NavigationNotificationModalItem: React.FC<Props> = ({
  notificationData,
}) => {
  const user: any = firebase.auth().currentUser

  const handleRead = (ref: string) => {
    firebase
      .firestore()
      .collection('user')
      .doc(user.uid)
      .collection('Notification')
      .doc(ref)
      .update({
        Unread: false,
      })
  }

  return (
    <Link
      to={notificationData.Redirect}
      onClick={() => handleRead(notificationData.Key)}
    >
      <div className="notification-item">
        <img src={notificationData.Avatar} alt="" />
        <div className="notification-item-text">
          <p className="notification-item-category">
            New {notificationData.Category}
          </p>

          <p className="notification-item-msg">{notificationData.Message}</p>
          <p className="notification-item-time">{notificationData.Date}</p>
        </div>
      </div>
    </Link>
  )
}
