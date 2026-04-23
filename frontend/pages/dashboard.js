import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Container, Row, Col, Card, ProgressBar, Badge, Button, Modal, Form, Spinner } from 'react-bootstrap';
import Layout from '../components/Layout';
import { useAuth } from '../services/auth';

const API_URL = 'http://localhost:8000';

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newProgress, setNewProgress] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({ courses: 0, hours: 0, skills: 0, avg: 0 });

  useEffect(() => {
    setMounted(true);
    if (!authLoading && !isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router, authLoading]);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      const [coursesRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/user-courses`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/user-courses/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (coursesRes.ok) {
        const data = await coursesRes.json();
        setEnrolledCourses(data);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated()) {
      fetchData();
    }
  }, [mounted, isAuthenticated, fetchData]);

  // Animate stats on load
  useEffect(() => {
    if (stats) {
      const duration = 1200;
      const steps = 40;
      const interval = duration / steps;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        setAnimatedStats({
          courses: Math.round(stats.total_courses * ease),
          hours: Math.round(stats.total_hours * ease),
          skills: Math.round(stats.skills_count * ease),
          avg: Math.round(stats.avg_progress * ease)
        });
        if (step >= steps) clearInterval(timer);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [stats]);

  const handleUpdateProgress = async () => {
    if (!selectedCourse) return;
    setUpdating(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/api/user-courses/${selectedCourse.id}/progress`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: parseInt(newProgress) })
      });
      if (res.ok) {
        await fetchData();
        setShowProgressModal(false);
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleUnenroll = async (courseId) => {
    if (!confirm('Are you sure you want to unenroll from this course?')) return;
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/api/user-courses/${courseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Failed to unenroll:', err);
    }
  };

  const openProgressModal = (course) => {
    setSelectedCourse(course);
    setNewProgress(course.progress);
    setShowProgressModal(true);
  };

  const filteredCourses = enrolledCourses.filter(c => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in_progress') return c.status === 'in_progress';
    if (activeTab === 'completed') return c.status === 'completed';
    return true;
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'Coursera': { bg: 'rgba(0, 86, 210, 0.1)', text: '#0056D2', border: '#0056D2' },
      'Udemy': { bg: 'rgba(165, 82, 204, 0.1)', text: '#A435F0', border: '#A435F0' },
      'edX': { bg: 'rgba(0, 50, 98, 0.1)', text: '#003262', border: '#003262' }
    };
    return colors[platform] || { bg: 'rgba(99,102,241,0.1)', text: '#6366f1', border: '#6366f1' };
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Technology': 'bi-code-slash',
      'Data Science': 'bi-bar-chart',
      'Marketing': 'bi-graph-up',
      'Design': 'bi-palette',
      'Business': 'bi-briefcase',
      'Finance': 'bi-currency-dollar'
    };
    return icons[category] || 'bi-laptop';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  if (!mounted || authLoading || !isAuthenticated()) return null;

  return (
    <Layout title="Personal Dashboard">
      <Head>
        <title>My Dashboard | CareerPath AI</title>
        <meta name="description" content="Track your learning progress, enrolled courses, and career development" />
      </Head>

      <div style={{ background: 'var(--light)', minHeight: '100vh', paddingBottom: '4rem' }}>
        {/* ── Hero Header ──────────────────────────────────────── */}
        <div className="dashboard-hero">
          <div className="dashboard-hero-orb dashboard-hero-orb-1"></div>
          <div className="dashboard-hero-orb dashboard-hero-orb-2"></div>
          <div className="dashboard-hero-orb dashboard-hero-orb-3"></div>
          <Container style={{ position: 'relative', zIndex: 2 }}>
            <Row className="align-items-center">
              <Col lg={7}>
                <div className="fade-in">
                  <span className="badge bg-white text-primary mb-3 px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '0.85rem' }}>
                    <i className="bi bi-speedometer2 me-1"></i> Personal Dashboard
                  </span>
                  <h1 className="fw-bold display-5 mb-2 text-white">
                    {getGreeting()}, {user?.full_name?.split(' ')[0] || 'Student'}! 👋
                  </h1>
                  <p className="lead mb-0" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    {enrolledCourses.length > 0 
                      ? `You're pursuing ${enrolledCourses.length} course${enrolledCourses.length > 1 ? 's' : ''}. Keep up the momentum!` 
                      : 'Start your learning journey by enrolling in courses below.'}
                  </p>
                </div>
              </Col>
              <Col lg={5} className="text-lg-end mt-4 mt-lg-0">
                <div className="d-flex gap-2 justify-content-lg-end flex-wrap">
                  <Button variant="light" className="rounded-pill px-4 py-2 fw-semibold" onClick={() => router.push('/#skill-development')}>
                    <i className="bi bi-plus-lg me-2"></i> Browse Courses
                  </Button>
                  <Button variant="outline-light" className="rounded-pill px-4 py-2" onClick={() => router.push('/quiz')}>
                    <i className="bi bi-arrow-repeat me-2"></i> Career Quiz
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <Container>
          {/* ── Stats Cards ────────────────────────────────────── */}
          <Row className="g-3 mb-4" style={{ marginTop: '-60px', position: 'relative', zIndex: 3 }}>
            {[
              { icon: 'bi-journal-bookmark-fill', label: 'Enrolled Courses', value: animatedStats.courses, color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
              { icon: 'bi-clock-history', label: 'Learning Hours', value: animatedStats.hours, color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
              { icon: 'bi-lightning-charge-fill', label: 'Skills Acquired', value: animatedStats.skills, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
              { icon: 'bi-graph-up-arrow', label: 'Avg. Progress', value: `${animatedStats.avg}%`, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' }
            ].map((stat, i) => (
              <Col xs={6} lg={3} key={i}>
                <div className="dashboard-stat-card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="dashboard-stat-icon" style={{ background: stat.gradient }}>
                    <i className={`bi ${stat.icon}`}></i>
                  </div>
                  <div className="dashboard-stat-value">{stat.value}</div>
                  <div className="dashboard-stat-label">{stat.label}</div>
                </div>
              </Col>
            ))}
          </Row>

          {dashboardLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading your learning data...</p>
            </div>
          ) : (
            <Row className="g-4">
              {/* ── Left Column: Courses ───────────────────────── */}
              <Col lg={8}>
                {/* Course Filter Tabs */}
                <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                  <h4 className="fw-bold mb-0" style={{ color: 'var(--primary-dark)' }}>
                    <i className="bi bi-journal-code me-2 text-primary"></i>
                    My Learning Journey
                  </h4>
                  <div className="dashboard-tabs">
                    {[
                      { key: 'all', label: 'All', count: enrolledCourses.length },
                      { key: 'in_progress', label: 'In Progress', count: enrolledCourses.filter(c => c.status === 'in_progress').length },
                      { key: 'completed', label: 'Completed', count: enrolledCourses.filter(c => c.status === 'completed').length }
                    ].map(tab => (
                      <button
                        key={tab.key}
                        className={`dashboard-tab ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                      >
                        {tab.label}
                        <span className="dashboard-tab-count">{tab.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {filteredCourses.length === 0 ? (
                  <Card className="border-0 shadow-sm text-center p-5" style={{ borderRadius: '20px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                      {activeTab === 'completed' ? '🎯' : '📚'}
                    </div>
                    <h5 className="fw-bold text-muted mb-2">
                      {activeTab === 'completed' ? 'No completed courses yet' : activeTab === 'in_progress' ? 'No courses in progress' : 'No courses enrolled yet'}
                    </h5>
                    <p className="text-muted mb-3">
                      {activeTab === 'all' ? 'Explore our skill development section and enroll in your first course!' : 'Keep learning to see progress here!'}
                    </p>
                    {activeTab === 'all' && (
                      <Button variant="primary" className="rounded-pill px-4" onClick={() => router.push('/')}>
                        <i className="bi bi-search me-2"></i> Explore Courses
                      </Button>
                    )}
                  </Card>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {filteredCourses.map((course, i) => {
                      const platColor = getPlatformColor(course.platform);
                      return (
                        <Card
                          key={course.id}
                          className="border-0 shadow-sm dashboard-course-card fade-in"
                          style={{ borderRadius: '16px', animationDelay: `${i * 0.05}s`, overflow: 'visible' }}
                        >
                          <Card.Body className="p-0">
                            <div className="d-flex flex-column flex-md-row">
                              {/* Course Icon Section */}
                              <div className="dashboard-course-icon-section" style={{ background: platColor.bg }}>
                                <i className={`bi ${getCategoryIcon(course.category)}`} style={{ fontSize: '2rem', color: platColor.text }}></i>
                                <span className="mt-2 fw-bold" style={{ fontSize: '0.65rem', color: platColor.text, letterSpacing: '1px', textTransform: 'uppercase' }}>
                                  {course.platform}
                                </span>
                              </div>

                              {/* Course Details */}
                              <div className="flex-grow-1 p-3 p-md-4">
                                <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                                  <div className="flex-grow-1">
                                    <h5 className="fw-bold mb-1" style={{ fontSize: '1.05rem' }}>{course.course_title}</h5>
                                    <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                                      <Badge bg="light" text="dark" className="border" style={{ fontSize: '0.7rem' }}>
                                        <i className="bi bi-tag me-1"></i>{course.category}
                                      </Badge>
                                      <Badge bg="light" text="dark" className="border" style={{ fontSize: '0.7rem' }}>
                                        <i className="bi bi-signal me-1"></i>{course.level}
                                      </Badge>
                                      <Badge bg="light" text="dark" className="border" style={{ fontSize: '0.7rem' }}>
                                        <i className="bi bi-clock me-1"></i>{course.duration}
                                      </Badge>
                                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                        <i className="bi bi-calendar3 me-1"></i>Last: {formatDate(course.last_accessed)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="d-flex align-items-center gap-2">
                                    {course.status === 'completed' ? (
                                      <Badge bg="success" className="px-3 py-2" style={{ fontSize: '0.8rem' }}>
                                        <i className="bi bi-trophy-fill me-1"></i> Completed
                                      </Badge>
                                    ) : (
                                      <div className="text-end">
                                        <span className="fw-bold" style={{
                                          fontSize: '1.5rem',
                                          background: course.progress > 70 ? 'linear-gradient(135deg, #10b981, #06b6d4)' :
                                                     course.progress > 40 ? 'linear-gradient(135deg, #f59e0b, #ef4444)' :
                                                     'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                          WebkitBackgroundClip: 'text',
                                          WebkitTextFillColor: 'transparent'
                                        }}>{course.progress}%</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-3">
                                  <div className="dashboard-progress-track">
                                    <div
                                      className="dashboard-progress-fill"
                                      style={{
                                        width: `${course.progress}%`,
                                        background: course.progress >= 100 ? 'linear-gradient(90deg, #10b981, #06b6d4)' :
                                                   course.progress > 50 ? 'linear-gradient(90deg, #6366f1, #8b5cf6)' :
                                                   'linear-gradient(90deg, #f59e0b, #ef4444)'
                                      }}
                                    ></div>
                                  </div>
                                </div>

                                {/* Skills */}
                                <div className="d-flex flex-wrap gap-1 mb-3">
                                  {(course.skills || []).map((skill, j) => (
                                    <span key={j} className="dashboard-skill-tag">{skill}</span>
                                  ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="d-flex gap-2 flex-wrap">
                                  <Button
                                    size="sm"
                                    variant="primary"
                                    className="rounded-pill px-3"
                                    onClick={() => window.open(course.platform_url || `https://www.${course.platform?.toLowerCase()}.com`, '_blank')}
                                  >
                                    <i className="bi bi-play-fill me-1"></i>
                                    {course.status === 'completed' ? 'Review' : 'Continue Learning'}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-primary"
                                    className="rounded-pill px-3"
                                    onClick={() => openProgressModal(course)}
                                  >
                                    <i className="bi bi-pencil me-1"></i> Update Progress
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    className="rounded-pill px-3"
                                    onClick={() => handleUnenroll(course.id)}
                                  >
                                    <i className="bi bi-x-lg me-1"></i> Unenroll
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </Col>

              {/* ── Right Column: Profile & Insights ───────────── */}
              <Col lg={4}>
                {/* Profile Summary */}
                <Card className="border-0 shadow-sm mb-4 dashboard-profile-card" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #1e1b4b, #4338ca)',
                    padding: '2rem 1.5rem 3rem',
                    textAlign: 'center',
                    position: 'relative'
                  }}>
                    <div className="dashboard-hero-orb" style={{ width: '150px', height: '150px', top: '-30px', right: '-30px', opacity: 0.3 }}></div>
                    <div style={{
                      width: '85px', height: '85px',
                      background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '2.2rem', color: 'white', fontWeight: 800,
                      margin: '0 auto 0.75rem',
                      boxShadow: '0 10px 30px rgba(99,102,241,0.4)',
                      border: '3px solid rgba(255,255,255,0.3)'
                    }}>
                      {user?.full_name?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <h5 className="fw-bold mb-0 text-white">{user?.full_name || 'Student'}</h5>
                    <p className="mb-0" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{user?.email || ''}</p>
                  </div>
                  <Card.Body className="p-4" style={{ marginTop: '-1rem' }}>
                    <div className="d-flex justify-content-between text-center">
                      {[
                        { value: stats?.total_courses || 0, label: 'Enrolled' },
                        { value: stats?.completed || 0, label: 'Done' },
                        { value: `${stats?.avg_progress || 0}%`, label: 'Progress' }
                      ].map((item, i) => (
                        <div key={i} className="flex-fill">
                          <h4 className="fw-bold mb-0 text-gradient">{item.value}</h4>
                          <small className="text-muted fw-semibold">{item.label}</small>
                        </div>
                      ))}
                    </div>
                    <hr style={{ opacity: 0.1 }} />
                    <Button variant="outline-primary" className="w-100 rounded-pill" size="sm" onClick={() => router.push('/profile')}>
                      <i className="bi bi-person-gear me-2"></i> Edit Profile
                    </Button>
                  </Card.Body>
                </Card>

                {/* Skills Acquired */}
                {stats && stats.skills && stats.skills.length > 0 && (
                  <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '20px' }}>
                    <Card.Body className="p-4">
                      <h5 className="fw-bold mb-3" style={{ color: 'var(--primary-dark)' }}>
                        <i className="bi bi-stars me-2 text-warning"></i>
                        Skills Portfolio
                      </h5>
                      <div className="d-flex flex-wrap gap-2">
                        {stats.skills.map((skill, i) => (
                          <span key={i} className="dashboard-skill-badge">{skill}</span>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '20px' }}>
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-3" style={{ color: 'var(--primary-dark)' }}>
                      <i className="bi bi-lightning-charge me-2 text-warning"></i>
                      Quick Actions
                    </h5>
                    <div className="d-flex flex-column gap-2">
                      {[
                        { icon: 'bi-search', label: 'Explore Courses', path: '/', color: '#6366f1' },
                        { icon: 'bi-building', label: 'Browse Colleges', path: '/colleges', color: '#06b6d4' },
                        { icon: 'bi-award', label: 'Find Scholarships', path: '/scholarships', color: '#f59e0b' },
                        { icon: 'bi-people', label: 'Connect with Mentors', path: '/mentors', color: '#10b981' },
                        { icon: 'bi-clipboard-check', label: 'Take Career Quiz', path: '/quiz', color: '#ef4444' }
                      ].map((action, i) => (
                        <button
                          key={i}
                          className="dashboard-quick-action"
                          onClick={() => router.push(action.path)}
                        >
                          <div className="dashboard-quick-action-icon" style={{ background: `${action.color}15`, color: action.color }}>
                            <i className={`bi ${action.icon}`}></i>
                          </div>
                          <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>{action.label}</span>
                          <i className="bi bi-chevron-right ms-auto text-muted"></i>
                        </button>
                      ))}
                    </div>
                  </Card.Body>
                </Card>

                {/* Learning Tip */}
                <Card className="border-0 shadow-sm" style={{
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(139,92,246,0.08))',
                  border: '1px solid rgba(99,102,241,0.1)'
                }}>
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-start gap-3">
                      <div style={{ fontSize: '2rem' }}>💡</div>
                      <div>
                        <h6 className="fw-bold mb-1" style={{ color: 'var(--primary-dark)' }}>Learning Tip</h6>
                        <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                          Consistency beats intensity! Try to spend at least 30 minutes daily on your courses for the best retention.
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>

      {/* Progress Update Modal */}
      <Modal show={showProgressModal} onHide={() => setShowProgressModal(false)} centered>
        <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
          <Modal.Title className="fw-bold" style={{ fontSize: '1.1rem' }}>
            <i className="bi bi-pencil-square me-2 text-primary"></i>
            Update Progress
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          {selectedCourse && (
            <>
              <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                <strong>{selectedCourse.course_title}</strong> on {selectedCourse.platform}
              </p>
              <Form.Label className="fw-semibold" style={{ fontSize: '0.9rem' }}>
                Progress: <span className="text-primary">{newProgress}%</span>
              </Form.Label>
              <Form.Range
                min={0}
                max={100}
                value={newProgress}
                onChange={(e) => setNewProgress(e.target.value)}
                className="mb-3"
              />
              <div className="d-flex justify-content-between mb-4">
                <small className="text-muted">0%</small>
                <small className="text-muted">50%</small>
                <small className="text-muted">100%</small>
              </div>
              {parseInt(newProgress) >= 100 && (
                <div className="alert alert-success py-2 mb-3" style={{ borderRadius: '10px' }}>
                  <i className="bi bi-trophy-fill me-2"></i> Congratulations! This will mark the course as completed! 🎉
                </div>
              )}
              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  className="flex-grow-1 rounded-pill"
                  onClick={handleUpdateProgress}
                  disabled={updating}
                >
                  {updating ? (
                    <><Spinner size="sm" animation="border" className="me-2" /> Saving...</>
                  ) : (
                    <><i className="bi bi-check-lg me-2"></i> Save Progress</>
                  )}
                </Button>
                <Button variant="outline-secondary" className="rounded-pill px-3" onClick={() => setShowProgressModal(false)}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .dashboard-hero {
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 60%, #6366f1 100%);
          padding: 3.5rem 0 5rem;
          color: white;
          position: relative;
          overflow: hidden;
          border-radius: 0 0 32px 32px;
          margin-bottom: 0;
        }
        .dashboard-hero-orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%);
        }
        .dashboard-hero-orb-1 {
          width: 400px; height: 400px; top: -150px; right: -80px;
          animation: heroGlow 8s ease-in-out infinite;
        }
        .dashboard-hero-orb-2 {
          width: 300px; height: 300px; bottom: -120px; left: -60px;
          background: radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%);
          animation: heroGlow 10s ease-in-out infinite reverse;
        }
        .dashboard-hero-orb-3 {
          width: 200px; height: 200px; top: 50%; left: 40%;
          background: radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%);
          animation: heroGlow 12s ease-in-out infinite 2s;
        }
        @keyframes heroGlow {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.5; }
          50% { transform: scale(1.2) translate(20px, -20px); opacity: 0.8; }
        }

        .dashboard-stat-card {
          background: white;
          border-radius: 20px;
          padding: 1.5rem 1rem;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(0,0,0,0.04);
        }
        .dashboard-stat-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.12);
        }
        .dashboard-stat-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 0.75rem;
          font-size: 1.25rem; color: white;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }
        .dashboard-stat-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--dark);
          line-height: 1;
          margin-bottom: 0.25rem;
        }
        .dashboard-stat-label {
          font-size: 0.75rem;
          color: var(--gray);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dashboard-tabs {
          display: flex;
          gap: 4px;
          background: var(--light-100);
          border-radius: 12px;
          padding: 4px;
        }
        .dashboard-tab {
          border: none;
          background: transparent;
          padding: 6px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--gray);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dashboard-tab:hover { color: var(--dark); }
        .dashboard-tab.active {
          background: white;
          color: var(--primary);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .dashboard-tab-count {
          background: var(--light-200);
          padding: 1px 8px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
        }
        .dashboard-tab.active .dashboard-tab-count {
          background: rgba(99,102,241,0.1);
          color: var(--primary);
        }

        .dashboard-course-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .dashboard-course-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 15px 40px rgba(0,0,0,0.1) !important;
        }
        .dashboard-course-icon-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          min-width: 100px;
          border-radius: 16px 0 0 16px;
        }
        @media (max-width: 768px) {
          .dashboard-course-icon-section {
            border-radius: 16px 16px 0 0;
            padding: 1rem;
            flex-direction: row;
            gap: 8px;
          }
        }

        .dashboard-progress-track {
          height: 8px;
          background: var(--light-200);
          border-radius: 10px;
          overflow: hidden;
        }
        .dashboard-progress-fill {
          height: 100%;
          border-radius: 10px;
          transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }
        .dashboard-progress-fill::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .dashboard-skill-tag {
          background: var(--light-100);
          color: var(--dark-600);
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
          border: 1px solid var(--light-200);
        }
        .dashboard-skill-badge {
          background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.12));
          color: var(--primary-dark);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid rgba(99,102,241,0.15);
          transition: all 0.2s;
        }
        .dashboard-skill-badge:hover {
          background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.2));
          transform: translateY(-2px);
        }

        .dashboard-quick-action {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border: 1px solid var(--light-200);
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
          text-align: left;
        }
        .dashboard-quick-action:hover {
          border-color: var(--primary-light);
          background: rgba(99,102,241,0.02);
          transform: translateX(4px);
        }
        .dashboard-quick-action-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .dashboard-profile-card:hover {
          transform: none !important;
        }
      `}</style>
    </Layout>
  );
}
