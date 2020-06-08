import React from 'react'
import { useState, useEffect } from 'react'
import { Link, Switch, Route, useLocation } from 'react-router-dom'
import firebase from 'firebase'

//所有主组件
import Home from './components/Home'
import Status from './components/Status'
import Explore from './components/Explore'
import Group from './components/Group'
import Mission from './components/Mission'
import Friends from './components/Friends'
import Moment from './components/Moment'
import Setting from './components/Setting'
import FAQ from './components/FAQ'
import CreateProject from './components/Common/CreateProject'

//导航，副组件根据ref来决定渲染内容
import ProfileMenu from './components/Navigation/ProfileMenu'
import Edit from './components/Common/Edit'
import Kanban from './components/Home/Kanban'

export default function App() {
  const db = firebase.firestore()

  //全局样式化
  //侧边导航栏样式
  const [theme, setTheme] = useState('')

  //背景样式
  const [options, setOptions] = useState('Color')
  const [customBg, setCustomBg] = useState([])
  const [demo, setDemo] = useState({
    backgroundColor: true,
    backgroundRef: '',
  })

  //透明度样式
  const [opacity, setOpacity] = useState({
    sidebar: 100,
    topbar: 100,
    card: 100,
    background: 50,
  })

  //初始化读取数据库 判断用户是否有过记录
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      db.collection('user')
        .doc(user.uid)
        .collection('Setting')
        .doc('Apparence')
        .get()
        .then((doc) => {
          //侧边导航栏theme
          if (doc.data().theme) {
            setTheme(doc.data().theme)
          } else {
            setTheme('#0e5dd3')
          }
          //壁纸
          if (doc.data().background) {
            setDemo(() => ({
              backgroundColor: doc.data().backgroundColor,
              backgroundRef: doc.data().background,
            }))
            setOptions(doc.data().backgroundColor ? 'Color' : 'Images')
            //设置为默认样式
          } else {
            db.collection('user')
              .doc(user.uid)
              .collection('Setting')
              .doc('Apparence')
              .update({
                background: '#f7f7f7',
                backgroundColor: true,
              })
          }
          //如果用户保存过更改 上传过自己的壁纸
          if (doc.data().customBackground) {
            setCustomBg(doc.data().customBackground)
          }
          if (doc.data().opacity) {
            setOpacity(doc.data().opacity)
          } else {
            db.collection('user')
              .doc(user.uid)
              .collection('Setting')
              .doc('Apparence')
              .update({
                opacity,
              })
          }
        })
        .catch((error) => {
          console.log(`读取用户保存的壁纸时出错了 ${error}`)
        })
    })
  }, [])

  //用户当前所在的route
  const currRoute = useLocation().pathname

  // active css style 当前所在的route对应的nav icon样式化
  const currLinkStyle = {
    backgroundColor: 'white',
    color: `${theme}`,
    padding: '5px',
    borderRadius: '50%',
  }

  //颜色有更改时 写入到数据库
  const handleTheme = (color, event) => {
    firebase.auth().onAuthStateChanged((user) => {
      db.collection('user')
        .doc(user.uid)
        .collection('Setting')
        .doc('Apparence')
        .update({
          theme: color.hex,
        })
        .then(() => {
          setTheme(color.hex)
          console.log(`主题色修改成功为${color.hex}`)
        })
        .catch((error) => {
          console.log(`更改主题色时出错啦${error}`)
        })
    })
  }

  //渲染是以照片还是纯色模式为背景
  const handleOptions = (event) => {
    setOptions(event.target.value)
    console.log(options)
  }

  //用户点击壁纸缩略图时更改实时预览demo
  const handleSwitch = (event) => {
    let bgRef = event.currentTarget.id
    setDemo(() => ({
      backgroundColor: false,
      backgroundRef: bgRef,
    }))
    //同时更新到数据库
    firebase.auth().onAuthStateChanged((user) => {
      db.collection('user')
        .doc(user.uid)
        .collection('Setting')
        .doc('Apparence')
        .update({
          backgroundColor: false,
          background: bgRef,
        })
        .then(() => {
          console.log(`切换背景到数据库${bgRef}`)
        })
        .catch((error) => {
          console.log(`切换背景错误${error}`)
        })
    })
  }

  //用户点击卡色 写入数据库
  const handleColor = (color, event) => {
    firebase.auth().onAuthStateChanged((user) => {
      db.collection('user')
        .doc(user.uid)
        .collection('Setting')
        .doc('Apparence')
        .update({
          backgroundColor: true,
          background: color.hex,
        })
        .then(() => {
          setDemo(() => ({
            backgroundColor: true,
            backgroundRef: color.hex,
          }))
          console.log(`主题色修改成功为${color.hex}`)
        })
        .catch((error) => {
          console.log(`更改主题色时出错啦${error}`)
        })
    })
  }

  //更改透明度
  const handleOpacity = (name) => (event, value) => {
    setOpacity((prevOpacity) => ({
      ...prevOpacity,
      [name]: value,
    }))
    firebase.auth().onAuthStateChanged((user) => {
      db.collection('user')
        .doc(user.uid)
        .collection('Setting')
        .doc('Apparence')
        .update({
          opacity,
        })
    })
  }

  return (
    <div>
      {/* 全局样式更改 */}
      {demo.backgroundColor ? (
        <div
          style={{
            backgroundColor: demo.backgroundRef,
            transition: 'all 2s',
          }}
          className="background"
        ></div>
      ) : (
        <div
          style={{ backgroundImage: `url(${demo.backgroundRef})` }}
          className="background-img"
        ></div>
      )}
      {/* 背景图片前置透明板 */}
      <div
        className="overlay"
        style={{ opacity: opacity.background / 100 }}
      ></div>

      {/* 内容容器 */}
      <div className="content-container">
        <img className="logo" src="/images/logo.png" />

        {/* 侧边导航栏 */}
        <div
          className="navbar"
          style={{ backgroundColor: theme, opacity: opacity.sidebar / 100 }}
        >
          <Link to="/">
            <i
              style={currRoute === '/' ? currLinkStyle : null}
              className="fas fa-home"
            ></i>
          </Link>
          {/* 个人项目统计 */}
          <Link to="/status">
            <i
              style={currRoute === '/status' ? currLinkStyle : null}
              className="fas fa-tachometer-alt"
            ></i>
          </Link>
          {/* 所有公开项目 */}
          <Link to="/explore">
            <i
              style={currRoute === '/explore' ? currLinkStyle : null}
              className="fab fa-wpexplorer"
            ></i>
          </Link>
          {/* 项目大厅 这里展示的是想找人一起的 加一个按钮可以发布 */}
          <Link to="/group">
            <i
              style={currRoute === '/group' ? currLinkStyle : null}
              className="far fa-calendar-alt"
            ></i>
          </Link>
          {/* 系统随机分配的任务 */}
          <Link to="/mission">
            <i
              style={currRoute === '/mission' ? currLinkStyle : null}
              className="fas fa-book"
            ></i>
          </Link>
          {/* 显示所有的用户 并可以搜寻 加好友 */}
          <Link to="/friends">
            <i
              style={currRoute === '/friends' ? currLinkStyle : null}
              className="fas fa-user-friends"
            ></i>
          </Link>
          {/* 动态类似朋友圈 */}
          <Link to="/moment">
            <i
              style={currRoute === '/moment' ? currLinkStyle : null}
              className="far fa-clock"
            ></i>
          </Link>
          {/* 设置页面 */}
          <Link to="/setting/profile">
            <i
              style={currRoute === `/setting/profile` ? currLinkStyle : null}
              className="fas fa-sliders-h"
            ></i>
          </Link>
          {/* 软件疑难解答 加一个机器人 */}
          <Link to="/faq">
            <i
              style={currRoute === '/faq' ? currLinkStyle : null}
              className="far fa-question-circle"
            ></i>
          </Link>
          {/* 创建新的项目 */}
          <Link to="/create">
            <i
              style={currRoute === '/create' ? currLinkStyle : null}
              className="fas fa-feather"
            ></i>
          </Link>
          {/* 退出 */}
          <Link to="/noidea">
            <i
              style={currRoute === '/noidea' ? currLinkStyle : null}
              className="fas fa-sign-out-alt"
            ></i>
          </Link>
        </div>

        {/* 顶部菜单栏 */}
        <div className="user-navbar" style={{ opacity: opacity.topbar / 100 }}>
          <h2>Project Dashboard</h2>
          <div className="user-navbar-icon">
            <i className="fas fa-inbox"></i>
            <i className="fas fa-bell"></i>
            <ProfileMenu />
          </div>
        </div>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/status">
            <Status />
          </Route>
          <Route path="/explore">
            <Explore />
          </Route>
          <Route path="/group">
            <Group />
          </Route>
          <Route path="/mission/">
            <Mission />
          </Route>
          <Route path="/friends">
            <Friends />
          </Route>
          <Route path="/moment">
            <Moment />
          </Route>
          <Route path="/setting/">
            <Setting
              demo={demo}
              options={options}
              customBg={customBg}
              opacity={opacity}
              switchImgPreview={handleSwitch}
              switchColorPreview={handleColor}
              switchOption={handleOptions}
              switchTheme={handleTheme}
              swicthOpacity={handleOpacity}
            />
          </Route>
          <Route path="/faq">
            <FAQ />
          </Route>
          <Route path="/create">
            <CreateProject />
          </Route>

          {/* 其他route 根据相关ref渲染 */}
          <Route path="/edit/:ref">
            <Edit />
          </Route>
          <Route path="/kanban/:ref">
            <Kanban />
          </Route>
        </Switch>
      </div>
    </div>
  )
}
