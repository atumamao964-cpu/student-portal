import { useState, useEffect } from 'react'
import studentsData from './data/students.json'
import coursesData from './data/courses.json'
import gradesData from './data/grades.json'
import attendanceData from './data/attendance.json'
import announcementsData from './data/announcements.json'
import './App.css'

// ========== LOGIN ==========
function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const student = studentsData.find(
      (s) => s.username === username && s.password === password
    )
    if (student) {
      onLogin(student)
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">🎓</div>
          <h1>Student Portal</h1>
          <p>Sign in to your university dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. angelyne"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="btn-primary">Sign In</button>
        </form>

        <div className="demo-accounts">
          <p><strong>Demo Accounts:</strong></p>
          <ul>
            <li><strong>angelyne / student123</strong> (You – PC1)</li>
            <li>john.doe / student123</li>
            <li>jane.smith / student123</li>
            <li>mike.wilson / student123</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ========== HELPERS ==========
function getLetterGrade(total) {
  if (total >= 90) return { letter: 'A', class: 'badge-a' }
  if (total >= 80) return { letter: 'B', class: 'badge-b' }
  if (total >= 70) return { letter: 'C', class: 'badge-c' }
  return { letter: 'D', class: 'badge-d' }
}

function getProgressClass(pct) {
  if (pct >= 90) return 'high'
  if (pct >= 75) return 'mid'
  return 'low'
}

// ========== MAIN DASHBOARD ==========
function Dashboard({ currentUser, onLogout }) {
  const [selectedId, setSelectedId] = useState(currentUser.id)
  const [search, setSearch] = useState('')

  const filteredStudents = studentsData.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase())
  )

  const student = studentsData.find((s) => s.id === selectedId) || currentUser
  const grades = gradesData[student.id] || []
  const attendance = attendanceData[student.id] || []
  const courses = coursesData[student.id] || []

  const avgGrade = grades.length
    ? Math.round(grades.reduce((sum, g) => sum + g.total, 0) / grades.length)
    : 0

  const avgAttendance = attendance.length
    ? Math.round(attendance.reduce((sum, a) => sum + a.percentage, 0) / attendance.length)
    : 0

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0)

  return (
    <div className="app-layout">
      {/* ===== LEFT SIDEBAR – STUDENT LIST ===== */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2><span>🎓</span> Students</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="student-list">
          {filteredStudents.map((s) => (
            <div
              key={s.id}
              className={`student-item ${selectedId === s.id ? 'active' : ''}`}
              onClick={() => setSelectedId(s.id)}
            >
              <div className="student-avatar">{s.avatar}</div>
              <div className="student-info">
                <h4>{s.name}</h4>
                <p>{s.id} · Year {s.year}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            Sign out ({currentUser.name.split(' ')[0]})
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">{student.avatar}</div>
          <div className="profile-details">
            <h1>{student.name}</h1>
            <div className="meta">
              <span>ID: {student.id}</span>
              <span>📧 {student.email}</span>
              <span>📚 {student.course}</span>
              <span>Year {student.year}</span>
              <span className="status-badge active">● Active</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="label">Average Grade</div>
            <div className="value">{avgGrade}%</div>
            <div className="sub">{grades.length} courses graded</div>
          </div>
          <div className="stat-card">
            <div className="label">Attendance</div>
            <div className="value">{avgAttendance}%</div>
            <div className="sub">Overall average</div>
          </div>
          <div className="stat-card">
            <div className="label">Courses</div>
            <div className="value">{courses.length}</div>
            <div className="sub">{totalCredits} total credits</div>
          </div>
          <div className="stat-card">
            <div className="label">Status</div>
            <div className="value" style={{ fontSize: 20, marginTop: 6 }}>
              {avgAttendance >= 75 ? 'Good Standing' : 'At Risk'}
            </div>
            <div className="sub">Academic status</div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Grades with Progress */}
            <div className="card">
              <div className="card-title">
                Academic Progress
                <span>Grade average</span>
              </div>
              {grades.length === 0 ? (
                <div className="empty">No grades yet</div>
              ) : (
                grades.map((g) => {
                  const grade = getLetterGrade(g.total)
                  return (
                    <div className="progress-item" key={g.code}>
                      <div className="progress-header">
                        <span className="name">{g.code} – {g.name}</span>
                        <span className="pct">
                          {g.total}% <span className={`badge ${grade.class}`}>{grade.letter}</span>
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className={`progress-fill ${getProgressClass(g.total)}`}
                          style={{ width: `${g.total}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Grades Table */}
            <div className="card">
              <div className="card-title">Detailed Grades</div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Course</th>
                      <th>Mid</th>
                      <th>Final</th>
                      <th>Assign</th>
                      <th>Total</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((g) => {
                      const grade = getLetterGrade(g.total)
                      return (
                        <tr key={g.code}>
                          <td>{g.code}</td>
                          <td>{g.name}</td>
                          <td>{g.midterm}</td>
                          <td>{g.final}</td>
                          <td>{g.assignment}</td>
                          <td><strong>{g.total}</strong></td>
                          <td><span className={`badge ${grade.class}`}>{grade.letter}</span></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Attendance */}
            <div className="card">
              <div className="card-title">
                Attendance
                <span>This semester</span>
              </div>
              {attendance.map((a) => (
                <div className="progress-item" key={a.code}>
                  <div className="progress-header">
                    <span className="name">{a.code}</span>
                    <span className="pct">{a.percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getProgressClass(a.percentage)}`}
                      style={{ width: `${a.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Courses */}
            <div className="card">
              <div className="card-title">Enrolled Courses</div>
              {courses.map((c) => (
                <div className="course-item" key={c.code}>
                  <div>
                    <span className="code">{c.code}</span>
                    <span className="name">{c.name}</span>
                    <div className="instructor">{c.instructor} · {c.credits} credits</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Announcements */}
            <div className="card">
              <div className="card-title">Announcements</div>
              {announcementsData.map((a) => (
                <div className="announcement" key={a.id}>
                  <h4>
                    {a.title}
                    <span className={`priority ${a.priority}`}>{a.priority}</span>
                  </h4>
                  <div className="date">{a.date}</div>
                  <p>{a.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// ========== APP ==========
function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('student')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const handleLogin = (student) => {
    setUser(student)
    sessionStorage.setItem('student', JSON.stringify(student))
  }

  const handleLogout = () => {
    setUser(null)
    sessionStorage.removeItem('student')
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return <Dashboard currentUser={user} onLogout={handleLogout} />
}

export default App
