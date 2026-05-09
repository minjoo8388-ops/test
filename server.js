const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// 설문 문항 (각 선택지는 성향 점수에 반영)
// 성향: leader(리더형), team(협력형), analyst(분석형), creative(창의형)
const survey = [
  {
    id: 1,
    question: '팀 프로젝트에서 나는 주로 어떤 역할을 맡나요?',
    options: [
      { key: 'a', text: '전체 방향을 정하고 팀을 이끈다', personality: 'leader' },
      { key: 'b', text: '팀원들 사이에서 소통과 조율을 담당한다', personality: 'team' },
      { key: 'c', text: '자료를 분석하고 근거를 제시한다', personality: 'analyst' },
      { key: 'd', text: '새로운 아이디어를 제안한다', personality: 'creative' },
    ],
  },
  {
    id: 2,
    question: '문제가 생겼을 때 나의 첫 반응은?',
    options: [
      { key: 'a', text: '즉시 해결책을 제시하고 실행한다', personality: 'leader' },
      { key: 'b', text: '팀원들과 함께 의논해 방법을 찾는다', personality: 'team' },
      { key: 'c', text: '원인을 파악하고 단계적으로 접근한다', personality: 'analyst' },
      { key: 'd', text: '기존과 다른 방법을 시도해본다', personality: 'creative' },
    ],
  },
  {
    id: 3,
    question: '새로운 프로젝트를 시작할 때 나는?',
    options: [
      { key: 'a', text: '목표와 일정을 먼저 세운다', personality: 'leader' },
      { key: 'b', text: '팀원들의 의견을 먼저 듣는다', personality: 'team' },
      { key: 'c', text: '관련 자료를 충분히 조사한다', personality: 'analyst' },
      { key: 'd', text: '바로 아이디어 스케치를 시작한다', personality: 'creative' },
    ],
  },
  {
    id: 4,
    question: '팀에서 가장 중요하게 생각하는 가치는?',
    options: [
      { key: 'a', text: '목표 달성과 성과', personality: 'leader' },
      { key: 'b', text: '팀원 간 화합과 신뢰', personality: 'team' },
      { key: 'c', text: '정확성과 체계적인 프로세스', personality: 'analyst' },
      { key: 'd', text: '창의성과 새로운 도전', personality: 'creative' },
    ],
  },
  {
    id: 5,
    question: '발표 자료를 만들 때 나는?',
    options: [
      { key: 'a', text: '핵심 메시지 중심으로 구조를 짠다', personality: 'leader' },
      { key: 'b', text: '팀원들과 역할을 나눠 함께 만든다', personality: 'team' },
      { key: 'c', text: '데이터와 근거를 꼼꼼히 준비한다', personality: 'analyst' },
      { key: 'd', text: '눈에 띄는 독창적인 디자인을 구상한다', personality: 'creative' },
    ],
  },
];

const personalityLabels = {
  leader: '리더형',
  team: '협력형',
  analyst: '분석형',
  creative: '창의형',
};

const members = [
  { id: 1, name: '김민준', techStack: ['JavaScript', 'React', 'Node.js'], personality: 'leader', preferredTeamSize: [3, 4, 5] },
  { id: 2, name: '이서연', techStack: ['Python', 'Django', 'PostgreSQL'], personality: 'team', preferredTeamSize: [2, 3, 4] },
  { id: 3, name: '박지호', techStack: ['Java', 'Spring', 'MySQL'], personality: 'analyst', preferredTeamSize: [3, 4, 5] },
  { id: 4, name: '최수아', techStack: ['TypeScript', 'React', 'GraphQL'], personality: 'creative', preferredTeamSize: [2, 3] },
  { id: 5, name: '정다은', techStack: ['Vue.js', 'Python', 'Docker'], personality: 'team', preferredTeamSize: [3, 4, 5] },
  { id: 6, name: '한승우', techStack: ['Go', 'Kubernetes', 'AWS'], personality: 'analyst', preferredTeamSize: [2, 3, 4] },
  { id: 7, name: '윤지민', techStack: ['React', 'Node.js', 'MongoDB'], personality: 'leader', preferredTeamSize: [4, 5] },
  { id: 8, name: '임채원', techStack: ['Swift', 'Kotlin', 'Firebase'], personality: 'creative', preferredTeamSize: [2, 3, 4] },
];

// 설문 답변으로 성향 계산
function calcPersonality(answers) {
  const scores = { leader: 0, team: 0, analyst: 0, creative: 0 };

  answers.forEach((answer, index) => {
    const question = survey[index];
    const option = question.options.find(o => o.key === answer);
    if (option) {
      scores[option.personality] += 1;
    }
  });

  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

// 팀원 매칭 점수 계산
function scoreMatch(member, techStack, personality, teamSize) {
  let score = 0;

  const stackMatches = techStack.filter(t => member.techStack.includes(t)).length;
  score += stackMatches * 30;

  if (member.personality === personality) score += 20;
  if (member.preferredTeamSize.includes(teamSize)) score += 10;

  return score;
}

// GET /api/survey — 설문 문항 반환
app.get('/api/survey', (req, res) => {
  const questions = survey.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options.map(o => ({ key: o.key, text: o.text })),
  }));
  res.json({ questions });
});

// POST /api/teams/recommend — 설문 결과 기반 팀원 추천
app.post('/api/teams/recommend', (req, res) => {
  const { answers, techStack, teamSize } = req.body;

  if (!answers || !Array.isArray(answers) || answers.length !== 5) {
    return res.status(400).json({ error: 'answers는 5개의 답변 배열이어야 합니다. (각 항목: "a" | "b" | "c" | "d")' });
  }

  const validKeys = ['a', 'b', 'c', 'd'];
  if (answers.some(a => !validKeys.includes(a))) {
    return res.status(400).json({ error: '각 답변은 "a", "b", "c", "d" 중 하나여야 합니다.' });
  }

  if (!techStack || !Array.isArray(techStack) || techStack.length === 0) {
    return res.status(400).json({ error: 'techStack은 비어있지 않은 배열이어야 합니다.' });
  }

  if (!teamSize || typeof teamSize !== 'number' || teamSize < 2 || teamSize > 10) {
    return res.status(400).json({ error: 'teamSize는 2~10 사이의 숫자여야 합니다.' });
  }

  const personality = calcPersonality(answers);
  const personalityLabel = personalityLabels[personality];

  const scored = members.map(member => ({
    ...member,
    score: scoreMatch(member, techStack, personality, teamSize),
  }));

  scored.sort((a, b) => b.score - a.score);

  const count = Math.min(teamSize - 1, scored.length);
  const recommended = scored.slice(0, count).map(({ score, ...member }) => ({
    ...member,
    personality: personalityLabels[member.personality],
  }));

  res.json({
    myPersonality: personalityLabel,
    request: { techStack, teamSize },
    recommendedMembers: recommended,
    message: `당신은 ${personalityLabel}입니다. ${recommended.length}명의 팀원을 추천합니다.`,
  });
});

// GET /api/members
app.get('/api/members', (req, res) => {
  res.json({
    members: members.map(m => ({ ...m, personality: personalityLabels[m.personality] })),
  });
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
