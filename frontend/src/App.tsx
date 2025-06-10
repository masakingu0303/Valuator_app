import { useState } from "react"
const API = 'http://localhost:3000/analyze'

const App = () => {
  const [image, setImage] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [result, setResult] = useState('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleClick = async () => {
    if (!image) {
      alert('画像を選択してください')
      return
    }

    const formData = new FormData()
    formData.append('image', image)
    formData.append('text', text)

    try {
      const res = await fetch(API, {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (e) {
      alert('通信エラー')
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold text-center">その商品の価値は！？</h1>

      <input type="file" accept="image/*" onChange={handleImageChange} className="file-input file-input-bordered w-full" />
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="ブランド名など" className="input input-bordered w-full" />
      <button onClick={handleClick} className="btn btn-accent w-full">AIで調べる</button>

      {result && <pre>{result}</pre>}
    </div>
  )
}

export default App
