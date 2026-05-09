const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const members = [
  {
    id: 1,
    name: '김민준',
    techStack: ['JavaScript', 'React', 'Node.js'],
    personality: '리더형',
    preferredTeamSize: [3, 4, 5],
  },
  {
    id: 2,
    name: '이서연',
    techStack: ['Python', 'Django', 'PostgreSQL'],
    personality: '협력형',
    preferredTeamSize: [2, 3, 4],
  },
  {
    id: 3,
    name: '박지호',
    techStack: ['Java', 'Spring', 'MySQL'],
    personality: '분석형',
    preferredTeamSize: [3, 4, 5],
  },
  {
    id: 4,
    name: '최수아',
    techStack: ['TypeScript', 'React', 'GraphQL'],
    personality: '창의형',
    preferredTeamSize: [2, 3],
  },
  {
    id: 5,
    name: '정다은',
    techStack: ['Vue.js', 'Python', 'Docker'],
    personality: '협력형',
    preferredTeamSize: [3, 4, 5],
  },
  {
    id: 6,
    name: '한승우',
    techStack: ['Go', 'Kubernetes', 'AWS'],
    personality: '분석형',
    preferredTeamSize: [2, 3, 4],
  },
  {
    id: 7,
    name: '윤지민',
    techStack: ['React', 'Node.js', 'MongoDB'],
    personality: '리더형',
    preferredTeamSize: [4, 5],
  },
  {
    id: 8,
    name: '임채원',
    techStack: ['Swift', 'Kotlin', 'Firebase'],
    personality: '창의형',
    preferredTeamSize: [2, 3, 4],
  },
];

function scoreMatch(member, techStack, personality, teamSize) {
  let score = 0;

  const stackMatches = techStack.filter(t =>
    member.techStack.includes(t)
  ).length;
  score += stackMatches * 30;

  if (member.personality === personality) {
    score += 20;
  }

  if (member.preferredTeamSize.includes(teamSize)) {
    score += 10;
  }

  return score;
}

// POST /api/teams/recommend
app.post('/api/teams/recommend', (req, res) => {
  const { techStack, personality, teamSize } = req.body;

  if (!techStack || !Array.isArray(techStack) || techStack.length === 0) {
    return res.status(400).json({
      error: 'techStack은 비어있지 않은 배열이어야 합니다.',
    });
  }
  if (!personality) {
    return res.status(400).json({
      error: 'personality는 필수 항목입니다. (리더형, 협력형, 분석형, 창의형)',
    });
  }
  if (!teamSize || typeof teamSize !== 'number' || teamSize < 2 || teamSize > 10) {
    return res.status(400).json({
      error: 'teamSize는 2~10 사이의 숫자여야 합니다.',
    });
  }

  const scored = members.map(member => ({
    ...member,
    score: scoreMatch(member, techStack, personality, teamSize),
  }));

  scored.sort((a, b) => b.score - a.score);

  const count = Math.min(teamSize - 1, scored.length);
  const recommended = scored.slice(0, count).map(({ score, ...member }) => member);

  res.json({
    request: { techStack, personality, teamSize },
    recommendedMembers: recommended,
    message: `${recommended.length}명의 팀원을 추천합니다.`,
  });
});

// GET /api/members (전체 멤버 조회)
app.get('/api/members', (req, res) => {
  res.json({ members });
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
