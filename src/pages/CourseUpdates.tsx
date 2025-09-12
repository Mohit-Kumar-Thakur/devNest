import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Filter, 
  Clock, 
  User, 
  BookOpen, 
  Pin,
  Calendar,
  FileText,
  AlertCircle,
  Settings,
  Plus,
  Check,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImage from '@/assets/logo.png';

interface Course {
  id: string;
  name: string;
  code: string;
  department: string;
  credits: number;
  hasLab: boolean;
  teachers: Teacher[];
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  specialization: string;
}

interface Batch {
  id: string;
  name: string;
  time: string;
  capacity: number;
}

interface EnrolledCourse {
  courseId: string;
  teacherId: string;
  batchId?: string;
  course: Course;
  teacher: Teacher;
  batch?: Batch;
}

interface CourseUpdate {
  id: string;
  title: string;
  content: string;
  professor: string;
  course: string;
  courseCode: string;
  timestamp: string;
  type: 'announcement' | 'assignment' | 'schedule' | 'exam' | 'urgent';
  isPinned: boolean;
  attachments?: string[];
}

const availableCourses: Course[] = [
  { 
    id: '1', 
    name: 'Physics', 
    code: 'PHY101', 
    department: 'Physics', 
    credits: 3, 
    hasLab: true,
    teachers: [
      { id: 't1', name: 'Dr. Sarah Smith', email: 'sarah.smith@university.edu', specialization: 'Quantum Physics' },
      { id: 't2', name: 'Prof. David Wilson', email: 'david.wilson@university.edu', specialization: 'Classical Mechanics' }
    ]
  },
  { 
    id: '2', 
    name: 'Database Systems', 
    code: 'CS201', 
    department: 'Computer Science', 
    credits: 4, 
    hasLab: true,
    teachers: [
      { id: 't3', name: 'Prof. Mike Johnson', email: 'mike.johnson@university.edu', specialization: 'Database Design' },
      { id: 't4', name: 'Dr. Rachel Lee', email: 'rachel.lee@university.edu', specialization: 'Data Mining' }
    ]
  },
  { 
    id: '3', 
    name: 'Machine Learning', 
    code: 'CS301', 
    department: 'Computer Science', 
    credits: 4, 
    hasLab: true,
    teachers: [
      { id: 't5', name: 'Dr. Emily Chen', email: 'emily.chen@university.edu', specialization: 'Deep Learning' },
      { id: 't6', name: 'Prof. Alan Kumar', email: 'alan.kumar@university.edu', specialization: 'Natural Language Processing' }
    ]
  },
  { 
    id: '4', 
    name: 'Calculus', 
    code: 'MATH101', 
    department: 'Mathematics', 
    credits: 3, 
    hasLab: false,
    teachers: [
      { id: 't7', name: 'Dr. Robert Lee', email: 'robert.lee@university.edu', specialization: 'Mathematical Analysis' },
      { id: 't8', name: 'Prof. Nancy Brown', email: 'nancy.brown@university.edu', specialization: 'Applied Mathematics' }
    ]
  },
  { 
    id: '5', 
    name: 'Literature', 
    code: 'ENG201', 
    department: 'English', 
    credits: 3, 
    hasLab: false,
    teachers: [
      { id: 't9', name: 'Prof. Lisa Williams', email: 'lisa.williams@university.edu', specialization: 'Modern Literature' },
      { id: 't10', name: 'Dr. James Miller', email: 'james.miller@university.edu', specialization: 'Shakespeare Studies' }
    ]
  },
  { 
    id: '6', 
    name: 'Data Structures', 
    code: 'CS102', 
    department: 'Computer Science', 
    credits: 4, 
    hasLab: true,
    teachers: [
      { id: 't11', name: 'Prof. Alex Kumar', email: 'alex.kumar@university.edu', specialization: 'Algorithms' },
      { id: 't12', name: 'Dr. Sophie Chen', email: 'sophie.chen@university.edu', specialization: 'Programming' }
    ]
  }
];

const availableBatches: Batch[] = [
  { id: 'b1', name: 'Batch A', time: 'Monday 9:00 AM - 12:00 PM', capacity: 25 },
  { id: 'b2', name: 'Batch B', time: 'Tuesday 2:00 PM - 5:00 PM', capacity: 25 },
  { id: 'b3', name: 'Batch C', time: 'Wednesday 10:00 AM - 1:00 PM', capacity: 25 },
  { id: 'b4', name: 'Batch D', time: 'Thursday 1:00 PM - 4:00 PM', capacity: 25 },
  { id: 'b5', name: 'Batch E', time: 'Friday 11:00 AM - 2:00 PM', capacity: 25 }
];

const mockUpdates: CourseUpdate[] = [
  {
    id: '1',
    title: 'Lab Session Rescheduled - Important',
    content: 'The Physics Lab session scheduled for Thursday has been moved to Friday 2:00 PM due to equipment maintenance. Please bring your lab manuals.',
    professor: 'Dr. Sarah Smith',
    course: 'Physics',
    courseCode: 'PHY101',
    timestamp: '2 hours ago',
    type: 'urgent',
    isPinned: true
  },
  {
    id: '2',
    title: 'Assignment Deadline Extended',
    content: 'The Database Design project deadline has been extended to next Friday (Dec 22nd) at 11:59 PM. Make sure to submit your ER diagrams and normalized tables.',
    professor: 'Prof. Mike Johnson',
    course: 'Database Systems',
    courseCode: 'CS201',
    timestamp: '4 hours ago',
    type: 'assignment',
    isPinned: true
  },
  {
    id: '3',
    title: 'Guest Lecture: AI in Healthcare',
    content: 'We have a special guest lecturer from Google AI team joining us next Tuesday to discuss applications of machine learning in healthcare.',
    professor: 'Dr. Emily Chen',
    course: 'Machine Learning',
    courseCode: 'CS301',
    timestamp: '1 day ago',
    type: 'announcement',
    isPinned: false
  },
  {
    id: '4',
    title: 'Midterm Exam Schedule',
    content: 'Midterm exams will be held on December 18th, 10:00 AM - 12:00 PM in Room 205. Topics covered: Chapters 1-6. Calculators allowed.',
    professor: 'Dr. Robert Lee',
    course: 'Calculus',
    courseCode: 'MATH101',
    timestamp: '2 days ago',
    type: 'exam',
    isPinned: false
  },
  {
    id: '5',
    title: 'New Reading Materials Available',
    content: 'I\'ve uploaded additional reading materials for next week\'s lectures. Please check the course portal and complete the readings before class.',
    professor: 'Prof. Lisa Williams',
    course: 'Literature',
    courseCode: 'ENG201',
    timestamp: '3 days ago',
    type: 'announcement',
    isPinned: false
  },
  {
    id: '6',
    title: 'Data Structures Quiz Next Week',
    content: 'We will have a quiz on Trees and Graphs next Wednesday. Please review chapters 7-9 from the textbook.',
    professor: 'Prof. Alex Kumar',
    course: 'Data Structures',
    courseCode: 'CS102',
    timestamp: '1 day ago',
    type: 'exam',
    isPinned: false
  }
];

const CourseUpdates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [showCourseSelection, setShowCourseSelection] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  
  // Multi-step selection state
  const [selectionStep, setSelectionStep] = useState<'courses' | 'teachers' | 'batches'>('courses');
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [courseTeacherSelections, setCourseTeacherSelections] = useState<Record<string, string>>({});
  const [courseBatchSelections, setCourseBatchSelections] = useState<Record<string, string>>({});

  // Load enrolled courses from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('enrolledCourses');
      if (!saved) return;
      const parsed = JSON.parse(saved);
      let enrollments: EnrolledCourse[] = [];

      if (Array.isArray(parsed) && parsed.length > 0) {
        if (parsed[0]?.course && parsed[0]?.teacher) {
          // Already in new format
          enrollments = parsed as EnrolledCourse[];
        } else if (parsed[0]?.code || parsed[0]?.id) {
          // Migrate old format (array of Course objects)
          enrollments = (parsed as any[])
            .map((old) => {
              const course = availableCourses.find(c => c.code === old.code || c.id === old.id);
              if (!course) return null;
              const teacher = course.teachers.find(t => t.name === old.professor) || course.teachers[0];
              return {
                courseId: course.id,
                teacherId: teacher.id,
                course,
                teacher,
              } as EnrolledCourse;
            })
            .filter(Boolean) as EnrolledCourse[];
        }
      }

      if (enrollments.length > 0) {
        setEnrolledCourses(enrollments);
        setIsFirstTime(false);
      }
    } catch (e) {
      console.warn('Failed to load enrolled courses from storage', e);
    }
  }, []);

  const types = ['announcement', 'assignment', 'schedule', 'exam', 'urgent'];

  const handleCourseToggle = (courseId: string) => {
    if (selectedCourseIds.includes(courseId)) {
      setSelectedCourseIds(selectedCourseIds.filter(id => id !== courseId));
      // Remove teacher and batch selections for this course
      const updatedTeachers = { ...courseTeacherSelections };
      const updatedBatches = { ...courseBatchSelections };
      delete updatedTeachers[courseId];
      delete updatedBatches[courseId];
      setCourseTeacherSelections(updatedTeachers);
      setCourseBatchSelections(updatedBatches);
    } else {
      setSelectedCourseIds([...selectedCourseIds, courseId]);
    }
  };

  const handleTeacherSelection = (courseId: string, teacherId: string) => {
    setCourseTeacherSelections(prev => ({ ...prev, [courseId]: teacherId }));
  };

  const handleBatchSelection = (courseId: string, batchId: string) => {
    setCourseBatchSelections(prev => ({ ...prev, [courseId]: batchId }));
  };

  const proceedToTeacherSelection = () => {
    setSelectionStep('teachers');
  };

  const proceedToBatchSelection = () => {
    setSelectionStep('batches');
  };

  const completeSelection = () => {
    const enrollments: EnrolledCourse[] = selectedCourseIds.map(courseId => {
      const course = availableCourses.find(c => c.id === courseId)!;
      const teacherId = courseTeacherSelections[courseId];
      const teacher = course.teachers.find(t => t.id === teacherId)!;
      const batchId = courseBatchSelections[courseId];
      const batch = batchId ? availableBatches.find(b => b.id === batchId) : undefined;

      return {
        courseId,
        teacherId,
        batchId,
        course,
        teacher,
        batch
      };
    });

    setEnrolledCourses(enrollments);
    localStorage.setItem('enrolledCourses', JSON.stringify(enrollments));
    setIsFirstTime(false);
    resetSelection();
  };

  const resetSelection = () => {
    setSelectionStep('courses');
    setSelectedCourseIds([]);
    setCourseTeacherSelections({});
    setCourseBatchSelections({});
  };

  const filteredUpdates = mockUpdates.filter(update => {
    // Only show updates for enrolled courses with matching teachers
    const isEnrolledInCourse = enrolledCourses.some(enrollment => 
      enrollment?.course?.code === update.courseCode && 
      enrollment?.teacher?.name === update.professor
    );
    if (!isEnrolledInCourse && enrolledCourses.length > 0) return false;
    
    const matchesSearch = update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.professor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || update.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const pinnedUpdates = filteredUpdates.filter(update => update.isPinned);
  const regularUpdates = filteredUpdates.filter(update => !update.isPinned);

  // Course selection step
  if (isFirstTime && selectionStep === 'courses') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl animate-scale-in">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img 
                  src={logoImage} 
                  alt="devNest Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-2xl font-bold">
                <span className="text-logo-gray">dev</span>
                <span className="text-primary">Ne</span>
                <span className="text-logo-orange">st</span>
              </h1>
            </div>
            <CardTitle className="text-3xl mb-2">Step 1: Select Your Courses 📚</CardTitle>
            <p className="text-muted-foreground text-lg">
              Choose the courses you're enrolled in this semester
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {availableCourses.map((course) => {
                  const isSelected = selectedCourseIds.includes(course.id);
                  return (
                    <Card 
                      key={course.id}
                      className={`cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                      }`}
                      onClick={() => handleCourseToggle(course.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant="outline">{course.code}</Badge>
                              <Badge variant="secondary">{course.credits} credits</Badge>
                              {course.hasLab && <Badge className="bg-accent/10 text-accent">Lab</Badge>}
                            </div>
                            <h4 className="font-semibold">{course.name}</h4>
                            <p className="text-sm text-muted-foreground">{course.teachers.length} teacher{course.teachers.length > 1 ? 's' : ''} available</p>
                            <p className="text-xs text-muted-foreground">{course.department}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'border-primary bg-primary text-primary-foreground' 
                              : 'border-muted-foreground'
                          }`}>
                            {isSelected && <Check className="w-4 h-4" />}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Selected: {selectedCourseIds.length} course{selectedCourseIds.length !== 1 ? 's' : ''}
              </p>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsFirstTime(false)}
                >
                  Skip for now
                </Button>
                <Button 
                  onClick={proceedToTeacherSelection}
                  disabled={selectedCourseIds.length === 0}
                  className="gradient-primary text-primary-foreground"
                >
                  Next: Choose Teachers →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  // Teacher selection step
  if (isFirstTime && selectionStep === 'teachers') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl animate-scale-in">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl mb-2">Step 2: Choose Your Teachers 👨‍🏫</CardTitle>
            <p className="text-muted-foreground text-lg">
              Select the specific teacher for each course
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6 mb-6">
              {selectedCourseIds.map(courseId => {
                const course = availableCourses.find(c => c.id === courseId)!;
                const selectedTeacher = courseTeacherSelections[courseId];
                
                return (
                  <div key={courseId} className="border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Badge variant="outline">{course.code}</Badge>
                      <h3 className="text-lg font-semibold">{course.name}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.teachers.map(teacher => (
                        <Card
                          key={teacher.id}
                          className={`cursor-pointer transition-all ${
                            selectedTeacher === teacher.id
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                          }`}
                          onClick={() => handleTeacherSelection(courseId, teacher.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{teacher.name}</h4>
                                <p className="text-xs text-muted-foreground">{teacher.specialization}</p>
                                <p className="text-xs text-muted-foreground">{teacher.email}</p>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedTeacher === teacher.id
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-muted-foreground'
                              }`}>
                                {selectedTeacher === teacher.id && <Check className="w-3 h-3" />}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Selected: {Object.keys(courseTeacherSelections).length} of {selectedCourseIds.length} teachers
              </p>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectionStep('courses')}
                >
                  ← Back
                </Button>
                <Button 
                  onClick={proceedToBatchSelection}
                  disabled={Object.keys(courseTeacherSelections).length !== selectedCourseIds.length}
                  className="gradient-primary text-primary-foreground"
                >
                  {selectedCourseIds.some(id => availableCourses.find(c => c.id === id)?.hasLab) 
                    ? 'Next: Choose Lab Batches →' 
                    : 'Complete Setup →'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Batch selection step
  if (isFirstTime && selectionStep === 'batches') {
    const coursesWithLabs = selectedCourseIds.filter(id => 
      availableCourses.find(c => c.id === id)?.hasLab
    );

    if (coursesWithLabs.length === 0) {
      // Skip to completion if no lab courses
      completeSelection();
      return null;
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl animate-scale-in">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl mb-2">Step 3: Choose Lab Batches 🔬</CardTitle>
            <p className="text-muted-foreground text-lg">
              Select your lab batch for courses with lab sessions
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6 mb-6">
              {coursesWithLabs.map(courseId => {
                const course = availableCourses.find(c => c.id === courseId)!;
                const selectedBatch = courseBatchSelections[courseId];
                
                return (
                  <div key={courseId} className="border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Badge variant="outline">{course.code}</Badge>
                      <h3 className="text-lg font-semibold">{course.name} Lab</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {availableBatches.map(batch => (
                        <Card
                          key={batch.id}
                          className={`cursor-pointer transition-all ${
                            selectedBatch === batch.id
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                          }`}
                          onClick={() => handleBatchSelection(courseId, batch.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{batch.name}</h4>
                                <p className="text-xs text-muted-foreground">{batch.time}</p>
                                <p className="text-xs text-muted-foreground">Capacity: {batch.capacity}</p>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedBatch === batch.id
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-muted-foreground'
                              }`}>
                                {selectedBatch === batch.id && <Check className="w-3 h-3" />}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Selected: {Object.keys(courseBatchSelections).length} of {coursesWithLabs.length} lab batches
              </p>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectionStep('teachers')}
                >
                  ← Back
                </Button>
                <Button 
                  onClick={completeSelection}
                  disabled={Object.keys(courseBatchSelections).length !== coursesWithLabs.length}
                  className="gradient-primary text-primary-foreground"
                >
                  Complete Setup ✨
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img 
                  src={logoImage} 
                  alt="devNest Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-lg font-bold">
                <span className="text-logo-gray">dev</span>
                <span className="text-primary">Ne</span>
                <span className="text-logo-orange">st</span>
              </h1>
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Title Section with Course Management */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Course Updates</h1>
              <p className="text-muted-foreground text-lg">
                Updates from your {enrolledCourses.length} enrolled course{enrolledCourses.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowCourseSelection(!showCourseSelection)}
              className="flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Manage Courses</span>
            </Button>
          </div>

          {/* Enrolled Courses Display */}
          {enrolledCourses.length > 0 && (
            <div className="space-y-2 mb-4">
              {enrolledCourses.map((enrollment) => (
                <div key={`${enrollment.courseId}-${enrollment.teacherId}`} className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">{enrollment.course.code}</Badge>
                    <div>
                      <p className="font-medium text-sm">{enrollment.course.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {enrollment.teacher.name}
                        {enrollment.batch && ` • ${enrollment.batch.name}`}
                      </p>
                    </div>
                  </div>
                  {enrollment.batch && (
                    <Badge className="bg-accent/10 text-accent text-xs">
                      {enrollment.batch.name}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}

          {enrolledCourses.length === 0 && (
            <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/5">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses selected</h3>
                <p className="text-muted-foreground mb-4">
                  Select your courses to see personalized updates from your professors
                </p>
                <Button onClick={() => {
                  resetSelection();
                  setShowCourseSelection(true);
                  setIsFirstTime(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Courses
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Course Selection Modal */}
        {showCourseSelection && (
          <Card className="mb-8 animate-scale-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Manage Your Courses</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCourseSelection(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {availableCourses.map((course) => {
                  const isSelected = enrolledCourses.some(e => e.courseId === course.id);
                  return (
                    <Card 
                      key={course.id}
                      className={`transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/5 shadow-md opacity-50' 
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant="outline">{course.code}</Badge>
                              {course.hasLab && <Badge className="bg-accent/10 text-accent text-xs">Lab</Badge>}
                            </div>
                            <h4 className="font-semibold text-sm">{course.name}</h4>
                            <p className="text-xs text-muted-foreground">{course.teachers.length} teacher{course.teachers.length > 1 ? 's' : ''}</p>
                          </div>
                          {isSelected ? (
                            <Badge variant="secondary" className="text-xs">Enrolled</Badge>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedCourseIds([course.id]);
                                setShowCourseSelection(false);
                                setIsFirstTime(true);
                                setSelectionStep('teachers');
                              }}
                            >
                              Add
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters - Only show if user has courses */}
        {enrolledCourses.length > 0 && (
          <div className="mb-8 space-y-4 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search updates, professors, or courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 bg-card border border-border rounded-md text-sm z-10"
                  style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
                >
                  <option value="all">All Types</option>
                  {types.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Show content only if user has enrolled courses */}
        {enrolledCourses.length > 0 && (
          <>
            {/* Pinned Updates */}
            {pinnedUpdates.length > 0 && (
              <div className="mb-8 animate-fade-in">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Pin className="w-5 h-5 mr-2 text-primary" />
                  Pinned Updates
                </h2>
                <div className="space-y-4">
                  {pinnedUpdates.map((update, index) => (
                    <UpdateCard key={update.id} update={update} index={index} isPinned={true} />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Updates */}
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Recent Updates</h2>
              <div className="space-y-4">
                {regularUpdates.map((update, index) => (
                  <UpdateCard key={update.id} update={update} index={pinnedUpdates.length + index} isPinned={false} />
                ))}
              </div>
            </div>

            {/* No Results */}
            {filteredUpdates.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No updates found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or check back later for new updates
                </p>
              </div>
            )}
          </>
        )}

        {/* Note about Supabase */}
        <div className="mt-12 p-4 bg-card/50 rounded-lg border border-border animate-fade-in">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Note:</strong> This shows demo course updates. Connect to Supabase to enable real-time 
            updates from professors, course enrollment, and personalized content based on your selected courses.
          </p>
        </div>
      </div>
    </div>
  );

  function getTypeIcon(type: string) {
    switch (type) {
      case 'assignment': return FileText;
      case 'exam': return AlertCircle;
      case 'schedule': return Calendar;
      case 'urgent': return AlertCircle;
      default: return BookOpen;
    }
  }

  function getTypeColor(type: string) {
    switch (type) {
      case 'assignment': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'exam': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'schedule': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'urgent': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  }

  function UpdateCard({ update, index, isPinned }: { update: CourseUpdate, index: number, isPinned: boolean }) {
    return (
      <Card 
        className={`shadow-card hover:shadow-hover transition-smooth animate-scale-in ${
          isPinned ? 'border-l-4 border-l-primary' : ''
        }`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={getTypeColor(update.type)}>
                  {React.createElement(getTypeIcon(update.type), { className: "w-3 h-3 mr-1" })}
                  {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                </Badge>
                <Badge variant="secondary">
                  {update.courseCode}
                </Badge>
              </div>
              <CardTitle className="text-lg">{update.title}</CardTitle>
            </div>
            {isPinned && <Pin className="w-4 h-4 text-primary" />}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{update.content}</p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {update.professor}
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                {update.course}
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {update.timestamp}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
};

export default CourseUpdates;