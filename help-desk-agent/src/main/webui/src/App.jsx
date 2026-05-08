import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState('')
  const [showResponse, setShowResponse] = useState(false)

  const processingStages = [
    '⏰ Waiting for 2-second artificial delay...',
    '📊 Processing bloated JSON response...',
    '🐌 Simulating "enterprise mainframe" latency...',
    '💸 Wasting tokens on unnecessary metadata...',
    '🤖 AI agent finally getting actual data...',
  ]

  useEffect(() => {
    if (loading) {
      let stage = 0
      const interval = setInterval(() => {
        setLoadingStage(processingStages[stage % processingStages.length])
        stage++
      }, 1200)
      return () => clearInterval(interval)
    }
  }, [loading])

  const askAgent = async () => {
    if (!query.trim()) return

    setLoading(true)
    setResponse('')
    setShowResponse(true)

    try {
      const res = await fetch(`/agent/ask?query=${encodeURIComponent(query)}`)
      const text = await res.text()
      setResponse(text)
    } catch (error) {
      setResponse(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
      setLoadingStage('')
    }
  }

  const exampleQueries = [
    'List all tickets and tell me which one sounds most urgent',
    'Get details for ticket TKT-101',
    'What tickets are available?',
    'Analyze all tickets and prioritize them by severity'
  ]

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="scenario-badge">
            📋 Scenario: The "Over-Engineered" Help Desk Server
          </div>
          <h1 className="title">
            MCP Micro-Server Architecture Demo
          </h1>
          <p className="subtitle">
            See the difference: Over-Engineered vs. Clean MCP Design
          </p>
        </div>
      </header>

      <main className="main">
        <div className="container">

          {/* The Aha Moment Banner */}
          <div className="aha-banner">
            <div className="lightbulb">💡</div>
            <div className="aha-content">
              <h2>The "Aha!" Moment</h2>
              <p>When MCP's micro-server architecture finally pays for itself by avoiding over-engineering!</p>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="comparison-grid">
            <div className="comparison-card bad">
              <div className="card-header">
                <span className="icon">😰</span>
                <h3>Over-Engineered Server</h3>
                <span className="badge-bad">What You're Using Now</span>
              </div>
              <div className="card-body">
                <div className="problem-list">
                  <div className="problem-item">
                    <span className="problem-icon">⏰</span>
                    <div>
                      <strong>Artificial 2-Second Delay</strong>
                      <p>Simulates "enterprise mainframe" for no reason</p>
                    </div>
                  </div>
                  <div className="problem-item">
                    <span className="problem-icon">📊</span>
                    <div>
                      <strong>Bloated JSON Responses</strong>
                      <p>Unnecessary metadata wastes tokens and bandwidth</p>
                    </div>
                  </div>
                  <div className="problem-item">
                    <span className="problem-icon">🐌</span>
                    <div>
                      <strong>High Latency & Inefficiency</strong>
                      <p>Poor user experience, higher costs</p>
                    </div>
                  </div>
                  <div className="problem-item">
                    <span className="problem-icon">💸</span>
                    <div>
                      <strong>Token Waste</strong>
                      <p>Complex responses increase API costs</p>
                    </div>
                  </div>
                </div>
                <div className="metrics bad">
                  <div className="metric">
                    <strong>Latency:</strong> 2000ms+ delay
                  </div>
                  <div className="metric">
                    <strong>Tokens:</strong> Highly Inefficient
                  </div>
                  <div className="metric">
                    <strong>Complexity:</strong> Unnecessarily High
                  </div>
                </div>
              </div>
            </div>

            <div className="comparison-card good">
              <div className="card-header">
                <span className="icon">✨</span>
                <h3>Clean MCP SDK</h3>
                <span className="badge-good">Best Practice</span>
              </div>
              <div className="card-body">
                <div className="solution-list">
                  <div className="solution-item">
                    <span className="solution-icon">⚡</span>
                    <div>
                      <strong>Optimized Response Times</strong>
                      <p>Direct database access, no artificial delays</p>
                    </div>
                  </div>
                  <div className="solution-item">
                    <span className="solution-icon">📦</span>
                    <div>
                      <strong>Minimal, Clean JSON</strong>
                      <p>Only essential data, reducing token costs</p>
                    </div>
                  </div>
                  <div className="solution-item">
                    <span className="solution-icon">🚀</span>
                    <div>
                      <strong>Low Latency & High Efficiency</strong>
                      <p>Fast responses, better UX, lower costs</p>
                    </div>
                  </div>
                  <div className="solution-item">
                    <span className="solution-icon">💰</span>
                    <div>
                      <strong>Token Optimization</strong>
                      <p>Concise responses reduce API expenses</p>
                    </div>
                  </div>
                </div>
                <div className="metrics good">
                  <div className="metric">
                    <strong>Latency:</strong> &lt;100ms typical
                  </div>
                  <div className="metric">
                    <strong>Tokens:</strong> Optimized
                  </div>
                  <div className="metric">
                    <strong>Complexity:</strong> Appropriate
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Try It Section */}
          <div className="card try-it-card">
            <h2>🧪 Experience the Micro-MCP Server</h2>
            <p className="description">
              Try asking questions below. Notice the artificial 2-second delay and watch
              how this over-engineered approach impacts user experience.
            </p>

            <div className="query-section">
              <label className="label">Ask the Help Desk Agent:</label>
              <textarea
                className="textarea"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try one of the examples below..."
                rows="3"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    askAgent()
                  }
                }}
              />

              <button
                className={`button ${loading ? 'loading' : ''}`}
                onClick={askAgent}
                disabled={loading}
              >
                {loading ? '⏳ Waiting for slow server...' : '🚀 Send Query (Notice the Delay!)'}
              </button>
              <p className="hint">Press Ctrl+Enter to submit</p>
            </div>

            <div className="examples">
              <p className="examples-title">💡 Example Queries:</p>
              {exampleQueries.map((ex, idx) => (
                <button
                  key={idx}
                  className="example-btn"
                  onClick={() => setQuery(ex)}
                  disabled={loading}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {showResponse && (
            <div className="response-container">
              {loading && (
                <div className="loading-stage">
                  <div className="spinner"></div>
                  <p className="loading-text">{loadingStage}</p>
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                  <p className="loading-hint">
                    ⚠️ This delay is intentional to demonstrate poor architecture!
                  </p>
                </div>
              )}

              {response && !loading && (
                <div className="response-card">
                  <h3>🤖 Response (Finally!):</h3>
                  <div className="response-content">
                    {response}
                  </div>
                  <p className="response-note">
                    💡 In a clean MCP implementation, this would be nearly instant!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* MCP Solution Section */}
          <div className="solution-section">
            <h2>🎯 The MCP Micro-Server Solution</h2>

            <div className="solution-grid">
              <div className="solution-card">
                <div className="solution-icon-large">🏗️</div>
                <h3>Micro-Server Architecture</h3>
                <p>
                  MCP encourages small, focused servers that do one thing well.
                  No bloated monoliths, no unnecessary complexity.
                </p>
              </div>

              <div className="solution-card">
                <div className="solution-icon-large">🔌</div>
                <h3>Standardized Interface</h3>
                <p>
                  MCP SDK provides clean, consistent tool definitions.
                  AI agents automatically discover and use your tools.
                </p>
              </div>

              <div className="solution-card">
                <div className="solution-icon-large">⚡</div>
                <h3>Performance First</h3>
                <p>
                  Quarkus + MCP = fast startup, low latency, efficient execution.
                  Perfect for containerized, cloud-native deployments.
                </p>
              </div>

              <div className="solution-card">
                <div className="solution-icon-large">💰</div>
                <h3>Cost Optimization</h3>
                <p>
                  Clean responses mean fewer tokens consumed.
                  Less latency = happier users and lower cloud costs.
                </p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="tech-stack-card">
            <h3>🛠️ Tech Stack</h3>
            <div className="tech-badges">
              <div className="tech-badge">
                <span className="tech-icon">🔌</span>
                <strong>MCP SDK</strong>
                <p>Model Context Protocol</p>
              </div>
              <div className="tech-badge">
                <span className="tech-icon">⚡</span>
                <strong>Quarkus</strong>
                <p>Supersonic Java</p>
              </div>
              <div className="tech-badge">
                <span className="tech-icon">🤖</span>
                <strong>LangChain4j</strong>
                <p>Java AI Framework</p>
              </div>
              <div className="tech-badge">
                <span className="tech-icon">🧠</span>
                <strong>OpenAI</strong>
                <p>GPT Models</p>
              </div>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="takeaways-card">
            <h3>✅ Key Takeaways</h3>
            <div className="takeaway-list">
              <div className="takeaway-item">
                <span className="check">✓</span>
                <p><strong>MCP prevents over-engineering</strong> by encouraging focused, single-purpose servers</p>
              </div>
              <div className="takeaway-item">
                <span className="check">✓</span>
                <p><strong>Micro-servers are faster</strong> - no artificial delays or unnecessary processing</p>
              </div>
              <div className="takeaway-item">
                <span className="check">✓</span>
                <p><strong>Clean design saves money</strong> - optimized responses reduce token costs</p>
              </div>
              <div className="takeaway-item">
                <span className="check">✓</span>
                <p><strong>Quarkus + MCP = perfect match</strong> - fast startup, low overhead, cloud-ready</p>
              </div>
              <div className="takeaway-item">
                <span className="check">✓</span>
                <p><strong>Better developer experience</strong> - simple, maintainable code vs. complex architectures</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="footer">
        <p>
          💡 This demo intentionally shows BAD practices to highlight MCP's benefits
          {' • '}
          <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">Learn MCP</a>
          {' • '}
          <a href="https://quarkus.io" target="_blank" rel="noopener noreferrer">Quarkus</a>
          {' • '}
          <a href="https://github.com/langchain4j/langchain4j" target="_blank" rel="noopener noreferrer">LangChain4j</a>
        </p>
      </footer>
    </div>
  )
}

export default App
