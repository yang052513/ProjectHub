import firebase from 'firebase'
import { ProjectCard } from '../components/Home/ProjectCard'

// 更新用户申请项目的状态: Applied, Accepted, Rejected
export function updateApplication(
  userId: string,
  applicationId: string,
  status: string
) {
  firebase
    .firestore()
    .collection('user')
    .doc(userId)
    .collection('Application')
    .doc(applicationId)
    .update({
      Result: status,
    })
    .then(() => {
      console.log(`更新用户${userId}的申请状态为${status}`)
    })
    .catch(error => {
      console.log(`更新用户${userId}申请状态时出现异常，错误: ${error}`)
    })
}

// 从项目group集合中删除用户的请求
export function deleteRequest(requestId: string, userId: string) {
  firebase
    .firestore()
    .collection('group')
    .doc(requestId)
    .collection('Requests')
    .doc(userId)
    .delete()
    .then(() => {
      console.log(`删除${userId}请求成功`)
    })
    .catch(error => {
      console.log(`删除用户${userId}的请求时出现异常 错误: ${error}`)
    })
}
