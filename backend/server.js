const express = require('express');
const cors = require('cors');
const { initDb, User, College, Scholarship, Course, Timeline, UserCourse, sequelize } = require('./database');
const { verifyPassword, getPasswordHash, createAccessToken, authenticateToken } = require('./auth');
const config = require('./config');
const { advanced_chatbot } = require('./advancedChatbot');
const { getDetailedResponse } = require('./chatbotKnowledge');
const { generateGeminiResponse } = require('./geminiClient');

const app = express();

app.use(cors({ origin: config.corsOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initDb().then(() => {
  console.log('Database initialized');
});

app.get('/', (req, res) => {
  res.json({
    message: "Welcome to Digital Career Advisor API for Students",
    version: "1.0.0",
    docs: "/docs"
  });
});

// Auth
app.post('/api/token', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ detail: "Incorrect username or password" });
    }
    const isValid = await verifyPassword(password, user.hashed_password);
    if (!isValid) {
      return res.status(401).json({ detail: "Incorrect username or password" });
    }
    
    const accessToken = createAccessToken({ sub: user.username });
    res.json({ access_token: accessToken, token_type: "bearer" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ detail: "Login failed" });
  }
});

// Users
app.post('/api/users/', async (req, res) => {
  try {
    const { username, email, password, full_name, district, education_level, role } = req.body;
    
    let existingUser = await User.findOne({ where: { username } });
    if (existingUser) return res.status(400).json({ detail: "Username already registered" });
    
    existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ detail: "Email already registered" });
    
    const hashed_password = await getPasswordHash(password);
    
    const newUser = await User.create({
      username,
      email,
      hashed_password,
      full_name,
      district,
      education_level,
      role: role || 'student'
    });
    
    const userResp = newUser.toJSON();
    delete userResp.hashed_password;
    res.status(201).json(userResp);
  } catch (error) {
    console.error("User creation error:", error);
    res.status(500).json({ detail: "User creation failed" });
  }
});

app.get('/api/users/me', authenticateToken, (req, res) => {
  const userResp = req.user.toJSON();
  delete userResp.hashed_password;
  res.json(userResp);
});

app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.user.username } });
    if (!user) return res.status(404).json({ detail: "User not found" });
    const userResp = user.toJSON();
    delete userResp.hashed_password;
    res.json(userResp);
  } catch (error) {
    res.status(500).json({ detail: "Failed to fetch profile" });
  }
});

app.post('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const { district, education_level, interests, career_goals } = req.body;
    const user = await User.findOne({ where: { username: req.user.username } });
    if (!user) return res.status(404).json({ detail: "User not found" });
    
    await user.update({ district, education_level, interests, career_goals });
    const userResp = user.toJSON();
    delete userResp.hashed_password;
    res.json(userResp);
  } catch (error) {
    res.status(500).json({ detail: "Failed to create profile" });
  }
});

app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const { district, education_level, interests, career_goals } = req.body;
    const user = await User.findOne({ where: { username: req.user.username } });
    if (!user) return res.status(404).json({ detail: "User not found" });
    
    await user.update({ district, education_level, interests, career_goals });
    const userResp = user.toJSON();
    delete userResp.hashed_password;
    res.json(userResp);
  } catch (error) {
    res.status(500).json({ detail: "Failed to update profile" });
  }
});

// Colleges
app.get('/api/colleges/', async (req, res) => {
  try {
    const colleges = await College.findAll();
    res.json(colleges);
  } catch (error) {
    console.error("Colleges fetch error:", error);
    res.status(500).json({ detail: "Failed to fetch colleges" });
  }
});

app.get('/api/colleges/:college_id', async (req, res) => {
  try {
    const college = await College.findByPk(req.params.college_id);
    if (!college) {
      return res.status(404).json({ detail: "College not found" });
    }
    res.json(college);
  } catch (error) {
    res.status(500).json({ detail: "Failed to fetch college" });
  }
});

// Scholarships
app.get('/api/scholarships/', async (req, res) => {
  try {
    const scholarships = await Scholarship.findAll();
    res.json(scholarships);
  } catch (error) {
    console.error("Scholarships fetch error:", error);
    res.status(500).json({ detail: "Failed to fetch scholarships" });
  }
});

app.get('/api/scholarships/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findByPk(req.params.id);
    if (!scholarship) return res.status(404).json({ detail: "Not found" });
    res.json(scholarship);
  } catch (error) {
    res.status(500).json({ detail: "Failed to fetch scholarship" });
  }
});

// ─── User Course Enrollment ───────────────────────────────────────

// Get all enrolled courses for the authenticated user
app.get('/api/user-courses', authenticateToken, async (req, res) => {
  try {
    const courses = await UserCourse.findAll({
      where: { user_id: req.user.id },
      order: [['last_accessed', 'DESC']]
    });
    const parsed = courses.map(c => {
      const json = c.toJSON();
      json.skills = json.skills ? JSON.parse(json.skills) : [];
      return json;
    });
    res.json(parsed);
  } catch (error) {
    console.error('Fetch user courses error:', error);
    res.status(500).json({ detail: 'Failed to fetch enrolled courses' });
  }
});

// Enroll in a course
app.post('/api/user-courses/enroll', authenticateToken, async (req, res) => {
  try {
    const { course_title, category, platform, level, duration, skills, platform_url, progress } = req.body;

    // Check if already enrolled
    const existing = await UserCourse.findOne({
      where: { user_id: req.user.id, course_title }
    });
    if (existing) {
      return res.status(400).json({ detail: 'Already enrolled in this course' });
    }

    const userCourse = await UserCourse.create({
      user_id: req.user.id,
      course_title,
      category,
      platform,
      level,
      duration,
      progress: progress || 0,
      skills: JSON.stringify(skills || []),
      platform_url,
      status: (progress || 0) >= 100 ? 'completed' : 'in_progress',
      next_lesson: 'Getting Started'
    });

    const json = userCourse.toJSON();
    json.skills = JSON.parse(json.skills);
    res.status(201).json(json);
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ detail: 'Enrollment failed' });
  }
});

// Update course progress
app.put('/api/user-courses/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { progress, next_lesson } = req.body;
    const userCourse = await UserCourse.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });
    if (!userCourse) return res.status(404).json({ detail: 'Course enrollment not found' });

    const updates = {
      progress: Math.min(100, Math.max(0, progress)),
      last_accessed: new Date(),
      status: progress >= 100 ? 'completed' : 'in_progress'
    };
    if (next_lesson) updates.next_lesson = next_lesson;

    await userCourse.update(updates);
    const json = userCourse.toJSON();
    json.skills = json.skills ? JSON.parse(json.skills) : [];
    res.json(json);
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ detail: 'Failed to update progress' });
  }
});

// Unenroll from a course
app.delete('/api/user-courses/:id', authenticateToken, async (req, res) => {
  try {
    const userCourse = await UserCourse.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });
    if (!userCourse) return res.status(404).json({ detail: 'Course enrollment not found' });
    await userCourse.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error('Unenroll error:', error);
    res.status(500).json({ detail: 'Failed to unenroll' });
  }
});

// Get dashboard stats for authenticated user
app.get('/api/user-courses/stats', authenticateToken, async (req, res) => {
  try {
    const courses = await UserCourse.findAll({ where: { user_id: req.user.id } });
    const total = courses.length;
    const completed = courses.filter(c => c.status === 'completed').length;
    const inProgress = courses.filter(c => c.status === 'in_progress').length;
    const avgProgress = total > 0 ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / total) : 0;

    // Calculate total learning hours (estimate: 2 hours per % progress per course)
    const totalHours = Math.round(courses.reduce((sum, c) => sum + (c.progress * 0.5), 0));

    // Skills collected
    const allSkills = new Set();
    courses.forEach(c => {
      try {
        const skills = JSON.parse(c.skills || '[]');
        skills.forEach(s => allSkills.add(s));
      } catch(e) {}
    });

    res.json({
      total_courses: total,
      completed,
      in_progress: inProgress,
      avg_progress: avgProgress,
      total_hours: totalHours,
      skills_count: allSkills.size,
      skills: Array.from(allSkills)
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ detail: 'Failed to fetch stats' });
  }
});

// Quiz
app.get('/api/quiz/questions', (req, res) => {
  res.json([
    { id: 1, text: "Which stream or interest area do you want to explore?", options: ["Science / Engineering", "Commerce / Business", "Arts / Humanities", "Technology / Computers"] },
    { id: 2, text: "What kind of learning experience do you prefer?", options: ["Hands-on practical work", "Reading and research", "Presentations and discussions", "Creative projects and design"] },
    { id: 3, text: "How do you usually solve problems?", options: ["Step-by-step analysis", "Brainstorm with others", "Use intuition and creativity", "Test solutions quickly"] },
    { id: 4, text: "What type of work environment appeals to you most?", options: ["Structured and steady", "Fast-paced and dynamic", "Collaborative and social", "Independent and flexible"] },
    { id: 5, text: "Which of these strengths fits you best?", options: ["Detail-oriented and accurate", "Good with people and relationships", "Creative and imaginative", "Organized and goal-driven"] },
    { id: 6, text: "What is most important when choosing a career?", options: ["Interesting subject matter", "High earning potential", "Work-life balance", "Helping others"] },
    { id: 7, text: "How do you feel about working with technology?", options: ["I enjoy using technology daily", "I use it when needed", "I prefer low-tech roles", "I am interested in learning more"] },
    { id: 8, text: "What kind of tasks do you prefer?", options: ["Working with numbers and data", "Talking to people and presenting ideas", "Designing and creating visuals", "Planning and coordinating projects"] },
    { id: 9, text: "Which career outcome excites you most?", options: ["A role as an expert or specialist", "A leadership or management role", "A creative career with freedom", "A job that makes a social impact"] },
    { id: 10, text: "What is your ideal future work schedule?", options: ["Fixed daily hours", "Flexible hours", "Project-based timing", "Remote or hybrid work"] }
  ]);
});

app.post('/api/quiz/results', (req, res) => {
  res.json({ recommendation: "Based on your answers, we recommend exploring IT and Computer Science fields." });
});

// Recommendations
app.post('/api/recommendations', (req, res) => {
  const { skills, interests } = req.body;
  res.json([
    {
      title: 'Software Engineering',
      match: 95,
      description: 'Based on your strong analytical skills and interest in problem-solving, software engineering would be an excellent career path.',
      skills: ['Programming', 'Problem Solving', 'Logical Thinking'],
      courses: ['Computer Science', 'Software Development', 'Data Structures']
    },
    {
      title: 'Data Science',
      match: 88,
      description: 'Your mathematical background and interest in patterns makes data science a great fit for your profile.',
      skills: ['Statistics', 'Machine Learning', 'Data Visualization'],
      courses: ['Statistics', 'Machine Learning', 'Big Data Analytics']
    },
    {
      title: 'UX/UI Design',
      match: 82,
      description: 'Your creative skills combined with analytical thinking make you well-suited for UX/UI design roles.',
      skills: ['Design Thinking', 'User Research', 'Visual Design'],
      courses: ['User Experience Design', 'Interface Design', 'Human-Computer Interaction']
    }
  ]);
});

// Timeline
app.get('/api/timeline/me', authenticateToken, async (req, res) => {
  res.json({ id: req.user.username, title: "My Career Timeline" });
});

app.post('/api/timeline/', authenticateToken, async (req, res) => {
  res.json({ id: req.user.username, title: req.body.title || "My Career Timeline" });
});

app.get('/api/timeline/:id/events', authenticateToken, async (req, res) => {
  try {
    const events = await Timeline.findAll();
    const mapped = events.map(e => ({
      id: e.id,
      title: e.title,
      description: e.description,
      date: e.start_date,
      event_type: e.event_type
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ detail: "Failed to fetch events" });
  }
});

app.post('/api/timeline/:id/events', authenticateToken, async (req, res) => {
  try {
    const { title, description, date, event_type } = req.body;
    const event = await Timeline.create({
      title,
      description,
      start_date: new Date(date),
      event_type
    });
    res.json({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.start_date,
      event_type: event.event_type
    });
  } catch (error) {
    res.status(500).json({ detail: "Failed to create event" });
  }
});

app.delete('/api/timeline/events/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Timeline.findByPk(req.params.id);
    if (!event) return res.status(404).json({ detail: "Event not found" });
    await event.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ detail: "Failed to delete event" });
  }
});

// Chatbot
app.post('/api/chatbot', async (req, res) => {
  try {
    const message = (req.body.message || "").trim();
    const user_id = req.body.user_id || "default";

    if (!message) {
      return res.json({
        response: "I'm here to help! Please ask me about colleges, scholarships, career guidance, or any other educational topics.",
        intent: "general_info",
        confidence: 0.5,
        emotion: "neutral",
        context_aware: false,
        suggestions: []
      });
    }

    let geminiResponse = null;
    if (config.geminiApiKey) {
      try {
        geminiResponse = await generateGeminiResponse(message, req.body.conversation_history || []);
      } catch (geminiError) {
        console.error('Gemini API error:', geminiError);
      }
    }

    if (geminiResponse) {
      return res.json({
        response: geminiResponse,
        intent: 'gemini',
        confidence: 1.0,
        emotion: 'neutral',
        context_aware: true,
        suggestions: ["Ask about colleges", "Ask about scholarships", "Ask for career guidance"]
      });
    }

    const result = advanced_chatbot.get_personalized_response(user_id, message);

    let suggestions = [];
    if (result.intent === 'colleges') {
      suggestions = ["Tell me about admission requirements", "What courses are available?", "Show me colleges in my district"];
    } else if (result.intent === 'scholarships') {
      suggestions = ["What are the eligibility criteria?", "When are the deadlines?", "How do I apply?"];
    } else if (result.intent === 'career_guidance') {
      suggestions = ["Take the aptitude test", "What careers match my interests?", "How do I plan my future?"];
    }

    const detailed_response = getDetailedResponse(result.intent, message);
    if (detailed_response) {
      result.response = detailed_response;
    }

    res.json({
      response: result.response,
      intent: result.intent,
      confidence: result.confidence,
      emotion: result.emotion,
      context_aware: result.context_aware,
      suggestions: suggestions
    });

  } catch (error) {
    console.error("Advanced chatbot error:", error);
    res.json({
      response: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
      intent: "error",
      confidence: 0.0,
      emotion: "neutral",
      context_aware: false,
      suggestions: []
    });
  }
});

app.get('/api/chatbot/insights/:user_id', (req, res) => {
  try {
    const insights = advanced_chatbot.get_user_insights(req.params.user_id);
    res.json(insights);
  } catch (error) {
    console.error("Insights error:", error);
    res.json({ error: "Unable to retrieve insights" });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({ detail: "Internal server error" });
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
