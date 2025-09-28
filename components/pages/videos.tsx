"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlayCircle, CheckCircle, Star, Trophy, BookOpen, Clock } from "lucide-react"

interface VideosPageProps {
  onBack: () => void
}

interface Video {
  id: string
  title: string
  description: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  completed: boolean
  quiz?: Quiz
}

interface Quiz {
  question: string
  options: string[]
  correctAnswer: number
}

const videos: Video[] = [
  {
    id: "compound-basics",
    title: "What is Compound Interest?",
    description: "Learn the basics of how your money can grow over time",
    duration: "3:45",
    difficulty: "Beginner",
    completed: false,
    quiz: {
      question: "What makes compound interest so powerful for growing your savings?",
      options: [
        "Flibber jabberwocky moonbeam sparkles",
        "Earning interest on both your original money and previous interest",
        "Wibbly wobbly timey wimey stuff",
        "Quantum flux capacitor dynamics",
      ],
      correctAnswer: 1,
    },
  },
  {
    id: "saving-strategies",
    title: "Smart Saving Strategies",
    description: "Simple ways to start saving money every month",
    duration: "4:20",
    difficulty: "Beginner",
    completed: true,
    quiz: {
      question: "Which saving strategy helps you build wealth over time?",
      options: [
        "Bippity boppity financial wizardry",
        "Saving a fixed amount every month consistently",
        "Zippity zap money multiplication",
        "Snurfle blurp economic algorithms",
      ],
      correctAnswer: 1,
    },
  },
  {
    id: "debt-dangers",
    title: "Understanding Debt and Interest",
    description: "Why borrowing money costs more than you think",
    duration: "5:15",
    difficulty: "Intermediate",
    completed: false,
    quiz: {
      question: "What happens when you only make minimum payments on debt?",
      options: [
        "Magical debt disappearing unicorns",
        "You pay much more in interest over time",
        "Fizzbuzz computational matrices",
        "Whimsical financial fairy dust",
      ],
      correctAnswer: 1,
    },
  },
  {
    id: "budgeting-basics",
    title: "Creating Your First Budget",
    description: "Track your money and take control of your finances",
    duration: "6:30",
    difficulty: "Beginner",
    completed: false,
    quiz: {
      question: "What is the most important part of creating a budget?",
      options: [
        "Tracking where your money actually goes",
        "Gobbledygook expense categorization",
        "Mumbo jumbo financial forecasting",
        "Hocus pocus spending predictions",
      ],
      correctAnswer: 0,
    },
  },
  {
    id: "emergency-fund",
    title: "Building an Emergency Fund",
    description: "Protect yourself from unexpected expenses",
    duration: "4:45",
    difficulty: "Intermediate",
    completed: false,
    quiz: {
      question: "How much should you aim to save in an emergency fund?",
      options: [
        "Jibberjabber savings calculations",
        "Wobbly financial safety nets",
        "3-6 months of living expenses",
        "Topsy turvy rainy day formulas",
      ],
      correctAnswer: 2,
    },
  },
  {
    id: "investment-intro",
    title: "Introduction to Investing",
    description: "Make your money work harder for you",
    duration: "7:10",
    difficulty: "Advanced",
    completed: false,
    quiz: {
      question: "What is the key principle of successful long-term investing?",
      options: [
        "Diversification and patience over time",
        "Flibbertigibbet market timing",
        "Nonsensical stock picking strategies",
        "Balderdash investment algorithms",
      ],
      correctAnswer: 0,
    },
  },
]

export function VideosPage({ onBack }: VideosPageProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [watchedVideos, setWatchedVideos] = useState<string[]>(["saving-strategies"])

  const completedCount = videos.filter((v) => watchedVideos.includes(v.id)).length
  const progressPercentage = (completedCount / videos.length) * 100

  const handleVideoPlay = (video: Video) => {
    setSelectedVideo(video)
    setShowQuiz(false)
    setQuizCompleted(false)
    setSelectedAnswer(null)
  }

  const handleVideoComplete = () => {
    if (selectedVideo && !watchedVideos.includes(selectedVideo.id)) {
      setWatchedVideos((prev) => [...prev, selectedVideo.id])
    }
    if (selectedVideo?.quiz) {
      setShowQuiz(true)
    }
  }

  const handleQuizSubmit = () => {
    setQuizCompleted(true)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/10 text-green-700 border-green-500/20"
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
      case "Advanced":
        return "bg-red-500/10 text-red-700 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
    }
  }

  return (
    <PageLayout
      title="Video Lessons"
      description="Learn financial concepts with easy-to-understand video explanations"
      showBackButton
      onBack={onBack}
    >
      <div className="space-y-6">
        {/* Progress Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">Your Learning Progress</h3>
                <p className="text-muted-foreground">Keep watching to unlock financial knowledge!</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  <span className="font-bold text-lg">
                    {completedCount}/{videos.length} Complete
                  </span>
                </div>
                <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                  {Math.round(progressPercentage)}% Progress
                </Badge>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video List */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Video Library
                </CardTitle>
                <CardDescription>Choose a video to start learning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedVideo?.id === video.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleVideoPlay(video)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {watchedVideos.includes(video.id) ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <PlayCircle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground mb-1">{video.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{video.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs ${getDifficultyColor(video.difficulty)}`}>
                            {video.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {video.duration}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Video Player and Quiz */}
          <div className="lg:col-span-2 space-y-6">
            {selectedVideo ? (
              <>
                {/* Mock Video Player */}
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedVideo.title}</CardTitle>
                    <CardDescription>{selectedVideo.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Mock Video Player Interface */}
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-80" />
                          <h3 className="text-xl font-semibold mb-2">{selectedVideo.title}</h3>
                          <p className="text-sm opacity-80">Duration: {selectedVideo.duration}</p>
                        </div>
                      </div>

                      {/* Mock Video Controls */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
                        <div className="flex items-center gap-4">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleVideoComplete}
                            className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            {watchedVideos.includes(selectedVideo.id) ? "Watch Again" : "Play Video"}
                          </Button>
                          <div className="flex-1 bg-white/20 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full w-0"></div>
                          </div>
                          <span className="text-white text-sm">{selectedVideo.duration}</span>
                        </div>
                      </div>
                    </div>

                    {watchedVideos.includes(selectedVideo.id) && (
                      <div className="flex items-center gap-2 text-green-600 mb-4">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Video completed! Great job learning.</span>
                      </div>
                    )}

                    {selectedVideo.quiz && (
                      <Button
                        onClick={handleVideoComplete}
                        variant="outline"
                        className="w-full bg-transparent"
                        disabled={!watchedVideos.includes(selectedVideo.id)}
                      >
                        {watchedVideos.includes(selectedVideo.id)
                          ? "Take Quiz to Test Your Knowledge"
                          : "Complete video to unlock quiz"}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Quiz Section */}
                {showQuiz && selectedVideo.quiz && (
                  <Card className="border-accent/30 bg-accent/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-accent" />
                        Knowledge Check Quiz
                      </CardTitle>
                      <CardDescription>Test what you learned from the video</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">{selectedVideo.quiz.question}</h4>

                        <div className="space-y-2">
                          {selectedVideo.quiz.options.map((option, index) => (
                            <label
                              key={index}
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                selectedAnswer === index
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50 hover:bg-primary/5"
                              } ${
                                quizCompleted && index === selectedVideo.quiz!.correctAnswer
                                  ? "border-green-500 bg-green-500/10"
                                  : quizCompleted &&
                                      selectedAnswer === index &&
                                      index !== selectedVideo.quiz!.correctAnswer
                                    ? "border-red-500 bg-red-500/10"
                                    : ""
                              }`}
                            >
                              <input
                                type="radio"
                                name="quiz-answer"
                                value={index}
                                checked={selectedAnswer === index}
                                onChange={() => setSelectedAnswer(index)}
                                disabled={quizCompleted}
                                className="sr-only"
                              />
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                  selectedAnswer === index ? "border-primary" : "border-muted-foreground"
                                }`}
                              >
                                {selectedAnswer === index && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                              </div>
                              <span className="text-sm">
                                {String.fromCharCode(65 + index)}. {option}
                              </span>
                            </label>
                          ))}
                        </div>

                        {!quizCompleted ? (
                          <Button onClick={handleQuizSubmit} disabled={selectedAnswer === null} className="w-full">
                            Submit Answer
                          </Button>
                        ) : (
                          <div className="text-center space-y-2">
                            {selectedAnswer === selectedVideo.quiz.correctAnswer ? (
                              <div className="text-green-600">
                                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                                <p className="font-semibold">Correct! Well done!</p>
                                <p className="text-sm">You've earned 25 learning points!</p>
                              </div>
                            ) : (
                              <div className="text-amber-600">
                                <Star className="w-8 h-8 mx-auto mb-2" />
                                <p className="font-semibold">
                                  Good try! The correct answer was option{" "}
                                  {String.fromCharCode(65 + selectedVideo.quiz.correctAnswer)}.
                                </p>
                                <p className="text-sm">You've earned 10 learning points for trying!</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <PlayCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Choose a Video to Start Learning</h3>
                  <p className="text-muted-foreground">
                    Select any video from the library to begin your financial education journey
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Learning Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Learning Tips for Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-foreground mb-2">Take Your Time</h4>
                <p className="text-sm text-muted-foreground">
                  Don't rush through the videos. Pause and replay sections you don't understand. Learning takes time!
                </p>
              </div>
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <h4 className="font-semibold text-foreground mb-2">Practice What You Learn</h4>
                <p className="text-sm text-muted-foreground">
                  After watching videos, try using the calculators to see the concepts in action with your own numbers.
                </p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-foreground mb-2">Ask Questions</h4>
                <p className="text-sm text-muted-foreground">
                  If something doesn't make sense, don't be afraid to watch the video again or ask someone for help.
                </p>
              </div>
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <h4 className="font-semibold text-foreground mb-2">Start Small</h4>
                <p className="text-sm text-muted-foreground">
                  Begin with beginner videos even if you think you know the basics. A strong foundation is important!
                </p>
              </div>
            </div>
            
            {/* News Digest Button */}
            <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Stay Informed with Financial News</h4>
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered summaries of the latest financial news and market updates
                  </p>
                </div>
                <Button 
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <a 
                    href="http://localhost:3001" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    📰 View News Digest
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
