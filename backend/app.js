const express = require('express');
const cors = require('cors');
const multer = require('multer');  //画像解析
const fs = require('fs'); 
const dotenv = require('dotenv');
dotenv.config();
const { OpenAI } = require('openai');

const app = express();
const port = 3000;
const upload = multer({ storage: multer.memoryStorage() });
const openai = new OpenAI({ apiKey: process.env.API_KEY });

app.use(cors());
app.use(express.json());

// テストルート
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

// 実際のAPIルート
app.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    const keyword = req.body.text;

    if (!req.file) {
      return res.status(400).json({ error: '画像がありません' });
    }

    const imageBuffer = req.file.buffer;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          "role": "system",
          "content": 'ユーザーが送信する画像とキーワードに基づき、商品のブランド名・商品名・定価・相場を特定してください、特定できない場合は似ている商品のブランド名・商品名・定価・相場を答えてください、回答は全て日本語で答えて'
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: `Keyword: ${keyword}` },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`
              }
            }
          ]
        },
      ],
    });

    const productName = response.choices[0].message.content;
    res.json(({ productName }));
  } catch (error) {
    console.error('エラー発生:', error);
    res.status(500).json({ error: 'サーバー内部エラー' });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
