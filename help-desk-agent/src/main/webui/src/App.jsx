import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState('')
  const [elapsedMs, setElapsedMs] = useState(0)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })
  const [health, setHealth] = useState(null)
  const [mode, setMode] = useState('single')
  const [comparison, setComparison] = useState(null)
  const [compLoading, setCompLoading] = useState(false)
  const [compElapsed, setCompElapsed] = useState(0)
  const timerRef = useRef(null)
  const compTimerRef = useRef(null)

  const processingStages = [
    'Waiting for 2-second artificial delay...',
    'Processing bloated JSON response...',
    'Simulating "enterprise mainframe" latency...',
    'Wasting tokens on unnecessary metadata...',
    'AI agent finally getting actual data...',
  ]

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

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

  useEffect(() => {
    if (loading) {
      const start = performance.now()
      const tick = () => {
        setElapsedMs(Math.round(performance.now() - start))
        timerRef.current = requestAnimationFrame(tick)
      }
      timerRef.current = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(timerRef.current)
    }
  }, [loading])

  useEffect(() => {
    if (compLoading) {
      const start = performance.now()
      const tick = () => {
        setCompElapsed(Math.round(performance.now() - start))
        compTimerRef.current = requestAnimationFrame(tick)
      }
      compTimerRef.current = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(compTimerRef.current)
    }
  }, [compLoading])

  const checkHealth = async () => {
    try {
      const res = await fetch('/health/status')
      const data = await res.json()
      setHealth(data)
    } catch {
      setHealth({ mcpServer: { connected: false }, openai: { connected: false }, agent: { connected: false } })
    }
  }

  const askAgent = async () => {
    if (!query.trim()) return
    setLoading(true)
    setResponse(null)
    setElapsedMs(0)

    try {
      const res = await fetch(`/agent/ask?query=${encodeURIComponent(query)}`, { cache: 'no-store' })
      const data = await res.json()
      setResponse(data)
    } catch (error) {
      setResponse({ error: error.message, durationMs: 0 })
    } finally {
      setLoading(false)
      setLoadingStage('')
    }
  }

  const askComparison = async () => {
    if (!query.trim()) return
    setCompLoading(true)
    setComparison(null)
    setCompElapsed(0)

    try {
      const q = query.toLowerCase()
      let url = '/api/compare?action=list'
      const ticketMatch = query.match(/TKT-\d+/i)

      if (ticketMatch) {
        if (q.includes('history') || q.includes('audit')) {
          url = `/api/compare?action=history&id=${ticketMatch[0].toUpperCase()}`
        } else {
          url = `/api/compare?action=get&id=${ticketMatch[0].toUpperCase()}`
        }
      } else if (q.includes('search') || q.includes('find') || q.includes('related')) {
        const words = query.replace(/search|find|for|tickets?|related|to|about|issues?/gi, '').trim()
        url = `/api/compare?action=search&keyword=${encodeURIComponent(words || query)}`
      }

      const res = await fetch(url, { cache: 'no-store' })
      const data = await res.json()
      setComparison(data)
    } catch (error) {
      setComparison({ error: error.message })
    } finally {
      setCompLoading(false)
    }
  }

  const retry = useCallback(() => {
    if (mode === 'compare') {
      askComparison()
    } else {
      askAgent()
    }
  }, [mode, query])

  const handleSubmit = () => {
    if (mode === 'compare') {
      askComparison()
    } else {
      askAgent()
    }
  }

  const formatMs = (ms) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const exampleQueries = [
    { label: 'Basic Lookup', query: 'Get details for ticket TKT-101' },
    { label: 'List & Prioritize', query: 'List all tickets and prioritize them by severity' },
    { label: 'Search', query: 'Search for tickets related to security issues' },
    { label: 'Multi-step', query: 'Find the most urgent ticket and suggest resolution steps' },
    { label: 'Bulk Analysis', query: 'Analyze all tickets, categorize them, and recommend team assignments' },
  ]

  const StatusDot = ({ connected, label }) => (
    <div className="status-dot-wrapper" title={label}>
      <span className={`status-dot ${connected ? 'connected' : 'disconnected'}`} />
      <span className="status-label">{label}</span>
    </div>
  )

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-top-row">
            {health && (
              <div className="status-bar">
                <StatusDot connected={health.mcpServer?.connected} label="MCP Server" />
                <StatusDot connected={health.agent?.connected} label="Agent" />
                <StatusDot connected={health.openai?.connected} label="OpenAI" />
              </div>
            )}
            <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)} title="Toggle dark mode">
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <div className="scenario-badge">
            Scenario: The "Over-Engineered" Help Desk Server
          </div>
          <h1 className="title">MCP Micro-Server Architecture Demo</h1>
          <p className="subtitle">See the difference: Over-Engineered vs. Clean MCP Design</p>
        </div>
      </header>

      <main className="main">
        <div className="container">

          <div className="aha-banner">
            <div className="aha-content">
              <h2>The "Aha!" Moment</h2>
              <p>When MCP's micro-server architecture finally pays for itself by avoiding over-engineering!</p>
            </div>
          </div>

          <div className="comparison-grid">
            <div className="comparison-card bad">
              <div className="card-header">
                <h3>Over-Engineered Server</h3>
                <span className="badge-bad">What You're Using Now</span>
              </div>
              <div className="card-body">
                <div className="problem-list">
                  <div className="problem-item">
                    <div>
                      <strong>Artificial 2-Second Delay</strong>
                      <p>Simulates "enterprise mainframe" for no reason</p>
                    </div>
                  </div>
                  <div className="problem-item">
                    <div>
                      <strong>Bloated JSON Responses</strong>
                      <p>Unnecessary metadata wastes tokens and bandwidth</p>
                    </div>
                  </div>
                  <div className="problem-item">
                    <div>
                      <strong>Over-Verbose Tool Descriptions</strong>
                      <p>Complex descriptions confuse the AI agent</p>
                    </div>
                  </div>
                  <div className="problem-item">
                    <div>
                      <strong>Token Waste</strong>
                      <p>Complex responses increase API costs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="comparison-card good">
              <div className="card-header">
                <h3>Clean MCP SDK</h3>
                <span className="badge-good">Best Practice</span>
              </div>
              <div className="card-body">
                <div className="solution-list">
                  <div className="solution-item">
                    <div>
                      <strong>Direct Database Access</strong>
                      <p>No artificial delays, instant responses</p>
                    </div>
                  </div>
                  <div className="solution-item">
                    <div>
                      <strong>Minimal, Clean Responses</strong>
                      <p>Only essential data, reducing token costs</p>
                    </div>
                  </div>
                  <div className="solution-item">
                    <div>
                      <strong>Concise Tool Descriptions</strong>
                      <p>Clear, focused descriptions the AI understands</p>
                    </div>
                  </div>
                  <div className="solution-item">
                    <div>
                      <strong>Token Optimization</strong>
                      <p>Concise responses reduce API expenses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card try-it-card">
            <h2>Experience the Difference</h2>
            <p className="description">
              Try asking questions below. Choose "Single Query" to send through the AI agent,
              or "Compare Tools" to see raw MCP tool execution speed side-by-side.
            </p>

            <div className="mode-toggle">
              <button
                className={`mode-btn ${mode === 'single' ? 'active' : ''}`}
                onClick={() => setMode('single')}
              >
                Single Query
              </button>
              <button
                className={`mode-btn ${mode === 'compare' ? 'active' : ''}`}
                onClick={() => setMode('compare')}
              >
                Compare Tools
              </button>
            </div>

            <div className="query-section">
              <label className="label">Ask the Help Desk Agent:</label>
              <textarea
                className="textarea"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try one of the examples below..."
                rows="3"
                disabled={loading || compLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) handleSubmit()
                }}
              />

              <button
                className={`button ${loading || compLoading ? 'loading' : ''}`}
                onClick={handleSubmit}
                disabled={loading || compLoading || !query.trim()}
              >
                {loading || compLoading
                  ? `Processing... ${formatMs(mode === 'compare' ? compElapsed : elapsedMs)}`
                  : mode === 'compare'
                    ? 'Compare Tool Execution'
                    : 'Send Query (Notice the Delay!)'
                }
              </button>
              <p className="hint">Press Ctrl+Enter to submit</p>
            </div>

            <div className="examples">
              <p className="examples-title">Example Queries:</p>
              <div className="examples-grid">
                {exampleQueries.map((ex, idx) => (
                  <button
                    key={idx}
                    className="example-btn"
                    onClick={() => setQuery(ex.query)}
                    disabled={loading || compLoading}
                  >
                    <span className="example-label">{ex.label}</span>
                    <span className="example-query">{ex.query}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Single mode loading */}
          {loading && (
            <div className="response-container">
              <div className="loading-stage">
                <div className="spinner" />
                <div className="elapsed-counter">{formatMs(elapsedMs)}</div>
                <p className="loading-text">{loadingStage}</p>
                <div className="progress-bar">
                  <div className="progress-fill" />
                </div>
                {elapsedMs > 15000 && (
                  <p className="loading-warning">
                    The AI is taking longer than expected. This is normal for complex queries.
                  </p>
                )}
                <p className="loading-hint">
                  This delay is intentional to demonstrate poor architecture!
                </p>
              </div>
            </div>
          )}

          {/* Single mode response */}
          {response && !loading && (
            <div className="response-container">
              <div className="response-card">
                <div className="response-header">
                  <h3>Response</h3>
                  {response.durationMs > 0 && (
                    <span className="duration-badge bad">{formatMs(response.durationMs)}</span>
                  )}
                </div>
                {response.error ? (
                  <div className="error-content">
                    <p className="error-text">{response.error}</p>
                    <button className="retry-btn" onClick={retry}>Retry</button>
                  </div>
                ) : (
                  <>
                    <div className="response-content">{response.response}</div>
                    <p className="response-note">
                      In a clean MCP implementation, this would be significantly faster!
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Comparison mode loading */}
          {compLoading && (
            <div className="response-container">
              <div className="loading-stage">
                <div className="spinner" />
                <div className="elapsed-counter">{formatMs(compElapsed)}</div>
                <p className="loading-text">Running both paths for comparison...</p>
                <div className="progress-bar">
                  <div className="progress-fill" />
                </div>
              </div>
            </div>
          )}

          {/* Comparison mode results */}
          {comparison && !compLoading && (
            <div className="response-container">
              {comparison.error ? (
                <div className="response-card">
                  <div className="error-content">
                    <p className="error-text">{comparison.error}</p>
                    <button className="retry-btn" onClick={retry}>Retry</button>
                  </div>
                </div>
              ) : (
                <>
                  {comparison.speedup && (
                    <div className="speedup-banner">
                      <span className="speedup-value">{comparison.speedup}</span>
                      <span className="speedup-label">Clean MCP is faster</span>
                    </div>
                  )}
                  <div className="comparison-results">
                    <div className="comparison-result bad">
                      <div className="result-header">
                        <h3>Over-Engineered</h3>
                        <span className="duration-badge bad">{formatMs(comparison.overEngineered?.durationMs || 0)}</span>
                      </div>
                      <div className="timing-bar-container">
                        <div
                          className="timing-bar bad"
                          style={{ width: '100%' }}
                        />
                      </div>
                      {comparison.overEngineered?.error ? (
                        <div className="error-content">
                          <p className="error-text">{comparison.overEngineered.error}</p>
                        </div>
                      ) : (
                        <div className="response-content">{comparison.overEngineered?.response}</div>
                      )}
                    </div>

                    <div className="comparison-result good">
                      <div className="result-header">
                        <h3>Clean MCP</h3>
                        <span className="duration-badge good">{formatMs(comparison.clean?.durationMs || 0)}</span>
                      </div>
                      <div className="timing-bar-container">
                        <div
                          className="timing-bar good"
                          style={{
                            width: comparison.overEngineered?.durationMs > 0
                              ? `${Math.max(5, (comparison.clean?.durationMs / comparison.overEngineered?.durationMs) * 100)}%`
                              : '50%'
                          }}
                        />
                      </div>
                      {comparison.clean?.error ? (
                        <div className="error-content">
                          <p className="error-text">{comparison.clean.error}</p>
                        </div>
                      ) : (
                        <div className="response-content">{comparison.clean?.response}</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="solution-section">
            <h2>The MCP Micro-Server Solution</h2>
            <div className="solution-grid">
              <div className="solution-card">
                <h3>Micro-Server Architecture</h3>
                <p>MCP encourages small, focused servers that do one thing well. No bloated monoliths.</p>
              </div>
              <div className="solution-card">
                <h3>Standardized Interface</h3>
                <p>MCP SDK provides clean, consistent tool definitions. AI agents auto-discover your tools.</p>
              </div>
              <div className="solution-card">
                <h3>Performance First</h3>
                <p>Quarkus + MCP = fast startup, low latency. Perfect for cloud-native deployments.</p>
              </div>
              <div className="solution-card">
                <h3>Cost Optimization</h3>
                <p>Clean responses mean fewer tokens. Less latency = happier users and lower costs.</p>
              </div>
            </div>
          </div>

          <div className="tech-stack-card">
            <h3>Tech Stack</h3>
            <div className="tech-badges">
              <div className="tech-badge">
                <strong>MCP SDK</strong>
                <p>Model Context Protocol</p>
              </div>
              <div className="tech-badge">
                <strong>Quarkus</strong>
                <p>Supersonic Java</p>
              </div>
              <div className="tech-badge">
                <strong>LangChain4j</strong>
                <p>Java AI Framework</p>
              </div>
              <div className="tech-badge">
                <strong>OpenAI</strong>
                <p>GPT Models</p>
              </div>
            </div>
          </div>

          <div className="takeaways-card">
            <h3>Key Takeaways</h3>
            <div className="takeaway-list">
              <div className="takeaway-item">
                <span className="check">{'✓'}</span>
                <p><strong>MCP prevents over-engineering</strong> by encouraging focused, single-purpose servers</p>
              </div>
              <div className="takeaway-item">
                <span className="check">{'✓'}</span>
                <p><strong>Micro-servers are faster</strong> - no artificial delays or unnecessary processing</p>
              </div>
              <div className="takeaway-item">
                <span className="check">{'✓'}</span>
                <p><strong>Clean design saves money</strong> - optimized responses reduce token costs</p>
              </div>
              <div className="takeaway-item">
                <span className="check">{'✓'}</span>
                <p><strong>Quarkus + MCP = perfect match</strong> - fast startup, low overhead, cloud-ready</p>
              </div>
              <div className="takeaway-item">
                <span className="check">{'✓'}</span>
                <p><strong>Better developer experience</strong> - simple, maintainable code vs. complex architectures</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="footer">
        <p>
          This demo intentionally shows BAD practices to highlight MCP's benefits
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
