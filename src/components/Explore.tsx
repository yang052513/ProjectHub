import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import { ExploreProject } from './Explore/ExploreProject'
import { ExploreAuthor } from './Explore/ExploreAuthor'
import { ExploreTrending } from './Explore/ExploreTrending'

export const Explore: React.FC = () => {
  const [project, setProject] = useState<Array<object | null | undefined>>([])
  const [userList, setUserList] = useState<Array<object | null | undefined>>([])

  useEffect(() => {
    const fetchProject = () => {
      firebase
        .firestore()
        .collection('project')
        .get()
        .then(projectDoc => {
          projectDoc.forEach(doc => {
            setProject(prevProject => [...prevProject, doc.data()])
          })
        })

      firebase
        .firestore()
        .collection('friends')
        .get()
        .then(userDoc => {
          userDoc.forEach(doc => {
            setUserList(prevUser => [...prevUser, doc.data()])
          })
        })
    }
    fetchProject()
  }, [])

  return (
    <div className="component-layout explore-container">
      <ExploreAuthor />
      <ExploreProject projectData={project} />
      <ExploreTrending userData={userList} />
    </div>
  )
}
