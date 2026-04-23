import React, { useState, useEffect } from 'react';
import { Card, Button, ProgressBar, Badge, Toast, ToastContainer } from 'react-bootstrap';
import { useAuth } from '../services/auth';
import { useRouter } from 'next/router';

const API_URL = 'http://localhost:8000';

const SkillDevelopment = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrollingId, setEnrollingId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  const courses = [
    {
      id: 1,
      title: 'Machine Learning Specialization',
      category: 'Data Science',
      level: 'Beginner',
      duration: '10 weeks',
      progress: 65,
      platform: 'Coursera',
      skills: ['Python', 'Machine Learning', 'TensorFlow'],
      platformUrl: 'https://www.coursera.org/specializations/machine-learning-introduction'
    },
    {
      id: 2,
      title: '100 Days of Code: Python Pro Bootcamp',
      category: 'Technology',
      level: 'All Levels',
      duration: '14 weeks',
      progress: 30,
      platform: 'Udemy',
      skills: ['Python', 'Data Science', 'Automation'],
      platformUrl: 'https://www.udemy.com/course/100-days-of-code/'
    },
    {
      id: 3,
      title: 'Google Data Analytics Certificate',
      category: 'Data Science',
      level: 'Beginner',
      duration: '24 weeks',
      progress: 90,
      platform: 'Coursera',
      skills: ['SQL', 'Tableau', 'R Programming'],
      platformUrl: 'https://www.coursera.org/professional-certificates/google-data-analytics'
    },
    {
      id: 4,
      title: "CS50's Introduction to Computer Science",
      category: 'Technology',
      level: 'Beginner',
      duration: '12 weeks',
      progress: 0,
      platform: 'edX',
      skills: ['C', 'Python', 'Algorithms'],
      platformUrl: 'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x'
    },
    {
      id: 5,
      title: 'The Web Developer Bootcamp',
      category: 'Technology',
      level: 'Beginner',
      duration: '10 weeks',
      progress: 45,
      platform: 'Udemy',
      skills: ['HTML/CSS', 'Node.js', 'MongoDB'],
      platformUrl: 'https://www.udemy.com/course/the-web-developer-bootcamp/'
    },
    {
      id: 6,
      title: 'Google Project Management Certificate',
      category: 'Business',
      level: 'Beginner',
      duration: '24 weeks',
      progress: 0,
      platform: 'Coursera',
      skills: ['Agile', 'Scrum', 'Leadership'],
      platformUrl: 'https://www.coursera.org/professional-certificates/google-project-management'
    },
    {
      id: 7,
      title: 'Meta Front-End Developer Certificate',
      category: 'Technology',
      level: 'Beginner',
      duration: '28 weeks',
      progress: 15,
      platform: 'Coursera',
      skills: ['React', 'JavaScript', 'UI/UX'],
      platformUrl: 'https://www.coursera.org/professional-certificates/meta-front-end-developer'
    },
    {
      id: 8,
      title: 'The Complete Digital Marketing Course',
      category: 'Marketing',
      level: 'All Levels',
      duration: '4 weeks',
      progress: 75,
      platform: 'Udemy',
      skills: ['SEO', 'Google Ads', 'Social Media'],
      platformUrl: 'https://www.udemy.com/course/learn-digital-marketing-course/'
    },
    {
      id: 9,
      title: 'AWS Certified Solutions Architect',
      category: 'Technology',
      level: 'Intermediate',
      duration: '6 weeks',
      progress: 10,
      platform: 'Udemy',
      skills: ['AWS', 'Cloud Computing', 'Architecture'],
      platformUrl: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/'
    },
    {
      id: 10,
      title: 'Financial Markets by Yale University',
      category: 'Finance',
      level: 'Beginner',
      duration: '7 weeks',
      progress: 0,
      platform: 'Coursera',
      skills: ['Finance', 'Markets', 'Economics'],
      platformUrl: 'https://www.coursera.org/learn/financial-markets-global'
    },
    {
      id: 11,
      title: 'Graphic Design Specialization',
      category: 'Design',
      level: 'Beginner',
      duration: '16 weeks',
      progress: 50,
      platform: 'Coursera',
      skills: ['Typography', 'Illustrator', 'Branding'],
      platformUrl: 'https://www.coursera.org/specializations/graphic-design'
    },
    {
      id: 12,
      title: 'Complete C# Unity Game Developer 2D',
      category: 'Technology',
      level: 'Intermediate',
      duration: '8 weeks',
      progress: 25,
      platform: 'Udemy',
      skills: ['C#', 'Unity', 'Game Design'],
      platformUrl: 'https://www.udemy.com/course/unitycourse/'
    }
  ];

  const iconMap = {
    Technology: 'code-slash',
    'Data Science': 'bar-chart',
    'Soft Skills': 'chat-dots',
    Marketing: 'graph-up',
    Design: 'palette',
    Business: 'briefcase',
    Finance: 'currency-dollar',
    Product: 'gear',
    Security: 'shield-lock',
    Mobile: 'phone'
  };

  // Fetch enrolled courses on mount
  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      const res = await fetch(`${API_URL}/api/user-courses`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setEnrolledCourses(data.map(c => c.course_title));
      }
    } catch (err) {
      console.error('Failed to fetch enrolled courses:', err);
    }
  };

  const handleEnroll = async (course) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setEnrollingId(course.id);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/api/user-courses/enroll`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_title: course.title,
          category: course.category,
          platform: course.platform,
          level: course.level,
          duration: course.duration,
          skills: course.skills,
          platform_url: course.platformUrl,
          progress: course.progress
        })
      });

      if (res.ok) {
        setEnrolledCourses(prev => [...prev, course.title]);
        setToast({ show: true, message: `✅ Enrolled in "${course.title}" successfully!`, variant: 'success' });
        // Open in new tab after slight delay
        setTimeout(() => {
          window.open(course.platformUrl, '_blank');
        }, 800);
      } else {
        const data = await res.json();
        if (data.detail === 'Already enrolled in this course') {
          window.open(course.platformUrl, '_blank');
          setToast({ show: true, message: `Opening "${course.title}" on ${course.platform}...`, variant: 'info' });
        } else {
          setToast({ show: true, message: data.detail || 'Enrollment failed', variant: 'danger' });
        }
      }
    } catch (err) {
      console.error('Enrollment failed:', err);
      setToast({ show: true, message: 'Network error. Please try again.', variant: 'danger' });
    } finally {
      setEnrollingId(null);
    }
  };

  const handleContinue = (course) => {
    if (!user) {
      router.push('/login');
      return;
    }
    // If already enrolled, just open platform
    if (enrolledCourses.includes(course.title)) {
      window.open(course.platformUrl, '_blank');
      setToast({ show: true, message: `Resuming "${course.title}" on ${course.platform}...`, variant: 'info' });
    } else {
      handleEnroll(course);
    }
  };

  const isEnrolled = (title) => enrolledCourses.includes(title);

  return (
    <div className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-primary mb-3">Skill Development</h2>
          <p className="lead">Build the skills you need for your dream career</p>
        </div>

        <div className="skill-development-scroll">
          {courses.map(course => (
            <div className="skill-development-card flex-shrink-0" key={course.id}>
              <Card className="h-100 shadow-sm border-0 hover-card" style={{ position: 'relative' }}>
                  {isEnrolled(course.title) && (
                    <div style={{
                      position: 'absolute', top: '12px', right: '12px', zIndex: 2,
                      background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                      color: 'white', borderRadius: '20px', padding: '4px 12px',
                      fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.5px',
                      boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
                    }}>
                      <i className="bi bi-check-circle-fill me-1"></i> ENROLLED
                    </div>
                  )}
                  <div className="p-3 text-center">
                    <div className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center" 
                         style={{width: '80px', height: '80px'}}>
                      <i className={`bi bi-${iconMap[course.category] || 'laptop'} fs-1 text-primary`}></i>
                    </div>
                  </div>
                  <Card.Body>
                    <div className="d-flex flex-wrap justify-content-between mb-2">
                      <Badge bg="primary" className="px-3 py-2 mb-2">{course.category}</Badge>
                      <Badge bg="info" className="px-3 py-2 text-white mb-2">{course.platform}</Badge>
                      <Badge bg="secondary" className="px-3 py-2 mb-2">{course.level}</Badge>
                    </div>
                    <h3 className="h5 mb-3">{course.title}</h3>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Progress</span>
                      <span className="text-muted small">{course.progress}%</span>
                    </div>
                    <ProgressBar 
                      variant={course.progress < 30 ? "danger" : course.progress < 70 ? "warning" : "success"} 
                      now={course.progress} 
                      className="mb-3" 
                      style={{height: '8px'}}
                    />
                    <div className="mb-3">
                      <span className="text-muted small d-block mb-2">Skills you'll gain:</span>
                      <div>
                        {course.skills.map((skill, i) => (
                          <Badge bg="light" text="dark" className="me-1 mb-1" key={i}>
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted small">
                        <i className="bi bi-clock me-1"></i>
                        {course.duration}
                      </span>
                      <Button 
                        variant={isEnrolled(course.title) ? "success" : "outline-primary"} 
                        size="sm"
                        onClick={() => handleContinue(course)}
                        disabled={enrollingId === course.id}
                      >
                        {enrollingId === course.id ? (
                          <><span className="spinner-border spinner-border-sm me-1"></span> Enrolling...</>
                        ) : isEnrolled(course.title) ? (
                          <><i className="bi bi-play-fill me-1"></i> Continue</>
                        ) : course.progress > 0 ? (
                          <><i className="bi bi-plus-circle me-1"></i> Enroll & Continue</>
                        ) : (
                          <><i className="bi bi-plus-circle me-1"></i> Enroll Now</>
                        )}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => {
              if (user) {
                router.push('/dashboard');
              } else {
                router.push('/login');
              }
            }}
          >
            <i className="bi bi-grid-1x2 me-2"></i>
            {user ? 'View My Dashboard' : 'Login to Track Progress'}
          </Button>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast 
          show={toast.show} 
          onClose={() => setToast(prev => ({ ...prev, show: false }))} 
          delay={4000} 
          autohide
          bg={toast.variant}
        >
          <Toast.Body className={toast.variant === 'light' ? '' : 'text-white fw-semibold'}>
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default SkillDevelopment;