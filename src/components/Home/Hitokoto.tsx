import React, { useState, useEffect } from 'react'

export const Hitokoto: React.FC = () => {
  const [hitokoto, setHitokoto] = useState<any>({
    content: '',
    from: '',
  })

  const sayUrl = 'https://v1.hitokoto.cn/?c=a&c=b&c=c&c=d&c=k'

  useEffect(() => {
    fetch(sayUrl)
      .then(response => response.json())
      .then(data => {
        setHitokoto({
          content: data.hitokoto,
          from: data.from === null ? '未知' : data.from,
        })
      })
  }, [])

  return (
    <div className="hitokoto-container">
      <p className="hitokoto-content">{hitokoto.content}</p>
      <p className="hitokoto-from">「{hitokoto.from}」</p>
    </div>
  )
}
