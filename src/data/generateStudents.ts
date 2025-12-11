import type { StudentProfile, CollegeApplication, Essay, FinancialAidApplication } from '../types'

// Helper function to generate additional students
export function generateStudentsForGrade(grade: number, startId: number, count: number): StudentProfile[] {
  const firstNames = [
    'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'James',
    'Mia', 'Benjamin', 'Charlotte', 'Lucas', 'Amelia', 'Henry', 'Harper', 'Alexander', 'Evelyn', 'Michael',
    'Abigail', 'Daniel', 'Emily', 'Matthew', 'Elizabeth', 'Aiden', 'Sofia', 'Joseph', 'Avery', 'David',
    'Ella', 'Jackson', 'Madison', 'Logan', 'Scarlett', 'Samuel', 'Victoria', 'Sebastian', 'Aria', 'Owen',
    'Grace', 'Carter', 'Chloe', 'Wyatt', 'Penelope', 'Jayden', 'Layla', 'John', 'Riley', 'Luke',
    'Natalie', 'Dylan', 'Zoey', 'Grayson', 'Lillian', 'Levi', 'Addison', 'Isaac', 'Aubrey', 'Julian',
    'Hannah', 'Jack', 'Bella', 'Owen', 'Nora', 'Gabriel', 'Zoe', 'Julian', 'Stella', 'Maverick',
    'Luna', 'Aiden', 'Leah', 'Caleb', 'Hazel', 'Ryan', 'Ellie', 'Nathan', 'Paisley', 'Eli',
    'Audrey', 'Connor', 'Savannah', 'Hunter', 'Claire', 'Evan', 'Skylar', 'Tyler', 'Lucy', 'Zachary'
  ]

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee',
    'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
    'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams',
    'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips',
    'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris',
    'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy', 'Bailey', 'Rivera', 'Cooper', 'Richardson',
    'Cox', 'Howard', 'Ward', 'Torres', 'Peterson', 'Gray', 'Ramirez', 'James', 'Watson', 'Brooks',
    'Kelly', 'Sanders', 'Price', 'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson', 'Coleman', 'Jenkins'
  ]

  const interestCategories = [
    ['STEM', 'Robotics', 'Mathematics'],
    ['Art', 'Design', 'Creative Writing'],
    ['Music', 'Theater', 'Dance'],
    ['Sports', 'Athletics', 'Fitness'],
    ['Environmental Justice', 'Sustainability', 'Biology'],
    ['Business', 'Economics', 'Entrepreneurship'],
    ['Journalism', 'Writing', 'Communication'],
    ['Medicine', 'Healthcare', 'Biology'],
    ['Education', 'Teaching', 'Social Work'],
    ['Law', 'Political Science', 'History'],
    ['Computer Science', 'Technology', 'Programming'],
    ['Psychology', 'Sociology', 'Human Services'],
    ['Engineering', 'Physics', 'Chemistry'],
    ['Literature', 'English', 'Poetry'],
    ['Photography', 'Film', 'Media']
  ]

  const commonExtracurriculars = [
    { title: 'Student Council', org: 'School', hours: 3 },
    { title: 'Debate Team', org: 'School', hours: 4 },
    { title: 'Yearbook', org: 'School', hours: 3 },
    { title: 'Math Club', org: 'School', hours: 2 },
    { title: 'Art Club', org: 'School', hours: 3 },
    { title: 'Music Ensemble', org: 'School', hours: 4 },
    { title: 'Sports Team', org: 'School', hours: 6 },
    { title: 'Volunteer Work', org: 'Community', hours: 3 },
    { title: 'Part-time Job', org: 'Local Business', hours: 10 },
    { title: 'Tutoring', org: 'School', hours: 2 }
  ]

  const students: StudentProfile[] = []
  let idCounter = startId

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const name = `${firstName} ${lastName}`
    
    // Vary GPA between 2.5 and 4.0
    const gpa = Math.round((Math.random() * 1.5 + 2.5) * 10) / 10
    
    // Select 1-3 interests
    const interestSet = interestCategories[Math.floor(Math.random() * interestCategories.length)]
    const numInterests = Math.floor(Math.random() * 3) + 1
    const interests = interestSet.slice(0, numInterests)
    
    // Generate SAT/ACT scores for grades 11-12
    let satScore: number | undefined
    let actScore: number | undefined
    if (grade >= 11) {
      if (Math.random() > 0.3) { // 70% have SAT scores
        satScore = Math.floor(Math.random() * 600) + 1000 // 1000-1600
      }
      if (Math.random() > 0.5) { // 50% have ACT scores
        actScore = Math.floor(Math.random() * 12) + 20 // 20-32
      }
    }

    // AP courses (more common in upper grades)
    const apCourses: string[] = []
    const apOptions = ['AP World History', 'AP US History', 'AP Biology', 'AP Chemistry', 'AP Physics', 'AP English Language', 'AP English Literature', 'AP Calculus AB', 'AP Calculus BC', 'AP Statistics', 'AP Computer Science', 'AP Psychology', 'AP Spanish', 'AP French']
    const numAPs = grade === 9 ? 0 : grade === 10 ? Math.floor(Math.random() * 2) : grade === 11 ? Math.floor(Math.random() * 4) + 1 : Math.floor(Math.random() * 5) + 2
    for (let j = 0; j < numAPs && j < apOptions.length; j++) {
      const ap = apOptions[Math.floor(Math.random() * apOptions.length)]
      if (!apCourses.includes(ap)) {
        apCourses.push(ap)
      }
    }

    // Honors courses
    const honorsCourses: string[] = []
    const honorsOptions = ['Honors English', 'Honors Math', 'Honors Science', 'Honors Biology', 'Honors Chemistry', 'Honors History', 'Honors Pre-Calculus']
    const numHonors = Math.floor(Math.random() * 3) + 1
    for (let j = 0; j < numHonors && j < honorsOptions.length; j++) {
      const honors = honorsOptions[Math.floor(Math.random() * honorsOptions.length)]
      if (!honorsCourses.includes(honors)) {
        honorsCourses.push(honors)
      }
    }

    // Awards
    const awards: string[] = []
    const awardOptions = ['Honor Roll', 'Dean\'s List', 'Student of the Month', 'Perfect Attendance', 'Academic Excellence', 'Community Service Award', 'Leadership Award']
    const numAwards = Math.floor(Math.random() * 3)
    for (let j = 0; j < numAwards; j++) {
      const award = awardOptions[Math.floor(Math.random() * awardOptions.length)]
      if (!awards.includes(award)) {
        awards.push(award)
      }
    }

    // Skills (2-5 skills)
    const allSkills = ['Writing', 'Public Speaking', 'Leadership', 'Teamwork', 'Problem Solving', 'Research', 'Time Management', 'Communication', 'Organization', 'Creativity', 'Critical Thinking', 'Collaboration', 'Adaptability', 'Technical Skills', 'Analytical Thinking']
    const numSkills = Math.floor(Math.random() * 4) + 2
    const skills: string[] = []
    for (let j = 0; j < numSkills; j++) {
      const skill = allSkills[Math.floor(Math.random() * allSkills.length)]
      if (!skills.includes(skill)) {
        skills.push(skill)
      }
    }

    // Extracurriculars (1-3 activities)
    const numExtracurriculars = Math.floor(Math.random() * 3) + 1
    const extracurriculars = []
    const usedExtracurriculars: string[] = []
    for (let j = 0; j < numExtracurriculars; j++) {
      const ec = commonExtracurriculars[Math.floor(Math.random() * commonExtracurriculars.length)]
      if (!usedExtracurriculars.includes(ec.title)) {
        usedExtracurriculars.push(ec.title)
        const startYear = 2021 + (grade - 9)
        extracurriculars.push({
          id: `ec-${idCounter}-${j}`,
          title: ec.title,
          organization: ec.org,
          startDate: `${startYear}-09-01`,
          endDate: null,
          hoursPerWeek: ec.hours,
          description: `Active participant in ${ec.title.toLowerCase()}`,
          role: ec.title === 'Student Council' ? 'Member' : ec.title === 'Sports Team' ? 'Team Member' : undefined
        })
      }
    }

    // Career goals based on interests
    const careerGoals: string[] = []
    if (interests.includes('STEM') || interests.includes('Robotics')) {
      careerGoals.push('Engineer', 'Scientist')
    } else if (interests.includes('Art') || interests.includes('Design')) {
      careerGoals.push('Artist', 'Designer')
    } else if (interests.includes('Business') || interests.includes('Economics')) {
      careerGoals.push('Business Professional', 'Entrepreneur')
    } else if (interests.includes('Medicine') || interests.includes('Healthcare')) {
      careerGoals.push('Doctor', 'Healthcare Professional')
    } else if (interests.includes('Education') || interests.includes('Teaching')) {
      careerGoals.push('Teacher', 'Educator')
    } else if (interests.includes('Computer Science') || interests.includes('Technology')) {
      careerGoals.push('Software Engineer', 'Tech Professional')
    } else {
      careerGoals.push('Professional', 'Career Professional')
    }

    // Intended major (more common in upper grades)
    const intendedMajor = grade >= 11 && Math.random() > 0.4 ? careerGoals[0] : undefined

    // College applications (only for grades 11-12)
    const collegeApplications: CollegeApplication[] = []
    if (grade >= 11) {
      const colleges = ['Boston University', 'Northeastern University', 'UMass Boston', 'Boston College', 'Harvard University', 'MIT', 'Tufts University', 'Emerson College', 'Berklee College of Music', 'Wentworth Institute']
      const numApplications = grade === 11 ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 5) + 2
      for (let j = 0; j < numApplications && j < colleges.length; j++) {
        const college = colleges[Math.floor(Math.random() * colleges.length)]
        if (!collegeApplications.find(app => app.collegeName === college)) {
          const categories: Array<'reach' | 'target' | 'safety'> = ['reach', 'target', 'safety']
          const statuses: Array<'not-started' | 'in-progress' | 'submitted'> = grade === 11 ? ['not-started', 'in-progress'] : ['in-progress', 'submitted']
          collegeApplications.push({
            id: `app-${idCounter}-${j}`,
            collegeName: college,
            category: categories[Math.floor(Math.random() * categories.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            applicationDeadline: grade === 11 ? '2025-01-15' : '2024-11-01'
          })
        }
      }
    }

    // Essays (only for grades 11-12)
    const essays: Essay[] = []
    if (grade >= 11 && collegeApplications.length > 0) {
      const essayStatus: 'draft' | 'in-progress' | 'submitted' = grade === 11 ? (Math.random() > 0.5 ? 'draft' : 'in-progress') : (Math.random() > 0.7 ? 'submitted' : 'in-progress')
      essays.push({
        id: `essay-${idCounter}`,
        title: 'Common App Personal Statement',
        prompt: 'Tell us about yourself',
        wordCount: Math.floor(Math.random() * 300) + 200,
        targetWordCount: 650,
        status: essayStatus,
        deadline: grade === 11 ? '2025-01-15' : '2024-11-01'
      })
    }

    // Financial aid applications (only for grades 11-12)
    const financialAidApplications: FinancialAidApplication[] = []
    if (grade >= 11) {
      const faStatus: 'not-started' | 'in-progress' | 'submitted' = grade === 11 ? 'not-started' : (Math.random() > 0.5 ? 'submitted' : 'in-progress')
      financialAidApplications.push({
        id: `fa-${idCounter}`,
        type: 'FAFSA' as const,
        status: faStatus,
        deadline: '2025-03-01',
        ...(grade === 12 && Math.random() > 0.5 ? { submittedDate: '2024-10-10' } : {})
      })
    }

    students.push({
      id: `student-${idCounter}`,
      name,
      grade,
      school: 'Boston Public School',
      location: 'Boston, MA',
      gpa,
      satScore,
      actScore,
      interests,
      currentDate: '2024-10-15',
      apCourses,
      honorsCourses,
      awards,
      skills,
      certifications: [],
      extracurriculars,
      intendedMajor,
      careerGoals,
      collegeApplications,
      essays,
      financialAidApplications,
      recommendedOpportunities: []
    })

    idCounter++
  }

  return students
}


