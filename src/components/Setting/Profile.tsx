import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { Progress } from '../Common/Progress'
import { Feedback } from '../Common/Feedback'
import { Loading } from '../Common/Loading'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      marginTop: '10px',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: '40ch',
    },
  })
)

const inputMargin = {
  margin: '12px 8px',
}

const profileInit = {
  profileName: '',
  profileLocation: '',
  profileEmail: '',
  profileBio: '',
  profileWeb: '',
  profilelinkedin: '',
  profileGithub: '',
}

interface Props {
  avatar: any
}

//Profile的信息从App用props传 直接在数据库更改
export const Profile: React.FC<Props> = ({ avatar }) => {
  const classes = useStyles()
  const user = firebase.auth().currentUser
  const db = firebase.firestore()
  const storageRef = firebase.storage().ref()

  const [launch, setLaunch] = useState(true)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(false)
  const [error, setError] = useState(false)

  const [profile, setProfile] = useState<any>({})
  // const [avatar, setAvatar] = useState(avatar)

  function handleTextField(event: { target: { name: any; value: any } }) {
    const { name, value } = event.target
    setProfile((prevProfile: any) => ({
      ...prevProfile,
      [name]: value,
    }))
  }

  //Handle Image Upload Task
  const handleProfileUpload = () => {
    setLoading(true)
    let imageInput: any = document.getElementById('profile-input')
    let file = imageInput.files[0]

    //If detect any file upload in the stack
    if (file) {
      let metadata = {
        contentType: file.type,
      }
      let upload = storageRef.child(file.name).put(file, metadata)
      upload
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
          console.log(`头像成功上传到数据库~'${url}`)
          if (user) {
            db.collection('user')
              .doc(user.uid)
              .collection('Setting')
              .doc('Profile')
              .update({
                avatar: url,
              })
            db.collection('friends').doc(user.uid).update({
              avatar: url,
            })
          }
          setLoading(false)
          setFeedback(true)
        })
    } else {
      setLoading(false)
      setError(true)
    }
  }

  //保存用户修改后的profile信息
  const handleSubmit = () => {
    if (profile.profileEmail !== '' && !profile.profileEmail.includes('@')) {
      alert('错误')
    } else {
      setLoading(true)
      setTimeout(() => {
        if (user) {
          db.collection('user')
            .doc(user.uid)
            .collection('Setting')
            .doc('Profile')
            .update({
              profile,
            })
            .then(() => console.log('用户信息保存成功'))
            .catch(error => {
              console.log('保存出错' + error)
            })
          db.collection('friends').doc(user.uid).update({
            Key: user.uid,
            profile,
          })
        }
        setLoading(false)
        setFeedback(true)
      }, 1000)
    }
  }

  const handleReload = () => {
    window.location.reload()
  }

  const handleError = () => {
    setError(false)
  }

  //初始化读取数据库信息
  useEffect(() => {
    if (user) {
      db.collection('user')
        .doc(user.uid)
        .collection('Setting')
        .doc('Profile')
        .get()
        .then((doc: any) => {
          if (doc.data().profile) {
            setProfile(doc.data().profile)
          } else {
            setProfile(profileInit)
          }
          // if (doc.data().avatar) {
          //   setAvatar(doc.data().avatar)
          // }
        })
    }
    setLaunch(false)
  }, [db, user])

  return (
    <div>
      {loading === true ? <Progress /> : null}
      {/* 项目创建成功反馈 */}
      {feedback === true ? (
        <div>
          <Feedback
            msg="Success"
            info="Profile changed successfully ~ ー( ´ ▽ ` )ﾉ"
            imgUrl="/images/emoji/emoji_happy.png"
            toggle={handleReload}
          />
        </div>
      ) : null}

      {error === true ? (
        <div>
          <Feedback
            msg="Error"
            info="Pleaqse upload your profile picture ~ ー( ´ ▽ ` )ﾉ"
            imgUrl="/images/emoji/emoji_scare.png"
            toggle={handleError}
          />
        </div>
      ) : null}

      {launch ? (
        <Loading />
      ) : (
        <div>
          <div className="setting-content-intro">
            <h2>Profile</h2>
            <p>Edit your personal information</p>
          </div>
          <div className="setting-content-profile-header">
            <img src={avatar} alt="profile" />
            <input id="profile-input" name="profile-input" type="file" />
            <label htmlFor="profile-input">
              <p>Upload Images</p>
            </label>
            <button onClick={handleProfileUpload}>Save</button>
          </div>

          <div className={classes.root}>
            <TextField
              error={false}
              id="profile-name-input"
              name="profileName"
              onChange={handleTextField}
              label="Full Name"
              style={inputMargin}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              helperText="Name you want to display while using the app"
              inputProps={{ placeholder: profile.profileName }}
            />
            <TextField
              id="profile-location-input"
              name="profileLocation"
              onChange={handleTextField}
              label="Location"
              className={classes.textField}
              margin="dense"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ placeholder: profile.profileLocation }}
            />
            <TextField
              id="profile-email-input"
              name="profileEmail"
              onChange={handleTextField}
              label="Email Address"
              className={classes.textField}
              helperText="For notification and password reset"
              margin="dense"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ placeholder: profile.profileEmail }}
            />
            <TextField
              id="profile-bio-input"
              name="profileBio"
              onChange={handleTextField}
              label="Bio"
              style={inputMargin}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              helperText="Descirbe your self and make some friends"
              variant="outlined"
              inputProps={{ placeholder: profile.profileBio }}
            />
            <TextField
              id="profile-url-input"
              name="profileWeb"
              onChange={handleTextField}
              label="Personal Website"
              style={inputMargin}
              fullWidth
              margin="dense"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              inputProps={{ placeholder: profile.profileWeb }}
            />
            <TextField
              id="profile-linkedin-input"
              name="profilelinkedin"
              onChange={handleTextField}
              label="Linkedin URL"
              style={inputMargin}
              fullWidth
              margin="dense"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              inputProps={{ placeholder: profile.profilelinkedin }}
            />
            <TextField
              id="profile-github-input"
              name="profileGithub"
              onChange={handleTextField}
              label="Github URL"
              style={inputMargin}
              fullWidth
              margin="dense"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              inputProps={{ placeholder: profile.profileGithub }}
            />
          </div>

          <div className="setting-content-save">
            <button onClick={handleSubmit}>Save</button>
          </div>
        </div>
      )}
    </div>
  )
}
