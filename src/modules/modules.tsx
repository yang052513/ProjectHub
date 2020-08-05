import firebase from 'firebase'
import { timeFormat } from 'current-time-format'

const { monthStrLong, day, hours, minutes } = timeFormat
const currentDay = `${monthStrLong} ${day} at ${hours}:${minutes}`
const activityTime = `${monthStrLong} ${day} ${hours}:${minutes}`

export function addNotification(
  userRef: string,
  message: string,
  category: string,
  redirect: string,
  avatar: string
) {
  const notificatonRef = firebase
    .firestore()
    .collection('user')
    .doc(userRef)
    .collection('Notification')

  notificatonRef
    .add({
      Unread: true,
      Message: message,
      Date: currentDay,
      Category: category,
      Redirect: redirect,
      Avatar: avatar,
    })
    .then(docRef => {
      notificatonRef.doc(docRef.id).update({
        Key: docRef.id,
      })
      console.log(`通知已经写入到用户数据库中${docRef.id}`)
    })
}

export function addActivity(
  userRef: string,
  content: string,
  category: string
) {
  firebase
    .firestore()
    .collection('user')
    .doc(userRef)
    .collection('Activity')
    .add({ Content: content, Category: category, Time: activityTime })
    .then(() => {
      console.log(`成功保存到活动面板中`)
    })
    .catch(error => {
      console.log(`保存活动状态时出错 ${error}`)
    })
}
