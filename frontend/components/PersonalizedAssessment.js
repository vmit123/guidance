import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, Button, Form, ProgressBar, Row, Col } from 'react-bootstrap';

const PersonalizedAssessment = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);

  const questions = [
    {
      id: 'q1',
      text: 'Which stream or interest area do you want to explore?',
      options: [
        { id: 'a', text: 'Science / Engineering' },
        { id: 'b', text: 'Commerce / Business' },
        { id: 'c', text: 'Arts / Humanities' },
        { id: 'd', text: 'Technology / Computers' }
      ]
    },
    {
      id: 'q2',
      text: 'What kind of learning experience do you prefer?',
      options: [
        { id: 'a', text: 'Hands-on practical work' },
        { id: 'b', text: 'Reading and research' },
        { id: 'c', text: 'Presentations and discussions' },
        { id: 'd', text: 'Creative projects and design' }
      ]
    },
    {
      id: 'q3',
      text: 'How do you usually solve problems?',
      options: [
        { id: 'a', text: 'Step-by-step analysis' },
        { id: 'b', text: 'Brainstorm with others' },
        { id: 'c', text: 'Use intuition and creativity' },
        { id: 'd', text: 'Test solutions quickly' }
      ]
    },
    {
      id: 'q4',
      text: 'What type of work environment appeals to you most?',
      options: [
        { id: 'a', text: 'Structured and steady' },
        { id: 'b', text: 'Fast-paced and dynamic' },
        { id: 'c', text: 'Collaborative and social' },
        { id: 'd', text: 'Independent and flexible' }
      ]
    },
    {
      id: 'q5',
      text: 'Which of these strengths fits you best?',
      options: [
        { id: 'a', text: 'Detail-oriented and accurate' },
        { id: 'b', text: 'Good with people and relationships' },
        { id: 'c', text: 'Creative and imaginative' },
        { id: 'd', text: 'Organized and goal-driven' }
      ]
    },
    {
      id: 'q6',
      text: 'What is most important when choosing a career?',
      options: [
        { id: 'a', text: 'Interesting subject matter' },
        { id: 'b', text: 'High earning potential' },
        { id: 'c', text: 'Work-life balance' },
        { id: 'd', text: 'Helping others' }
      ]
    },
    {
      id: 'q7',
      text: 'How do you feel about working with technology?',
      options: [
        { id: 'a', text: 'I enjoy using technology daily' },
        { id: 'b', text: 'I use it when needed' },
        { id: 'c', text: 'I prefer low-tech roles' },
        { id: 'd', text: 'I am interested in learning more' }
      ]
    },
    {
      id: 'q8',
      text: 'What kind of tasks do you prefer?',
      options: [
        { id: 'a', text: 'Working with numbers and data' },
        { id: 'b', text: 'Talking to people and presenting ideas' },
        { id: 'c', text: 'Designing and creating visuals' },
        { id: 'd', text: 'Planning and coordinating projects' }
      ]
    },
    {
      id: 'q9',
      text: 'Which career outcome excites you most?',
      options: [
        { id: 'a', text: 'A role as an expert or specialist' },
        { id: 'b', text: 'A leadership or management role' },
        { id: 'c', text: 'A creative career with freedom' },
        { id: 'd', text: 'A job that makes a social impact' }
      ]
    },
    {
      id: 'q10',
      text: 'What is your ideal future work schedule?',
      options: [
        { id: 'a', text: 'Fixed daily hours' },
        { id: 'b', text: 'Flexible hours' },
        { id: 'c', text: 'Project-based timing' },
        { id: 'd', text: 'Remote or hybrid work' }
      ]
    }
  ];

  const handleAnswer = (questionId, answerId) => {
    setAnswers({
      ...answers,
      [questionId]: answerId
    });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setCompleted(false);
  };

  const handleExplore = () => {
    router.push('/dashboard');
  };

  const renderQuestion = () => {
    const question = questions[currentStep];
    return (
      <div>
        <h4 className="mb-4">{question.text}</h4>
        <Form>
          {question.options.map(option => (
            <Form.Check
              key={option.id}
              type="radio"
              id={`${question.id}-${option.id}`}
              label={option.text}
              name={question.id}
              className="mb-3 assessment-option"
              checked={answers[question.id] === option.id}
              onChange={() => handleAnswer(question.id, option.id)}
            />
          ))}
        </Form>
      </div>
    );
  };

  const renderResults = () => {
    return (
      <div className="text-center">
        <div className="mb-4">
          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
        </div>
        <h3 className="mb-3">Assessment Complete!</h3>
        <p className="lead mb-4">Based on your responses, we've identified your top career matches:</p>
        
        <Row className="justify-content-center mb-4">
          <Col md={8}>
            <Card className="mb-3 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4 className="mb-0">Software Development</h4>
                  <span className="badge bg-primary px-3 py-2">92% Match</span>
                </div>
                <ProgressBar variant="success" now={92} className="mb-3" style={{height: '8px'}} />
                <p className="text-muted">Your analytical approach to problem-solving and preference for creative solutions makes software development an excellent match.</p>
              </Card.Body>
            </Card>
            
            <Card className="mb-3 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4 className="mb-0">UX/UI Design</h4>
                  <span className="badge bg-primary px-3 py-2">85% Match</span>
                </div>
                <ProgressBar variant="success" now={85} className="mb-3" style={{height: '8px'}} />
                <p className="text-muted">Your creative thinking and preference for flexible environments align well with a career in UX/UI design.</p>
              </Card.Body>
            </Card>
            
            <Card className="mb-3 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4 className="mb-0">Data Analysis</h4>
                  <span className="badge bg-primary px-3 py-2">78% Match</span>
                </div>
                <ProgressBar variant="success" now={78} className="mb-3" style={{height: '8px'}} />
                <p className="text-muted">Your analytical mindset and structured approach to problem-solving indicate potential success in data analysis.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <div>
          <Button variant="primary" className="me-3" onClick={handleExplore}>
            Go to My Dashboard
          </Button>
          <Button variant="outline-secondary" onClick={handleReset}>
            Retake Assessment
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div id="assessment" className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-primary mb-3">Personalized Career Assessment</h2>
          <p className="lead">Discover your ideal career path with our AI-powered assessment</p>
        </div>

        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4 p-md-5">
            {!completed ? (
              <>
                <div className="mb-4">
                  <ProgressBar 
                    now={(currentStep / questions.length) * 100} 
                    variant="primary" 
                    className="mb-3"
                    style={{height: '8px'}}
                  />
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">Question {currentStep + 1} of {questions.length}</small>
                    <small className="text-muted">{Math.round((currentStep / questions.length) * 100)}% Complete</small>
                  </div>
                </div>
                
                {renderQuestion()}
                
                <div className="d-flex justify-content-between mt-4">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleNext}
                    disabled={!answers[questions[currentStep].id]}
                  >
                    {currentStep === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
                  </Button>
                </div>
              </>
            ) : (
              renderResults()
            )}
          </Card.Body>
        </Card>
      </div>
      
      <style jsx>{`
        .assessment-option {
          padding: 12px 16px;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }
        .assessment-option:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

export default PersonalizedAssessment;