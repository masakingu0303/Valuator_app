import { useState } from "react";
const API = "http://localhost:3000/analyze";

type Result = {
  productName?: string;
}

const App = () => {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState<Result | null>();
  const [loading, setLoading] = useState(false); 

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImage(e.target.files[0]);
  };

  const handleClick = async () => {
    if (!image) {
      alert("画像を選択してください");
      return;
    }

    setLoading(true);  
    setResult(null);      

    const formData = new FormData();
    formData.append("image", image);
    formData.append("text", text);

    try {
      const res = await fetch(API, {
        method: "POST",
        body: formData,
      });
      const data: Result = await res.json();
      setResult(data);
    } catch {
      alert("通信エラー");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="bg-base-200 min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-base-100 shadow-lg rounded-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">その商品の価値は！？</h1>

        <div className="form-control">
          <label className="label">
            <span className="label-text">画像を選択</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
            disabled={loading}  
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">キーワード (ブランド名など)</span>
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="例：Louis Vuitton"
            className="input input-bordered w-full"
            disabled={loading} 
          />
        </div>

        <button
          onClick={handleClick}
          className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
          disabled={loading}  
        >
          {loading ? "ロード中…" : "AIで調べる"}
        </button>

        {result && (
          <div className="card bg-base-100 shadow-md mt-4">
            <div className="card-body">
              <h2 className="card-title">解析結果</h2>
              <pre className="whitespace-pre-wrap font-mono">{result.productName}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
