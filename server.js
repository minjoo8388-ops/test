// 필요한 모듈 불러오기
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');         // 💡 파일 읽어오는 도구 추가!
const path = require('path');     // 💡 파일 경로 찾는 도구 추가!
const questionsData = require('./questions');

// 💡 1. index.html 파일을 텍스트로 쓱 읽어오기
let indexHtmlCode = '';
try {
  // public 폴더 안의 index.html을 읽어와서 indexHtmlCode 변수에 저장!
  indexHtmlCode = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
} catch (err) {
  indexHtmlCode = '<!-- 아직 index.html 파일이 없습니다. public 폴더에 넣어주세요! -->';
}

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 💡 2. Swagger 기본 설정
const swaggerOptions = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: '질문 기반 데이터 시각화 API 문서',
      version: '1.0.0',
      description: `
설문 데이터를 받아 점수를 계산해 시각화해주는 API입니다.

---

### 🎨 프론트엔드(UI) 테스트 화면
이 API가 실제로 어떻게 화면에 그려지는지 확인하고 싶다면 아래 링크를 클릭하세요!
👉 **[예시 UI](http://localhost:3000)**

### 💻 프론트엔드 적용 예시 코드
이 API를 사용해 똑같은 화면을 구현하고 싶다면 아래 토글을 눌러 코드를 복사하세요.

<details>
<summary><b>👉 프론트엔드 전체 코드 보기 (여기를 클릭해서 펼치기)</b></summary>
<br>

\`\`\`html
${indexHtmlCode} 
\`\`\`

</details>
      `, 
    },
  },
  apis: ['./server.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// -----------------------

const DEFAULT_CONFIG = {
  title: "제목을 입력해주세요",
  subtitle: "부제목을 입력해주세요"
};

const WEIGHT_MAP = {            // 가중치를 수정할 수 있습니다   
  1: 1.0,
  2: 2.0,
  3: 3.0,
  4: 4.2,
  5: 5.0
};

/**
 * @swagger
 * /api/config:
 *   get:
 *     summary: 기본 설정(제목, 부제목) 데이터를 가져옵니다.
 *     responses:
 *       200:
 *         description: 성공적으로 설정 데이터를 반환함
 */
app.get('/api/config', (req, res) => {
  res.json(DEFAULT_CONFIG);
});

/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: 전체 설문 카테고리와 질문 목록을 가져옵니다.
 *     responses:
 *       200:
 *         description: 성공적으로 질문 데이터를 반환함
 */
app.get('/api/questions', (req, res) => {
  res.json(questionsData);
});

/**
 * @swagger
 * /api/calculate:
 *   post:
 *     summary: 유저의 응답 데이터를 받아 최종 점수와 백분율을 계산합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userResponses:
 *                 type: object
 *                 description: 카테고리 ID를 키로 갖고, 응답 배열을 값으로 갖는 객체
 *                 example: { "category1": [3, 4, 5], "category2": [1, 2] }
 *     responses:
 *       200:
 *         description: 성공적으로 계산된 결과를 반환함
 *       400:
 *         description: 잘못된 요청 (userResponses 데이터가 없거나 형식에 맞지 않음)
 */
app.post('/api/calculate', (req, res) => {
  const { userResponses } = req.body; 

  if (!userResponses || typeof userResponses !== 'object') {
    return res.status(400).json({ error: "userResponses 객체가 필요합니다." });
  }

  const results = questionsData.map(category => {
    const responses = userResponses[category.id] || [];
    const count = responses.length || 1;
    
    let weightedSum = 0;
    responses.forEach(val => {
      weightedSum += WEIGHT_MAP[val] || 3.0;
    });

    const avgScore = weightedSum / count;
    const score = Math.round(avgScore * 2 * 10) / 10;
    const percent = score * 10;

    return {
      id: category.id,
      label: category.label,
      score: score,
      percent: percent,
      color: score >= 8 ? "#2563eb" : score >= 5 ? "#60a5fa" : "#94a3b8"
    };
  });

  res.json({
    success: true,
    title: DEFAULT_CONFIG.title,
    data: results
  });
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
  console.log(`API 문서 보기: http://localhost:${PORT}/api-docs`); // 문서 주소도 콘솔에 띄워주면 편해!
});

app.get('/swagger.json', (req, res) => {
  res.json(swaggerSpec); // 아까 만든 스펙을 그대로 json으로 뱉어라!
});