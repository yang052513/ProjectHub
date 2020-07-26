import React from 'react'
import firebase from 'firebase'

interface Props {
  queueData: any
  queueRef: string
  creatorRef: string
  contributorList: any
  capacity: any
}

export const GroupQueue: React.FC<Props> = ({
  queueData,
  queueRef,
  creatorRef,
  contributorList,
  capacity,
}) => {
  const handleAccept = (userRef: any) => {
    let updatedList = contributorList
    updatedList[updatedList.length - capacity] = {
      Avatar: userRef.profile.avatar,
      Id: userRef.Key,
    }

    // 删除
    firebase
      .firestore()
      .collection('group')
      .doc(queueRef)
      .collection('Requests')
      .doc(userRef.Key)
      .delete()
      .then(() => {
        console.log('从公共项目列表中接受请求 并删除用户的requests')
      })

    firebase
      .firestore()
      .collection('group')
      .doc(queueRef)
      .update({
        Contributors: updatedList,
        Capacity: capacity - 1,
      })

    firebase
      .firestore()
      .collection('user')
      .doc(userRef.Key)
      .collection('Application')
      .doc(queueRef)
      .update({
        Result: 'Accepted',
      })
  }

  const queueList = queueData.map((queue: any) => (
    <div className="queue-item" key={Math.random() * 255}>
      <img src={queue.profile.avatar} alt="" />
      <p>
        <i className="far fa-user"></i>
        {queue.profile.profile.profileName}
      </p>
      <p>
        <i className="far fa-envelope"></i>
        {queue.profile.profile.profileEmail}
      </p>
      <p>
        <i className="fab fa-github"></i>
        {queue.profile.profile.profileGithub === ''
          ? 'Not Provided'
          : queue.profile.profile.profileGithub}
      </p>
      <button>Message</button>
      <button>Delete</button>
      <button onClick={() => handleAccept(queue)}>Accept</button>
    </div>
  ))
  return (
    <div className="group-queue-container">
      <h3>People Who Applied</h3>
      {queueList}

      <h3>当前已经有的成员</h3>

      <h3>当前的Team</h3>
      <p>只放头像</p>
    </div>
  )
}
