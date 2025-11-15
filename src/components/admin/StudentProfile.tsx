import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, GraduationCap, Target, FileText, Briefcase, ExternalLink, MessageSquare } from 'lucide-react'
import type { StudentProfile as StudentProfileType, Forum, ForumThread, ForumPost } from '@/types'
import { resources } from '@/data/resources'
import { forums as defaultForums } from '@/data/forumData'
import { Link } from 'react-router-dom'

const gradeLabels: Record<number, string> = {
  9: 'Freshman',
  10: 'Sophomore',
  11: 'Junior',
  12: 'Senior',
}

function getInitials(name: string): string {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}


interface StudentProfileProps {
  student: StudentProfileType
  onBack: () => void
}

export function StudentProfile({ student, onBack }: StudentProfileProps) {
  // Get opportunities the student has explored (viewed/clicked)
  const exploredOpportunities = (() => {
    const studentRecommendations = JSON.parse(localStorage.getItem('student-recommended-opportunities') || '{}')
    const recommendedIds = studentRecommendations[student.id] || student.recommendedOpportunities || []
    if (recommendedIds.length === 0) return []

    return recommendedIds
      .map((oppId: string) => {
        // Try to find in system resources first
        let opportunity = resources.find((r) => r.id === oppId)
        // If not found, try admin opportunities
        if (!opportunity) {
          const adminOpps = JSON.parse(localStorage.getItem('admin-opportunities') || '[]')
          opportunity = adminOpps.find((r: any) => r.id === oppId)
        }
        return opportunity
      })
      .filter(Boolean)
  })()

  // Combine all courses (AP and Honors)
  const allCourses = [...student.apCourses, ...student.honorsCourses]

  // Get forum activity for this student
  const forumActivity = (() => {
    // Get forum data from localStorage (updated by ForumsPage) or use default data
    let forumData: Forum[] = JSON.parse(localStorage.getItem('forum-data') || '[]')
    
    // If no forum data in localStorage, initialize with default forum data
    if (forumData.length === 0) {
      forumData = defaultForums
      localStorage.setItem('forum-data', JSON.stringify(defaultForums))
    }
    
    // For demo: create a mapping if it doesn't exist
    // In a real app, this would be set when the student first posts
    let studentForumMapping = JSON.parse(localStorage.getItem('student-forum-mapping') || '{}')
    if (!studentForumMapping[student.id]) {
      // Create demo mappings: assign first few students to existing forum IDs for demo purposes
      const demoMappings: Record<string, string> = {
        'student-1': 'student-42', // Alex Johnson -> matches forum thread author
        'student-2': 'student-56', // Maria Garcia -> matches forum thread author
        'student-3': 'student-78', // Jordan Smith -> matches forum thread author
        'student-4': 'student-34', // Taylor Chen -> matches forum thread author
        'student-5': 'student-45', // Riley Williams -> matches forum thread author
        'student-6': 'student-89', // Casey Brown -> matches forum post author
        'student-7': 'student-12', // Morgan Davis -> matches forum thread author
        'student-8': 'student-23', // Sam Anderson -> matches forum post author
      }
      
      // Use demo mapping if available, otherwise create a generic one
      studentForumMapping[student.id] = demoMappings[student.id] || `student-${student.id.split('-')[1] || 'demo'}`
      localStorage.setItem('student-forum-mapping', JSON.stringify(studentForumMapping))
    }
    const anonymousId = studentForumMapping[student.id]
    
    const studentThreads: Array<{ forum: Forum; thread: ForumThread }> = []
    const studentPosts: Array<{ forum: Forum; thread: ForumThread; post: ForumPost }> = []

    forumData.forEach((forum) => {
      forum.threads.forEach((thread) => {
        // Check if student created this thread
        if (thread.authorId === anonymousId) {
          studentThreads.push({ forum, thread })
        }
        
        // Check if student made any posts in this thread
        thread.posts.forEach((post) => {
          if (post.authorId === anonymousId) {
            studentPosts.push({ forum, thread, post })
          }
        })
      })
    })

    return { threads: studentThreads, posts: studentPosts }
  })()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>
        <div className="flex items-center gap-4 flex-1">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl">
            {getInitials(student.name)}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{student.name}</h1>
            <p className="text-muted-foreground">
              {gradeLabels[student.grade]} • {student.school} • {student.location}
            </p>
          </div>
        </div>
      </div>

      {/* Current Interests Section */}
      {student.interests.length > 0 && (
        <Card className="border-3 border-primary/30 rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Current Interests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {student.interests.map((interest, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm py-1 px-3">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Courses Section */}
      {allCourses.length > 0 && (
        <Card className="border-3 border-primary/30 rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {student.apCourses.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">AP Courses</h3>
                <div className="flex flex-wrap gap-2">
                  {student.apCourses.map((course, idx) => (
                    <Badge key={idx} variant="outline">
                      {course}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {student.honorsCourses.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Honors Courses</h3>
                <div className="flex flex-wrap gap-2">
                  {student.honorsCourses.map((course, idx) => (
                    <Badge key={idx} variant="outline">
                      {course}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Opportunities Explored Section */}
      {exploredOpportunities.length > 0 && (
        <Card className="border-3 border-primary/30 rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Opportunities Explored
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exploredOpportunities.map((opportunity: any) => (
                <div key={opportunity.id} className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-1">{opportunity.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{opportunity.description}</p>
                  {opportunity.deadline && (
                    <p className="text-xs text-muted-foreground">
                      Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages to You Section */}
      <Card className="border-3 border-primary/30 rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages to You
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            // Get student-specific preferences (stored per student ID)
            const studentPreferences = JSON.parse(
              localStorage.getItem(`student-preferences-${student.id}`) || '{}'
            )
            const counselorMessage = studentPreferences.counselorMessage
            
            // Fallback to global preferences for backward compatibility
            if (!counselorMessage) {
              const globalPreferences = JSON.parse(localStorage.getItem('opportunity-preferences') || '{}')
              const globalMessage = globalPreferences.counselorMessage
              if (globalMessage && globalMessage.trim() !== '') {
                return (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{globalMessage}</p>
                  </div>
                )
              }
            }
            
            if (counselorMessage && counselorMessage.trim() !== '') {
              return (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{counselorMessage}</p>
                </div>
              )
            }
            
            return (
              <div className="text-center py-8 text-muted-foreground">
                <p>No messages from this student yet.</p>
                <p className="text-sm mt-2">Students can send you messages through their preferences page.</p>
              </div>
            )
          })()}
        </CardContent>
      </Card>

      {/* Resume Link Section */}
      <Card className="border-3 border-primary/30 rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Link
            to="/resume"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            View Resume
            <ExternalLink className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>

      {/* Forum Activity Section */}
      <Card className="border-3 border-primary/30 rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Forum Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {forumActivity.threads.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Threads Created ({forumActivity.threads.length})</h3>
                <div className="space-y-3">
                  {forumActivity.threads.map(({ forum, thread }) => (
                    <div key={thread.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold">{thread.title}</h4>
                          <p className="text-sm text-muted-foreground">in {forum.title}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {thread.posts.length} {thread.posts.length === 1 ? 'reply' : 'replies'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {thread.posts[0]?.content || 'No content'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(thread.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {forumActivity.posts.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Posts Made ({forumActivity.posts.length})</h3>
                <div className="space-y-3">
                  {forumActivity.posts.slice(0, 5).map(({ forum, thread, post }) => (
                    <div key={post.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{thread.title}</h4>
                          <p className="text-xs text-muted-foreground">in {forum.title}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-3">{post.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {forumActivity.posts.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      +{forumActivity.posts.length - 5} more posts
                    </p>
                  )}
                </div>
              </div>
            )}

            {forumActivity.threads.length === 0 && forumActivity.posts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No forum activity yet.</p>
                <p className="text-sm mt-2">This student hasn't created any threads or made any posts.</p>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
}

