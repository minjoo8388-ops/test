<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>핵심 역량 진단 시스템</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">
    <style>
        body { font-family: "Pretendard", sans-serif; }
    </style>
</head>
<body class="bg-slate-100 min-h-screen p-4 md:p-10">
    <div id="root"></div>

    <script type="text/babel">
        function SkillAnalysis() {
            const [questions, setQuestions] = React.useState([]);
            const [responses, setResponses] = React.useState({});
            const [title, setTitle] = React.useState("");
            const [result, setResult] = React.useState(null);
            const [loading, setLoading] = React.useState(true);
            const [focusedQuestion, setFocusedQuestion] = React.useState(null);

            React.useEffect(() => {
                // 상단 타이틀 로드
                fetch('http://localhost:3000/api/config')
                    .then(res => res.json())
                    .then(config => setTitle(config.title))
                    .catch(err => console.log('설정 로드 실패:', err));

                // 질문 목록 로드
                fetch('http://localhost:3000/api/questions')
                    .then(res => res.json())
                    .then(data => {
                        setQuestions(data);
                        const initialResponses = {};
                        data.forEach(cat => {
                            initialResponses[cat.id] = new Array(cat.questions.length).fill(null);
                        });
                        setResponses(initialResponses);
                        setLoading(false);
                    });
            }, []);

            // 키보드(숫자키 1-5) 이벤트 핸들러
            React.useEffect(() => {
                const handleKeyPress = (e) => {
                    if (result || !focusedQuestion) return;

                    const key = e.key;
                    if (['1', '2', '3', '4', '5'].includes(key)) {
                        const { categoryId, questionIndex } = focusedQuestion;
                        handleResponseChange(categoryId, questionIndex, parseInt(key));
                        moveToNextQuestion(categoryId, questionIndex);
                    }
                };

                window.addEventListener('keydown', handleKeyPress);
                return () => window.removeEventListener('keydown', handleKeyPress);
            }, [focusedQuestion, result, questions]);

            const handleResponseChange = (categoryId, questionIndex, value) => {
                setResponses(prev => {
                    const newResponses = { ...prev };
                    newResponses[categoryId][questionIndex] = value;
                    return newResponses;
                });
            };

            const moveToNextQuestion = (currentCategoryId, currentQuestionIndex) => {
                const categoryIndex = questions.findIndex(cat => cat.id === currentCategoryId);
                const currentCategory = questions[categoryIndex];

                if (currentQuestionIndex < currentCategory.questions.length - 1) {
                    setFocusedQuestion({
                        categoryId: currentCategoryId,
                        questionIndex: currentQuestionIndex + 1
                    });
                } else if (categoryIndex < questions.length - 1) {
                    setFocusedQuestion({
                        categoryId: questions[categoryIndex + 1].id,
                        questionIndex: 0
                    });
                } else {
                    setFocusedQuestion(null);
                }
            };

            const handleSubmit = async (e) => {
                e.preventDefault();
                
                let allAnswered = true;
                Object.values(responses).forEach(arr => {
                    if (arr.some(val => val === null)) allAnswered = false;
                });

                if (!allAnswered) {
                    alert('아직 응답하지 않은 문항이 있습니다.');
                    return;
                }

                setLoading(true);
                try {
                    const response = await fetch('http://localhost:3000/api/calculate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userResponses: responses })
                    });
                    const data = await response.json();
                    setResult(data);
                } catch (error) {
                    alert('분석 중 오류가 발생했습니다.');
                } finally {
                    setLoading(false);
                }
            };

            if (loading && questions.length === 0) {
                return <div className="flex items-center justify-center min-h-[400px] text-slate-400 font-bold">준비 중...</div>;
            }

            return (
                <div className="max-w-4xl mx-auto">
                    {!result ? (
                        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-12 rounded-[2rem] shadow-2xl shadow-slate-200 space-y-10">
                            {/* 헤더 세션 */}
                            <div className="pb-8 border-b border-slate-100">
                                <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-3">{title || "핵심 역량 진단"}</h1>
                                <p className="text-sm text-slate-500 font-medium">
                                    질문을 클릭한 뒤 <span className="text-blue-600 font-bold">숫자키 1~5</span>를 눌러 순서대로 응답할 수 있습니다.
                                </p>
                                <div className="flex flex-wrap gap-3 mt-6">
                                    {['매우 그렇지 않다', '그렇지 않다', '보통이다', '그렇다', '매우 그렇다'].map((txt, i) => (
                                        <span key={i} className="text-[10px] font-bold px-3 py-1.5 bg-slate-50 text-slate-400 rounded-full border border-slate-100">
                                            {i+1}. {txt}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* 질문 리스트 */}
                            <div className="space-y-12">
                                {questions.map((category, catIdx) => (
                                    <div key={category.id} className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-black text-xs">{catIdx + 1}</span>
                                            <h3 className="text-lg font-black text-slate-800">{category.label}</h3>
                                        </div>
                                        <div className="grid gap-3">
                                            {category.questions.map((question, qIdx) => {
                                                const isFocused = focusedQuestion?.categoryId === category.id && focusedQuestion?.questionIndex === qIdx;
                                                const val = responses[category.id][qIdx];
                                                
                                                return (
                                                    <div 
                                                        key={qIdx}
                                                        onClick={() => setFocusedQuestion({ categoryId: category.id, questionIndex: qIdx })}
                                                        className={`group p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col md:flex-row justify-between items-center gap-4 ${
                                                            isFocused ? 'bg-blue-50 border-blue-500 shadow-lg scale-[1.01]' : 
                                                            val !== null ? 'bg-white border-green-200' : 'bg-white border-slate-50 hover:border-slate-200 shadow-sm'
                                                        }`}
                                                    >
                                                        <p className="text-[15px] font-bold text-slate-700 leading-snug flex-1">
                                                            <span className="text-slate-300 mr-2 font-mono">{catIdx+1}-{qIdx+1}.</span>
                                                            {question}
                                                        </p>
                                                        <div className="flex gap-1.5">
                                                            {[1, 2, 3, 4, 5].map(num => (
                                                                <button
                                                                    key={num}
                                                                    type="button"
                                                                    onClick={(e) => { e.stopPropagation(); handleResponseChange(category.id, qIdx, num); moveToNextQuestion(category.id, qIdx); }}
                                                                    className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${
                                                                        val === num ? 'bg-blue-600 text-white shadow-xl scale-110' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
                                                                    }`}
                                                                >
                                                                    {num}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button type="submit" className="w-full h-16 bg-slate-800 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl active:scale-[0.98]">
                                분석 결과 확인하기
                            </button>
                        </form>
                    ) : (
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl space-y-8">
                            <div className="text-center">
                                <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Analysis Result</h2>
                                <h1 className="text-3xl font-black text-slate-800 tracking-tight">{result.title}</h1>
                            </div>

                            <div className="grid gap-6">
                                {result.data.map((item, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <span className="font-black text-slate-700">{item.label}</span>
                                            <span className="text-xl font-mono font-black text-blue-600">{item.score.toFixed(1)} <span className="text-xs text-slate-300">/ 10</span></span>
                                        </div>
                                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button onClick={() => { setResult(null); setFocusedQuestion(null); }} className="w-full h-16 border-2 border-slate-100 text-slate-400 rounded-2xl font-black hover:bg-slate-50 transition-all">
                                다시 테스트하기
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<SkillAnalysis />);
    </script>
</body>
</html>
