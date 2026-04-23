const { initDb, College, Scholarship } = require('./database');

const collegesToSeed = [
  // Delhi
  { name: 'Indian Institute of Technology (IIT) Delhi', district: 'New Delhi', state: 'Delhi', type: 'IIT', ranking: 2, naac_grade: 'A++', streams: 'Engineering, Science', established_year: 1961 },
  { name: 'All India Institute of Medical Sciences (AIIMS) Delhi', district: 'New Delhi', state: 'Delhi', type: 'Medical', ranking: 1, naac_grade: 'A++', streams: 'Medical', established_year: 1956 },
  { name: 'Delhi University (DU)', district: 'New Delhi', state: 'Delhi', type: 'Central University', ranking: 11, naac_grade: 'A+', streams: 'Arts, Commerce, Science', established_year: 1922 },
  { name: 'Jawaharlal Nehru University (JNU)', district: 'New Delhi', state: 'Delhi', type: 'Central University', ranking: 2, naac_grade: 'A++', streams: 'Arts, Science', established_year: 1969 },
  // Maharashtra
  { name: 'Indian Institute of Technology (IIT) Bombay', district: 'Mumbai', state: 'Maharashtra', type: 'IIT', ranking: 3, naac_grade: 'A++', streams: 'Engineering, Science', established_year: 1958 },
  { name: 'University of Mumbai', district: 'Mumbai', state: 'Maharashtra', type: 'State University', ranking: 45, naac_grade: 'A', streams: 'Arts, Commerce, Science', established_year: 1857 },
  { name: 'Tata Institute of Social Sciences (TISS)', district: 'Mumbai', state: 'Maharashtra', type: 'Deemed', ranking: 60, naac_grade: 'A++', streams: 'Arts, Management', established_year: 1936 },
  // Karnataka
  { name: 'Indian Institute of Science (IISc)', district: 'Bengaluru', state: 'Karnataka', type: 'Deemed University', ranking: 1, naac_grade: 'A++', streams: 'Science, Engineering', established_year: 1909 },
  { name: 'National Institute of Technology (NIT) Surathkal', district: 'Mangaluru', state: 'Karnataka', type: 'NIT', ranking: 10, naac_grade: 'A', streams: 'Engineering, Science', established_year: 1960 },
  { name: 'Manipal Academy of Higher Education', district: 'Manipal', state: 'Karnataka', type: 'Private', ranking: 15, naac_grade: 'A++', streams: 'Medical, Engineering, Arts', established_year: 1953 },
  // Tamil Nadu
  { name: 'Indian Institute of Technology (IIT) Madras', district: 'Chennai', state: 'Tamil Nadu', type: 'IIT', ranking: 1, naac_grade: 'A++', streams: 'Engineering, Science, Arts', established_year: 1959 },
  { name: 'Anna University', district: 'Chennai', state: 'Tamil Nadu', type: 'State University', ranking: 20, naac_grade: 'A++', streams: 'Engineering, Technology', established_year: 1978 },
  { name: 'Vellore Institute of Technology (VIT)', district: 'Vellore', state: 'Tamil Nadu', type: 'Private', ranking: 12, naac_grade: 'A++', streams: 'Engineering, Management', established_year: 1984 },
  // West Bengal
  { name: 'Indian Institute of Technology (IIT) Kharagpur', district: 'Kharagpur', state: 'West Bengal', type: 'IIT', ranking: 5, naac_grade: 'A++', streams: 'Engineering, Science, Law, Management', established_year: 1951 },
  { name: 'Jadavpur University', district: 'Kolkata', state: 'West Bengal', type: 'State University', ranking: 4, naac_grade: 'A', streams: 'Engineering, Arts, Science', established_year: 1955 },
  { name: 'University of Calcutta', district: 'Kolkata', state: 'West Bengal', type: 'State University', ranking: 8, naac_grade: 'A', streams: 'Arts, Commerce, Science', established_year: 1857 },
  // Uttar Pradesh
  { name: 'Indian Institute of Technology (IIT) Kanpur', district: 'Kanpur', state: 'Uttar Pradesh', type: 'IIT', ranking: 4, naac_grade: 'A++', streams: 'Engineering, Science, Arts', established_year: 1959 },
  { name: 'Banaras Hindu University (BHU)', district: 'Varanasi', state: 'Uttar Pradesh', type: 'Central University', ranking: 6, naac_grade: 'A', streams: 'Arts, Commerce, Science, Medical', established_year: 1916 },
  { name: 'Aligarh Muslim University (AMU)', district: 'Aligarh', state: 'Uttar Pradesh', type: 'Central University', ranking: 11, naac_grade: 'A', streams: 'Engineering, Arts, Science', established_year: 1875 },
  // Gujarat
  { name: 'Indian Institute of Management (IIM) Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', type: 'Management', ranking: 1, naac_grade: 'N/A', streams: 'Management', established_year: 1961 },
  { name: 'National Institute of Design (NID)', district: 'Ahmedabad', state: 'Gujarat', type: 'Design', ranking: 1, naac_grade: 'N/A', streams: 'Design', established_year: 1961 },
  // Telangana
  { name: 'Indian Institute of Technology (IIT) Hyderabad', district: 'Sangareddy', state: 'Telangana', type: 'IIT', ranking: 8, naac_grade: 'A', streams: 'Engineering, Science, Arts', established_year: 2008 },
  { name: 'Osmania University', district: 'Hyderabad', state: 'Telangana', type: 'State University', ranking: 46, naac_grade: 'A+', streams: 'Arts, Commerce, Science, Engineering', established_year: 1918 },
  // Rajasthan
  { name: 'Birla Institute of Technology and Science (BITS), Pilani', district: 'Jhunjhunu', state: 'Rajasthan', type: 'Deemed', ranking: 15, naac_grade: 'A', streams: 'Engineering, Science, Pharmacy', established_year: 1964 },
  { name: 'Indian Institute of Technology (IIT) Jodhpur', district: 'Jodhpur', state: 'Rajasthan', type: 'IIT', ranking: 30, naac_grade: 'A', streams: 'Engineering, Science', established_year: 2008 },
  // Punjab & Chandigarh
  { name: 'Panjab University', district: 'Chandigarh', state: 'Chandigarh', type: 'State University', ranking: 41, naac_grade: 'A', streams: 'Arts, Commerce, Science, Engineering', established_year: 1882 },
  { name: 'Indian Institute of Technology (IIT) Ropar', district: 'Rupnagar', state: 'Punjab', type: 'IIT', ranking: 22, naac_grade: 'A', streams: 'Engineering, Science', established_year: 2008 }
];

const scholarshipsToSeed = [
  // ── Government Scholarships ──
  {
    name: 'National Scholarship Portal (NSP) — Pre-Matric & Post-Matric',
    provider: 'Ministry of Education, Govt. of India',
    eligibility: 'SC/ST/OBC/Minority students from Class 9 to Post Graduation with family income below ₹2.5 lakh per annum',
    amount: 50000,
    deadline: new Date('2026-11-30'),
    category: 'Government',
    type: 'Category-based',
    state: 'All India',
    description: 'The National Scholarship Portal is a one-stop platform consolidating all central and state government scholarships. It includes Pre-Matric, Post-Matric, and Top Class Education scholarships for SC, ST, OBC, EBC, and minority community students across India.',
    website: 'https://scholarships.gov.in/'
  },
  {
    name: 'Central Sector Scheme of Scholarship (CSSS)',
    provider: 'Department of Higher Education, MHRD',
    eligibility: 'Students scoring above 80th percentile in Class 12 board exams with family income below ₹8 lakh per annum',
    amount: 120000,
    deadline: new Date('2026-11-30'),
    category: 'Government',
    type: 'Merit-Cum-Means',
    state: 'All India',
    description: 'Scholarship of ₹10,000 per annum at graduation level and ₹20,000 per annum at PG level for students from non-creamy layer pursuing higher education in recognized institutions. Renewed annually based on academic performance.',
    website: 'https://scholarships.gov.in/'
  },
  {
    name: 'INSPIRE Scholarship for Higher Education (INSPIRE-SHE)',
    provider: 'Department of Science & Technology, Govt. of India',
    eligibility: 'Top 1% in Class 12 board exams or JEE/NEET qualified students pursuing B.Sc./B.S./Int. M.Sc. in natural and basic sciences',
    amount: 80000,
    deadline: new Date('2026-10-31'),
    category: 'Government',
    type: 'Merit-based',
    state: 'All India',
    description: 'The Innovation in Science Pursuit for Inspired Research (INSPIRE) scheme aims to attract talent to study science. SHE component provides ₹80,000 per year as scholarship (₹60,000 annual scholarship + ₹20,000 summer research grant) for 5 years.',
    website: 'https://online-inspire.gov.in/'
  },
  {
    name: 'PMSSS — Prime Minister Special Scholarship Scheme',
    provider: 'All India Council for Technical Education (AICTE)',
    eligibility: 'Domicile students of J&K and Ladakh who have passed Class 12 from J&K/Ladakh Board. Family income below ₹8 lakh per annum',
    amount: 300000,
    deadline: new Date('2026-07-31'),
    category: 'Government',
    type: 'Category-based',
    state: 'Jammu & Kashmir',
    description: 'The PMSSS provides financial support covering tuition fees (up to ₹3 lakh per annum for engineering) and maintenance allowance (₹1 lakh per annum) for students from J&K and Ladakh to study in colleges across India.',
    website: 'https://www.aicte-india.org/schemes/student-development-schemes/prime-minister-special-scholarship-scheme-jammu-kashmir'
  },
  {
    name: 'Pragati Scholarship for Girls (AICTE)',
    provider: 'All India Council for Technical Education (AICTE)',
    eligibility: 'Girl students admitted to 1st year of AICTE-approved degree/diploma courses. Family income below ₹8 lakh per annum. Max 2 girls per family.',
    amount: 50000,
    deadline: new Date('2026-12-31'),
    category: 'Government',
    type: 'Women',
    state: 'All India',
    description: 'AICTE Pragati Scholarship provides ₹50,000 per annum (₹30,000 as tuition fee waiver + ₹20,000 as incidentals) for girl students pursuing technical education in AICTE-approved institutions across India.',
    website: 'https://www.aicte-india.org/schemes/students-development-schemes/pragati-scholarship-scheme-girl-students-technical-education'
  },
  {
    name: 'Saksham Scholarship for Differently Abled (AICTE)',
    provider: 'All India Council for Technical Education (AICTE)',
    eligibility: 'Differently abled students (40%+ disability) admitted to 1st year of AICTE-approved degree/diploma. Family income below ₹8 lakh per annum.',
    amount: 50000,
    deadline: new Date('2026-12-31'),
    category: 'Government',
    type: 'Category-based',
    state: 'All India',
    description: 'AICTE Saksham Scholarship offers ₹50,000 per annum (₹30,000 tuition + ₹20,000 incidentals) to differently abled students pursuing technical education to support inclusive education.',
    website: 'https://www.aicte-india.org/schemes/students-development-schemes/saksham-scholarship-scheme-specially-abled-student-technical'
  },
  {
    name: 'Begum Hazrat Mahal National Scholarship',
    provider: 'Maulana Azad Education Foundation, Ministry of Minority Affairs',
    eligibility: 'Meritorious girl students of minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi) studying in Class 9 to 12 with 50%+ marks. Family income below ₹2 lakh per annum.',
    amount: 12000,
    deadline: new Date('2026-10-31'),
    category: 'Government',
    type: 'Women',
    state: 'All India',
    description: 'Provides ₹5,000 for Class 9 & 10, and ₹6,000 for Class 11 & 12 to meritorious minority girl students to encourage them to continue higher education and reduce dropout rates.',
    website: 'https://scholarships.gov.in/'
  },
  {
    name: 'Dr. APJ Abdul Kalam IGNITE Awards',
    provider: 'National Innovation Foundation (NIF), Dept. of Science & Technology',
    eligibility: 'Students up to Class 12 from any school across India who submit original creative ideas or innovations',
    amount: 15000,
    deadline: new Date('2026-08-31'),
    category: 'Government',
    type: 'Merit-based',
    state: 'All India',
    description: 'IGNITE Awards recognize and reward original creative technological ideas and innovations by school students. Winners receive cash awards, certificates, and mentoring support to develop their ideas into prototypes.',
    website: 'https://nif.org.in/ignite'
  },
  {
    name: 'Swami Vivekananda Merit Cum Means Scholarship (SVMCM)',
    provider: 'Department of Higher Education, Govt. of West Bengal',
    eligibility: 'Students of West Bengal with 60%+ marks in the last qualifying exam, pursuing UG/PG in recognized institutions within West Bengal. Family income below ₹2.5 lakh per annum.',
    amount: 60000,
    deadline: new Date('2027-01-31'),
    category: 'Government',
    type: 'Merit-Cum-Means',
    state: 'West Bengal',
    description: 'West Bengal government scholarship providing monthly stipends: ₹1,000-₹5,000 based on course level (UG Humanities/Science/Technical/Professional/PG). Renewed annually upon maintaining academic performance.',
    website: 'https://svmcm.wbhed.gov.in/'
  },

  // ── Private / Corporate Scholarships ──
  {
    name: 'Reliance Foundation Undergraduate Scholarships',
    provider: 'Reliance Foundation',
    eligibility: 'Indian students admitted to 1st year of undergraduate programs in STEM, Humanities, or Social Sciences at recognized Indian universities. Family income below ₹15 lakh per annum.',
    amount: 200000,
    deadline: new Date('2026-10-15'),
    category: 'Private',
    type: 'Merit-Cum-Means',
    state: 'All India',
    description: 'Reliance Foundation Undergraduate Scholarship provides up to ₹2,00,000 for the duration of the degree, disbursed annually. Covers tuition and living expenses for meritorious students from economically weaker families.',
    website: 'https://www.scholarships.reliancefoundation.org/'
  },
  {
    name: 'Aditya Birla Scholarship',
    provider: 'Aditya Birla Group',
    eligibility: 'Students securing admission to IITs, IIMs, BITS Pilani, XLRI, and top law schools (NLSIU, NALSAR) through competitive exams',
    amount: 175000,
    deadline: new Date('2026-08-31'),
    category: 'Private',
    type: 'Merit-based',
    state: 'All India',
    description: 'One of India\'s most prestigious private scholarships, providing ₹1,75,000 per annum for the full duration of the program. Selection through rigorous interviews by industry leaders and academicians.',
    website: 'https://www.adityabirlascholars.net/'
  },
  {
    name: 'HDFC Bank Parivartan\'s ECSS Scholarship',
    provider: 'HDFC Bank (via Buddy4Study)',
    eligibility: 'Students enrolled in Class 1 to post-graduation courses at recognized institutions. Family income below ₹6 lakh per annum. Preference to students with disabilities, single parent, orphans.',
    amount: 75000,
    deadline: new Date('2026-09-30'),
    category: 'Private',
    type: 'Need-based',
    state: 'All India',
    description: 'HDFC Bank Parivartan Educational Crisis Scholarship Support provides up to ₹75,000 per year to help students facing financial crisis continue their education without interruption.',
    website: 'https://www.buddy4study.com/scholarship/hdfc-bank-parivartans-ecss-programme'
  },
  {
    name: 'L\'Oréal India For Young Women In Science Scholarship',
    provider: 'L\'Oréal India (via Buddy4Study)',
    eligibility: 'Young women (18-30 years) who have passed Class 12 with PCM/PCB and are pursuing UG/PG in Science from a recognized Indian university. Family income below ₹6 lakh per annum.',
    amount: 250000,
    deadline: new Date('2026-09-30'),
    category: 'Private',
    type: 'Women',
    state: 'All India',
    description: 'L\'Oréal India provides up to ₹2,50,000 scholarship to promising young women pursuing science education, covering tuition fees, hostel fees, and study material expenses. Part of L\'Oréal\'s global commitment to women in STEM.',
    website: 'https://www.buddy4study.com/scholarship/l-oreal-india-for-young-women-in-science-scholarship'
  },
  {
    name: 'Tata Trusts Education Grants — Medical & Healthcare',
    provider: 'Tata Trusts',
    eligibility: 'Indian students from economically weaker backgrounds pursuing UG/PG degrees in Medicine (MBBS, MD, MS), Nursing, Pharmacy, or Allied Health Sciences at recognized institutions.',
    amount: 500000,
    deadline: new Date('2026-11-15'),
    category: 'Private',
    type: 'Merit-based',
    state: 'All India',
    description: 'Tata Trusts individual grants for medical and healthcare education cover tuition fees up to ₹5,00,000. Available to students who demonstrate academic merit and genuine financial need. Applications reviewed on a rolling basis.',
    website: 'https://tatatrusts.org/our-work/individual-grants-programme/education-grants'
  },
  {
    name: 'Kotak Kanya Scholarship',
    provider: 'Kotak Mahindra Group (via Buddy4Study)',
    eligibility: 'Girl students from Class 12 to professional graduation courses. Family income below ₹3.2 lakh per annum. Secured 75%+ in Class 12.',
    amount: 150000,
    deadline: new Date('2026-12-31'),
    category: 'Private',
    type: 'Women',
    state: 'All India',
    description: 'Kotak Kanya Scholarship supports meritorious girls from low-income families with up to ₹1,50,000 per year for professional courses (Engineering, Medical, Architecture, Law, etc.).',
    website: 'https://www.buddy4study.com/scholarship/kotak-kanya-scholarship'
  },
  {
    name: 'Google Generation Scholarship (APAC)',
    provider: 'Google',
    eligibility: 'Women/non-binary students enrolled in Computer Science or related technical degree programs at accredited Indian universities for the upcoming academic year.',
    amount: 75000,
    deadline: new Date('2026-12-15'),
    category: 'Private',
    type: 'Women',
    state: 'All India',
    description: 'Formerly the Google Women Techmakers Scholarship, this award supports students in computing and technology. Recipients receive a monetary scholarship and are invited to attend a retreat with Google engineers.',
    website: 'https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship-apac'
  },
  {
    name: 'Sitaram Jindal Foundation Scholarship',
    provider: 'Sitaram Jindal Foundation',
    eligibility: 'Students pursuing graduate, post-graduate, or professional courses. Family income below ₹3.5 lakh per annum. Merit of 60%+ required.',
    amount: 36000,
    deadline: new Date('2026-09-30'),
    category: 'Private',
    type: 'Merit-Cum-Means',
    state: 'All India',
    description: 'Monthly scholarships of ₹1,500 to ₹3,000 for deserving students across UG, PG, and diploma courses. One of the largest private scholarship foundations in India with wide coverage.',
    website: 'https://www.sitaramjindalfoundation.org/scholarship-702.php'
  }
];

async function seed() {
  try {
    await initDb();
    
    // Clear existing data (optional, but good for fresh seed)
    await College.destroy({ where: {} });
    await Scholarship.destroy({ where: {} });
    
    // Seed Colleges
    for (const college of collegesToSeed) {
      await College.create(college);
    }
    console.log(`Seeded ${collegesToSeed.length} colleges successfully!`);
    
    // Seed Scholarships
    for (const scholarship of scholarshipsToSeed) {
      await Scholarship.create(scholarship);
    }
    console.log(`Seeded ${scholarshipsToSeed.length} scholarships successfully!`);
    
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
