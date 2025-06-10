const express = require('express');
const cors = require('cors');
const multer = require('multer');
const port = 3000;

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors()); // 必須！

// テストルート
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

// 実際のAPIルート
app.post('/analyze', upload.single('image'), (req, res) => {
  const image = req.file;
  const text = req.body.text;

  if (!image) {
    return res.status(400).json({ error: '画像がありません' });
  }

  res.json({
    name: text || '未入力商品',
    price: 15000,
    market: 12000,
    diff: 15000 - 12000,
  });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
