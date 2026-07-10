import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import { leaderboardService, testService } from "@/services";
import { Spinner, Alert, Avatar } from "@/components/ui";
import { formatPercent } from "@/utils/helpers";
import { Crown, FileText } from "lucide-react";

import Grainient from "@/component/Grainient/Grainient";

const glassCardStyle = {
  backgroundColor: 'rgba(15, 18, 23, 0.85)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(59, 130, 246, 0.25)',
  borderRadius: '16px',
  padding: '20px',
  boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.05), 0 0 12px 2px rgba(37, 99, 235, 0.1), 0 4px 20px rgba(0,0,0,0.3)'
};

const RANK_COLORS = {
  1: { bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.35)", text: "#FBBF24", glow: "rgba(251,191,36,0.07)" },
  2: { bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", text: "#94A3B8", glow: "transparent" },
  3: { bg: "rgba(180,130,70,0.1)", border: "rgba(180,130,70,0.2)", text: "#B47B3C", glow: "transparent" },
};

function PodiumAvatar({ name, rank }) {
  const c = RANK_COLORS[rank] ?? { bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.15)", text: "rgba(148,163,184,0.5)" };
  const initials = (name || "").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const isFirst = rank === 1;
  return (
    <div style={{
      width: isFirst ? "52px" : "44px",
      height: isFirst ? "52px" : "44px",
      borderRadius: "50%",
      background: c.bg,
      border: `${isFirst ? "2px" : "1px"} solid ${c.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: isFirst ? "16px" : "13px", fontWeight: 500, color: c.text,
    }}>
      {initials || "?"}
    </div>
  );
}

function PodiumCard({ entry, rank, isMe }) {
  const c = RANK_COLORS[rank];
  return (
    <div style={{
      ...glassCardStyle,
      border: `1px solid ${c.border}`,
      boxShadow: `0 0 24px ${c.glow}`,
      padding: rank === 1 ? "28px 16px 20px" : "20px 16px",
      display: "flex", flexDirection: "column", alignItems: "center",
      position: "relative",
      outline: isMe ? `2px solid ${c.text}` : "none",
    }}>
      {rank === 1 && (
        <div style={{
          position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)",
          background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)",
          borderRadius: "0 0 8px 8px", padding: "3px 12px",
        }}>
          <span style={{ fontSize: "9px", fontWeight: 500, color: "#FBBF24", letterSpacing: "1.2px", textTransform: "uppercase" }}>
            Top scorer
          </span>
        </div>
      )}

      {rank === 1 ? (
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%",
          background: c.bg, border: `1px solid ${c.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "12px 0 10px",
        }}>
          <Crown size={14} color={c.text} />
        </div>
      ) : (
        <div style={{
          width: "28px", height: "28px", borderRadius: "50%",
          background: c.bg, border: `1px solid ${c.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "10px",
        }}>
          <span style={{ fontSize: "11px", fontWeight: 500, color: c.text, fontFamily: "monospace" }}>#{rank}</span>
        </div>
      )}

      <PodiumAvatar name={entry.name} rank={rank} />

      <p style={{ fontSize: "12px", color: "#CBD5E1", margin: "10px 0 2px", textAlign: "center" }}>{entry.name}</p>
      <p style={{ fontSize: rank === 1 ? "20px" : "16px", color: "#10B981", margin: 0, fontFamily: "monospace", fontWeight: 500 }}>
        {formatPercent(entry.actualScore)}
      </p>
      {entry.department && (
        <p style={{ fontSize: "10px", color: "rgba(148,163,184,0.45)", margin: "3px 0 0" }}>{entry.department}</p>
      )}
    </div>
  );
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { data, loading, error } = useApi(() => leaderboardService.get());
  const leaderboard = data?.leaderboard ?? [];

  const navigate = useNavigate();
  const [clickCount, setClickCount] = React.useState(0);
  const [speech, setSpeech] = React.useState("");
  const [showSpeech, setShowSpeech] = React.useState(false);
  const [isAccessing, setIsAccessing] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const res = await testService.getResults();
      const results = res.data?.data ?? res.data;
      if (!results || !results.attempt) {
        alert("No completed test results found.");
        return;
      }
      
      const { attempt } = results;
      const responses = attempt.responses || [];
      
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Please allow popups to download your report.");
        return;
      }
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Test Report - ${user.name}</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                color: #1e293b;
                margin: 0;
                padding: 40px;
                background-color: #ffffff;
                line-height: 1.5;
              }
              header {
                border-bottom: 2px solid #e2e8f0;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .title-row {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
              }
              .title {
                font-size: 26px;
                font-weight: bold;
                color: #0f172a;
                margin: 0;
              }
              .meta-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-top: 15px;
                font-size: 14px;
                color: #475569;
              }
              .score-badge {
                background-color: #f0fdf4;
                border: 1px solid #bbf7d0;
                color: #15803d;
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
                display: inline-block;
              }
              .question-card {
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 24px;
                page-break-inside: avoid;
              }
              .question-num {
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: #64748b;
                font-weight: 600;
                margin-bottom: 4px;
              }
              .question-text {
                font-size: 16px;
                font-weight: 600;
                color: #0f172a;
                margin: 0 0 16px 0;
              }
              .options-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 8px;
                margin-bottom: 16px;
              }
              .option {
                padding: 10px 14px;
                border-radius: 6px;
                border: 1px solid #e2e8f0;
                font-size: 14px;
                color: #334155;
                display: flex;
                align-items: center;
                gap: 10px;
              }
              .option.correct {
                border-color: #10b981;
                background-color: #ecfdf5;
                color: #065f46;
                font-weight: 500;
              }
              .option.incorrect {
                border-color: #ef4444;
                background-color: #fef2f2;
                color: #991b1b;
              }
              .option-indicator {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: bold;
                flex-shrink: 0;
              }
              .option.correct .option-indicator {
                background-color: #10b981;
                color: white;
              }
              .option.incorrect .option-indicator {
                background-color: #ef4444;
                color: white;
              }
              .answer-summary {
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid #f1f5f9;
                font-size: 13px;
                display: flex;
                gap: 20px;
              }
              .summary-item {
                font-weight: 500;
              }
              .summary-item span {
                font-weight: bold;
              }
              .text-correct {
                color: #15803d;
              }
              .text-incorrect {
                color: #b91c1c;
              }
              @media print {
                body {
                  padding: 20px;
                }
                .no-print {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <header>
              <div class="title-row">
                <div>
                  <h1 class="title">MCQ Test Assessment Report</h1>
                  <div class="meta-grid">
                    <div><strong>Candidate Name:</strong> ${user?.name || 'N/A'}</div>
                    <div><strong>Email:</strong> ${user?.email || 'N/A'}</div>
                    <div><strong>Department:</strong> ${user?.department || 'N/A'}</div>
                    <div><strong>Submission Date:</strong> ${attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : 'N/A'}</div>
                    <div><strong>Time Taken:</strong> ${Math.floor(attempt.timeTakenSeconds / 60)}m ${attempt.timeTakenSeconds % 60}s</div>
                    <div><strong>Total Questions:</strong> ${attempt.totalQuestions}</div>
                  </div>
                </div>
                <div>
                  <div class="score-badge">
                    Score: ${attempt.scorePercentage}% (${attempt.correctAnswers}/${attempt.totalQuestions})
                  </div>
                </div>
              </div>
            </header>
            <main>
              ${responses.map((res, index) => {
                const q = res.question;
                const isCorrect = res.isCorrect;
                
                const options = [
                  { key: 'A', text: q.optionA },
                  { key: 'B', text: q.optionB },
                  { key: 'C', text: q.optionC },
                  { key: 'D', text: q.optionD },
                ];
                
                return `
                  <div class="question-card">
                    <div class="question-num">Question ${index + 1} (${q.topic})</div>
                    <div class="question-text">${q.questionText}</div>
                    <div class="options-grid">
                      ${options.map(opt => {
                        let optClass = 'option';
                        let indicator = opt.key;
                        
                        if (opt.key === q.correctAnswer) {
                          optClass += ' correct';
                          indicator = '✓';
                        } else if (opt.key === res.selectedAnswer && !isCorrect) {
                          optClass += ' incorrect';
                          indicator = '✗';
                        }
                        
                        return `
                          <div class="${optClass}">
                            <div class="option-indicator">${indicator}</div>
                            <span>${opt.text}</span>
                          </div>
                        `;
                      }).join('')}
                    </div>
                    <div class="answer-summary">
                      <div class="summary-item">
                        Your Answer: <span class="${isCorrect ? 'text-correct' : 'text-incorrect'}">${res.selectedAnswer || 'None'}</span>
                      </div>
                      <div class="summary-item">
                        Correct Answer: <span class="text-correct">${q.correctAnswer}</span>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </main>
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF report. Make sure you completed the test.");
    } finally {
      setDownloading(false);
    }
  };

  const dialogs = [
    "Meow.",
    "Hey... personal space.",
    "Seriously?",
    "You're persistent, aren't you?",
    "... Welcome, curious human."
  ];

  const handleCatClick = () => {
    if (isAccessing) return;
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    
    if (nextCount <= 5) {
      setSpeech(dialogs[nextCount - 1]);
      setShowSpeech(true);
    }
    
    if (nextCount === 5) {
      setIsAccessing(true);
      setTimeout(() => {
        navigate("/secret");
      }, 2000);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', backgroundColor: '#050505' }}>
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Grainient
            color1="#FF9FFC"
            color2="#5227FF"
            color3="#070B14"
            timeSpeed={0.4}
            colorBalance={-0.05}
            warpStrength={1.5}
            warpFrequency={5.5}
            warpSpeed={2.5}
            warpAmplitude={60.0}
            blendAngle={30.0}
            blendSoftness={0.08}
            rotationAmount={600.0}
            noiseScale={2.0}
            grainAmount={0.05}
            grainScale={1.5}
            grainAnimated={true}
            contrast={1.5}
            gamma={0.95}
            saturation={1.2}
            centerX={0.0}
            centerY={0.0}
            zoom={0.85}
          />
        </div>
      </div>

      {/* Header — centered, no icon */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '8px' }}>
        <h1 style={{ fontSize: '32px', color: '#ffffff', margin: 0, fontWeight: 'normal' }}>Leaderboard</h1>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', margin: '6px 0 0', fontWeight: 'normal' }}>Ranked by MCQ test score</p>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
          <Spinner size="lg" />
        </div>
      )}
      {error && <Alert type="error" message={error} />}

      {/* Podium */}
      {!loading && leaderboard.length >= 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', alignItems: 'flex-end' }}>
          {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, idx) => {
            if (!entry) return <div key={idx} />;
            const rank = [2, 1, 3][idx];
            return (
              <PodiumCard key={entry.userId} entry={entry} rank={rank} isMe={entry.userId === user?.id} />
            );
          })}
        </div>
      )}

      {/* Full table */}
      {!loading && leaderboard.length > 0 && (
        <div style={{ ...glassCardStyle, padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {[["Rank", "60px"], ["Employee", null], ["Department", null], ["Score", "100px"], ["Accuracy", "100px"], ["Actions", "140px"]].map(([h, w]) => (
                  <th key={h} style={{
                    width: w ?? undefined,
                    padding: '14px 20px',
                    color: 'rgba(148,163,184,0.45)',
                    fontSize: '10px', textTransform: 'uppercase',
                    letterSpacing: '1.2px', fontWeight: 500,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => {
                const isMe = entry.userId === user?.id;
                const c = RANK_COLORS[entry.rank];
                const rowBg = isMe
                  ? "rgba(59,130,246,0.06)"
                  : entry.rank === 1 ? "rgba(251,191,36,0.03)"
                    : entry.rank === 2 ? "rgba(148,163,184,0.03)"
                      : entry.rank === 3 ? "rgba(180,130,70,0.03)"
                        : "transparent";

                return (
                  <tr
                    key={entry.userId}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: rowBg, transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(59,130,246,0.07)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = rowBg}
                  >
                    <td style={{ padding: '14px 20px', fontSize: '14px' }}>
                      {entry.rank === 1 ? "🥇"
                        : entry.rank === 2 ? "🥈"
                          : entry.rank === 3 ? "🥉"
                            : <span style={{ color: "rgba(148,163,184,0.5)", fontFamily: "monospace", fontSize: "12px" }}>#{entry.rank}</span>
                      }
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: "32px", height: "32px", borderRadius: "50%",
                          background: c ? c.bg : "rgba(148,163,184,0.08)",
                          border: `1px solid ${c ? c.border : "rgba(148,163,184,0.15)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "11px", fontWeight: 500,
                          color: c ? c.text : "rgba(148,163,184,0.5)",
                          flexShrink: 0,
                        }}>
                          {(entry.name || "").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '13px', color: '#F1F5F9' }}>{entry.name}</span>
                        {isMe && (
                          <span style={{
                            fontSize: "10px", background: "rgba(59,130,246,0.15)", color: "#60A5FA",
                            padding: "2px 7px", borderRadius: "4px", border: "1px solid rgba(59,130,246,0.3)",
                          }}>You</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: 'rgba(148,163,184,0.5)' }}>
                      {entry.department || "—"}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#10b981', fontFamily: 'monospace', textAlign: 'right' }}>
                      {formatPercent(entry.actualScore)}
                    </td>
                    <td style={{ padding: '14px 20px 14px 16px', fontSize: '13px', color: 'rgba(203,213,225,0.75)', fontFamily: 'monospace', textAlign: 'right' }}>
                      {formatPercent(entry.cai, 0)}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      {isMe ? (
                        <button
                          onClick={handleDownloadPDF}
                          disabled={downloading}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '6px 12px', borderRadius: '8px',
                            backgroundColor: '#2563eb', color: '#ffffff',
                            border: 'none', cursor: 'pointer', fontSize: '11px',
                            transition: 'background 0.2s', opacity: downloading ? 0.7 : 1
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        >
                          <FileText size={12} />
                          {downloading ? "Loading..." : "Download Report"}
                        </button>
                      ) : (
                        <span style={{ color: 'rgba(148,163,184,0.3)', fontSize: '11px' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tiny Cat Easter Egg */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        zIndex: 1000,
        fontFamily: 'monospace'
      }}>
        {showSpeech && (
          <div style={{
            backgroundColor: 'rgba(15, 18, 23, 0.95)',
            border: isAccessing ? '1px solid #10b981' : '1px solid rgba(168, 85, 247, 0.4)',
            borderRadius: '12px',
            padding: '10px 14px',
            color: isAccessing ? '#10b981' : '#ffffff',
            fontSize: '12px',
            marginBottom: '8px',
            maxWidth: '200px',
            boxShadow: isAccessing ? '0 0 15px rgba(16, 185, 129, 0.3)' : '0 4px 12px rgba(0,0,0,0.5)',
            position: 'relative',
            whiteSpace: 'pre-line'
          }}>
            {isAccessing ? (
              <span style={{ fontWeight: 'bold' }}>
                ACCESS GRANTED<br />
                Loading Developer's Hideout...
              </span>
            ) : speech}
            <div style={{
              position: 'absolute',
              bottom: '-6px',
              right: '20px',
              width: '10px',
              height: '10px',
              backgroundColor: 'rgba(15, 18, 23, 0.95)',
              borderBottom: isAccessing ? '1px solid #10b981' : '1px solid rgba(168, 85, 247, 0.4)',
              borderRight: isAccessing ? '1px solid #10b981' : '1px solid rgba(168, 85, 247, 0.4)',
              transform: 'rotate(45deg)'
            }} />
          </div>
        )}
        <button
          onClick={handleCatClick}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            color: isAccessing ? '#10b981' : 'rgba(255,255,255,0.4)',
            userSelect: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'color 0.2s, transform 0.2s',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            if (!isAccessing) e.currentTarget.style.color = '#c084fc';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            if (!isAccessing) e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <pre style={{ margin: 0, lineHeight: 1.1, fontFamily: 'monospace' }}>
{`  /\\_/\\
 ( o.o )
  > ^ <`}
          </pre>
        </button>
      </div>
    </div>
  );
}
