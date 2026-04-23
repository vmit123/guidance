const COMPREHENSIVE_KNOWLEDGE = {
    "platform_info": {
        "description": "Digital Career Advisor is a comprehensive platform designed specifically for Jammu & Kashmir students",
        "services": [
            "Career Aptitude Testing - Discover your strengths and perfect career match",
            "College Explorer - Browse colleges with detailed information",
            "Scholarship Finder - Access thousands of funding opportunities",
            "Educational Timeline Planning - Plan your academic journey"
        ],
        "target_audience": "Students from Jammu & Kashmir region"
    },
    
    "colleges_detailed": {
        "jammu_colleges": [
            "University of Jammu - Offers various undergraduate and postgraduate programs",
            "Government Medical College Jammu - Premier medical institution",
            "Jammu College of Engineering and Technology - Engineering programs",
            "Jammu Institute of Management - Business and management courses"
        ],
        "srinagar_colleges": [
            "University of Kashmir - Leading university with diverse programs",
            "Government Medical College Srinagar - Medical education hub",
            "National Institute of Technology Srinagar - Premier engineering institute",
            "Islamic University of Science and Technology - Technology and science programs"
        ],
        "admission_process": [
            "Check eligibility criteria for desired course",
            "Fill out application forms before deadline",
            "Submit required documents and certificates",
            "Appear for entrance exams if applicable",
            "Wait for merit list and counseling"
        ]
    },
    
    "scholarships_detailed": {
        "government_scholarships": [
            "Post Matric Scholarship for J&K Students",
            "Merit Scholarship for Higher Education",
            "National Scholarship Portal schemes",
            "Chief Minister's Scholarship Program"
        ],
        "private_scholarships": [
            "Corporate scholarships from major companies",
            "Foundation and NGO scholarships",
            "Merit-based institutional scholarships",
            "Need-based financial aid programs"
        ],
        "application_tips": [
            "Keep all academic documents ready",
            "Apply before deadlines",
            "Write compelling personal statements",
            "Get recommendation letters from teachers"
        ]
    },
    
    "career_guidance": {
        "popular_careers": [
            "Engineering - Software, Civil, Mechanical, Electrical",
            "Medicine - MBBS, Dentistry, Pharmacy, Nursing",
            "Management - MBA, Business Administration",
            "Education - Teaching, Research, Administration",
            "Government Services - Civil Services, Banking, Defense"
        ],
        "aptitude_areas": [
            "Logical Reasoning and Problem Solving",
            "Verbal and Communication Skills",
            "Mathematical and Analytical Ability",
            "Creative and Artistic Skills",
            "Leadership and Team Management"
        ],
        "career_planning_steps": [
            "Self-assessment and interest identification",
            "Research career options and requirements",
            "Set educational and career goals",
            "Develop necessary skills and qualifications",
            "Create action plan with timelines"
        ]
    },
    
    "educational_paths": {
        "after_10th": [
            "Science Stream - PCM (Physics, Chemistry, Mathematics)",
            "Commerce Stream - Business and Economics focus",
            "Arts Stream - Humanities and Social Sciences",
            "Vocational Courses - Skill-based training"
        ],
        "after_12th": [
            "Engineering - B.Tech/B.E programs",
            "Medicine - MBBS, BDS, Pharmacy",
            "Commerce - B.Com, BBA, CA",
            "Arts - BA in various specializations",
            "Law - LLB programs",
            "Agriculture - B.Sc Agriculture"
        ],
        "higher_education": [
            "Master's Programs - M.Tech, MBA, M.Sc, MA",
            "Research Programs - M.Phil, Ph.D",
            "Professional Courses - CA, CS, CFA",
            "Government Exams - UPSC, Banking, SSC"
        ]
    }
};

const getDetailedResponse = (intent, query) => {
    const queryLower = query.toLowerCase();
    
    if (intent === "colleges") {
        if (queryLower.includes("jammu")) {
            return `Here are some top colleges in Jammu:\n\n` + COMPREHENSIVE_KNOWLEDGE.colleges_detailed.jammu_colleges.map(c => `• ${c}`).join("\n");
        } else if (queryLower.includes("srinagar")) {
            return `Here are some top colleges in Srinagar:\n\n` + COMPREHENSIVE_KNOWLEDGE.colleges_detailed.srinagar_colleges.map(c => `• ${c}`).join("\n");
        } else if (queryLower.includes("admission")) {
            return `Here's the general admission process:\n\n` + COMPREHENSIVE_KNOWLEDGE.colleges_detailed.admission_process.map((step, i) => `${i + 1}. ${step}`).join("\n");
        } else {
            return "I can provide detailed information about colleges in Jammu, Srinagar, and other districts. What specific information are you looking for?";
        }
    } else if (intent === "scholarships") {
        if (queryLower.includes("government")) {
            return `Government scholarships available:\n\n` + COMPREHENSIVE_KNOWLEDGE.scholarships_detailed.government_scholarships.map(s => `• ${s}`).join("\n");
        } else if (queryLower.includes("private")) {
            return `Private scholarships available:\n\n` + COMPREHENSIVE_KNOWLEDGE.scholarships_detailed.private_scholarships.map(s => `• ${s}`).join("\n");
        } else if (queryLower.includes("apply") || queryLower.includes("application")) {
            return `Scholarship application tips:\n\n` + COMPREHENSIVE_KNOWLEDGE.scholarships_detailed.application_tips.map(t => `• ${t}`).join("\n");
        } else {
            return "I can help you with government scholarships, private funding, and application guidance. What type of scholarship information do you need?";
        }
    } else if (intent === "career_guidance") {
        if (queryLower.includes("career") && (queryLower.includes("popular") || queryLower.includes("options"))) {
            return `Popular career options for J&K students:\n\n` + COMPREHENSIVE_KNOWLEDGE.career_guidance.popular_careers.map(c => `• ${c}`).join("\n");
        } else if (queryLower.includes("aptitude")) {
            return `Key aptitude areas assessed:\n\n` + COMPREHENSIVE_KNOWLEDGE.career_guidance.aptitude_areas.map(a => `• ${a}`).join("\n");
        } else if (queryLower.includes("plan")) {
            return `Career planning steps:\n\n` + COMPREHENSIVE_KNOWLEDGE.career_guidance.career_planning_steps.map((step, i) => `${i + 1}. ${step}`).join("\n");
        } else {
            return "I can help with career options, aptitude assessment, and planning guidance. What aspect of career guidance interests you?";
        }
    }
    
    return null;
};

module.exports = {
    COMPREHENSIVE_KNOWLEDGE,
    getDetailedResponse
};
