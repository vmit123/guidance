const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './career_advisor.db',
  logging: false
});

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true },
  email: { type: DataTypes.STRING, unique: true },
  hashed_password: { type: DataTypes.STRING },
  full_name: { type: DataTypes.STRING },
  district: { type: DataTypes.STRING },
  education_level: { type: DataTypes.STRING },
  interests: { type: DataTypes.TEXT },
  career_goals: { type: DataTypes.TEXT },
  role: { type: DataTypes.STRING, defaultValue: 'student' },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

const College = sequelize.define('College', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  district: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  website: { type: DataTypes.STRING },
  contact: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  facilities: { type: DataTypes.TEXT },
  type: { type: DataTypes.STRING }, // IIT, NIT, IIIT, Central University, State University, Private, Deemed, Medical, Law, Management, etc.
  ranking: { type: DataTypes.INTEGER },
  naac_grade: { type: DataTypes.STRING },
  streams: { type: DataTypes.TEXT }, // comma separated: Engineering, Medical, Law, Arts, Commerce, Science, Management, etc.
  established_year: { type: DataTypes.INTEGER },
  image_url: { type: DataTypes.STRING }
}, {
  tableName: 'colleges',
  timestamps: false
});

const Course = sequelize.define('Course', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  duration: { type: DataTypes.STRING },
  eligibility: { type: DataTypes.STRING },
  college_id: { type: DataTypes.INTEGER }
}, {
  tableName: 'courses',
  timestamps: false
});

College.hasMany(Course, { foreignKey: 'college_id', as: 'courses' });
Course.belongsTo(College, { foreignKey: 'college_id', as: 'college' });

const Scholarship = sequelize.define('Scholarship', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  provider: { type: DataTypes.STRING },
  eligibility: { type: DataTypes.TEXT },
  amount: { type: DataTypes.FLOAT },
  deadline: { type: DataTypes.DATE },
  website: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING }, // Government, Private, NGO, International
  type: { type: DataTypes.STRING }, // Merit-based, Need-based, Category-based, Minority, Sports, Women
  state: { type: DataTypes.STRING } // All India, State-specific
}, {
  tableName: 'scholarships',
  timestamps: false
});

const Timeline = sequelize.define('Timeline', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING },
  event_type: { type: DataTypes.STRING },
  start_date: { type: DataTypes.DATE },
  end_date: { type: DataTypes.DATE },
  description: { type: DataTypes.TEXT },
  url: { type: DataTypes.STRING }
}, {
  tableName: 'timelines',
  timestamps: false
});

// User Course Enrollment tracking
const UserCourse = sequelize.define('UserCourse', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  course_title: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  platform: { type: DataTypes.STRING },
  level: { type: DataTypes.STRING },
  duration: { type: DataTypes.STRING },
  progress: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'in_progress' }, // in_progress, completed, paused
  skills: { type: DataTypes.TEXT }, // JSON array of skills
  platform_url: { type: DataTypes.STRING },
  last_accessed: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  enrolled_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  next_lesson: { type: DataTypes.STRING }
}, {
  tableName: 'user_courses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

User.hasMany(UserCourse, { foreignKey: 'user_id', as: 'enrolledCourses' });
UserCourse.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

const initDb = async () => {
  await sequelize.sync({ alter: true });
};

module.exports = {
  sequelize,
  User,
  College,
  Course,
  Scholarship,
  Timeline,
  UserCourse,
  initDb
};
