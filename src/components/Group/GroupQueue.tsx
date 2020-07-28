import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import { GroupQueueItem } from './GroupQueueItem'
import { Feedback } from '../Common/Feedback'
import { Progress } from '../Common/Progress'
import { setPriority } from 'os'
import { useHistory } from 'react-router-dom'

interface Props {
  queueData: any
  queueRef: any
  contributorList: any
  capacity: any
}

export const GroupQueue: React.FC<Props> = ({
  queueData,
  queueRef,
  contributorList,
  capacity,
}) => {
  const [team, setTeam] = useState<any>([])
  const history = useHistory()
  const [feedback, setFeedback] = useState<any>({
    show: false,
    msg: '',
    info: '',
  })
  const [progress, setProgress] = useState<boolean>(false)

  const handleReload = () => {
    window.location.reload()
  }

  const fetchContributorProfile = () => {
    contributorList.forEach((contributor: any, index: any) => {
      if (contributor.Id !== 'None' && index > 0) {
        firebase
          .firestore()
          .collection('user')
          .doc(contributor.Id)
          .collection('Setting')
          .doc('Profile')
          .get()
          .then(doc => {
            let profile: any = doc.data()
            const profileData = {
              Key: contributor.Id,
              profile: profile,
            }
            setTeam((prevTeam: any) => [...prevTeam, profileData])
          })
      }
    })
  }

  useEffect(fetchContributorProfile, [])

  const handleAccept = (userRef: any) => {
    setProgress(true)

    setTimeout(() => {
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

      setProgress(false)
      setFeedback({
        show: true,
        msg: 'Added Successfully',
        info: `${userRef.profile.profile.profileName} has been added to your team`,
      })
    }, 1000)
  }

  //从Application和Request中删除
  const handleDelete = (userRef: any) => {
    firebase
      .firestore()
      .collection('group')
      .doc(queueRef)
      .collection('Requests')
      .doc(userRef.Key)
      .delete()
    firebase
      .firestore()
      .collection('user')
      .doc(userRef.Key)
      .collection('Application')
      .doc(queueRef)
      .update({
        Result: 'Rejected',
      })
  }

  //用户已经加入了队伍 要把contributor里改为None 然后Application中改为rejected
  const handleDeleteContributor = (contributorKey: any) => {
    setProgress(true)

    setTimeout(() => {
      let updated_contributorList = contributorList
      updated_contributorList.forEach(
        (contributor: any, index: string | number) => {
          if (contributor.Id === contributorKey) {
            updated_contributorList[index] = { Avatar: 'None', Id: 'None' }
          }
        }
      )
      // 更新contributor list
      firebase
        .firestore()
        .collection('group')
        .doc(queueRef)
        .update({
          Contributors: updated_contributorList,
          Capacity: capacity + 1,
        })

      // 从该用户的application中改为rejected
      firebase
        .firestore()
        .collection('user')
        .doc(contributorKey)
        .collection('Application')
        .doc(queueRef)
        .update({
          Result: 'Rejected',
        })

      setProgress(false)
      setFeedback({
        show: true,
        msg: 'Delete Success',
        info: 'Delete user from your team successfully',
      })
    }, 1000)
  }

  const queueList = queueData.map((queue: any) => (
    <GroupQueueItem
      key={queue.Key}
      userRef={queue.Key}
      avatar={queue.profile.avatar}
      username={queue.profile.profile.profileName}
      email={queue.profile.profile.profileEmail}
      github={queue.profile.profile.profileGithub}
      handleDelete={() => handleDelete(queue)}
      handleAccept={() => handleAccept(queue)}
    />
  ))

  const teamList = team.map((queue: any) => (
    <GroupQueueItem
      key={queue.Key}
      isTeam={true}
      userRef={queue.Key}
      avatar={queue.profile.avatar}
      username={queue.profile.profile.profileName}
      email={queue.profile.profile.profileEmail}
      github={queue.profile.profile.profileGithub}
      handleDelete={() => handleDeleteContributor(queue.Key)}
      handleAccept={() => handleAccept(queue)}
    />
  ))

  const teamStatusList = contributorList.map((contributor: any, index: any) => {
    if (contributor.Id !== 'None') {
      if (index === 0) {
        return (
          <div key={contributor.Id} className="group-queue-contributor">
            <img src={contributor.Avatar} alt="" />
            <p className="group-list-result">Owner</p>
          </div>
        )
      }

      return (
        <div key={contributor.Id} className="group-queue-contributor">
          <img src={contributor.Avatar} alt="" />
          <p className="group-list-result">Contributor</p>
        </div>
      )
    }
  })

  return (
    <div>
      <div className="group-queue-container">
        <h3>People Who Applied</h3>
        {queueList.length > 0 ? (
          queueList
        ) : (
          <p className="group-no-result">No one applied yet</p>
        )}

        <h3>Team List</h3>
        {teamList.length > 0 ? (
          teamList
        ) : (
          <p className="group-no-result">No one in your team right now</p>
        )}

        <h3>Team Status</h3>
        <div className="group-queue-team-status-container">
          {teamStatusList}
        </div>
      </div>

      {progress && <Progress />}
      {feedback.show && (
        <Feedback
          msg={feedback.msg}
          info={feedback.info}
          imgUrl="/images/emoji/emoji_happy.png"
          toggle={handleReload}
        />
      )}
    </div>
  )
}
