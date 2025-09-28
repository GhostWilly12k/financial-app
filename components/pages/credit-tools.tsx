"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  BookOpen,
  Plus,
  Trash2,
  Award,
  Calendar,
  DollarSign,
} from "lucide-react"

interface CreditCard {
  id: string
  name: string
  balance: number
  limit: number
}

interface CreditAction {
  action: string
  impact: number
  description: string
  timeframe: string
}

interface CreditToolsProps {
  onPointsEarned: (points: number) => void
}

export function CreditTools({ onPointsEarned }: CreditToolsProps) {
  const [currentScore, setCurrentScore] = useState(650)
  const [creditCards, setCreditCards] = useState<CreditCard[]>([
    { id: "1", name: "Visa Credit Card", balance: 3500, limit: 10000 },
    { id: "2", name: "Store Card", balance: 1200, limit: 5000 },
  ])

  const [newCard, setNewCard] = useState({
    name: "",
    balance: "",
    limit: "",
  })

  const [selectedActions, setSelectedActions] = useState<string[]>([])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [activeGoals, setActiveGoals] = useState<string[]>(["utilization_goal"])

  // Credit actions and their impacts
  const creditActions: CreditAction[] = [
    {
      action: "pay_on_time",
      impact: 15,
      description: "Make all payments on time for 6 months",
      timeframe: "6 months",
    },
    {
      action: "pay_late",
      impact: -50,
      description: "Miss a payment by 30+ days",
      timeframe: "Immediate",
    },
    {
      action: "reduce_utilization",
      impact: 25,
      description: "Keep credit utilization below 30%",
      timeframe: "2-3 months",
    },
    {
      action: "max_out_card",
      impact: -40,
      description: "Use 90%+ of credit limit",
      timeframe: "1-2 months",
    },
    {
      action: "open_new_card",
      impact: -10,
      description: "Apply for a new credit card",
      timeframe: "Immediate",
    },
    {
      action: "close_old_card",
      impact: -15,
      description: "Close your oldest credit card",
      timeframe: "1-3 months",
    },
    {
      action: "pay_off_debt",
      impact: 30,
      description: "Pay off all credit card debt",
      timeframe: "3-6 months",
    },
  ]

  // Credit education lessons
  const creditLessons = [
    {
      id: "basics",
      title: "Credit Score Basics",
      description: "What is a credit score and why does it matter?",
      content:
        "Your credit score is a number between 300-850 that shows lenders how likely you are to repay borrowed money. Higher scores mean better loan terms and lower interest rates.",
      points: 10,
    },
    {
      id: "utilization",
      title: "Credit Utilization",
      description: "How much of your credit limit should you use?",
      content:
        "Keep your credit utilization below 30% of your limit. For example, if your limit is R10,000, try to keep your balance below R3,000. Lower is even better!",
      points: 15,
    },
    {
      id: "payment_history",
      title: "Payment History",
      description: "Why paying on time is crucial",
      content:
        "Payment history makes up 35% of your credit score. Even one late payment can hurt your score for months. Set up automatic payments to never miss a due date.",
      points: 15,
    },
    {
      id: "building_credit",
      title: "Building Good Credit",
      description: "Smart strategies for improving your score",
      content:
        "Pay bills on time, keep balances low, don't close old cards, and only apply for credit when needed. Building good credit takes time but pays off with better rates.",
      points: 20,
    },
  ]

  // Calculate overall utilization
  const totalBalance = creditCards.reduce((sum, card) => sum + card.balance, 0)
  const totalLimit = creditCards.reduce((sum, card) => sum + card.limit, 0)
  const overallUtilization = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0

  // Calculate simulated score
  const calculateSimulatedScore = () => {
    let simulatedScore = currentScore
    selectedActions.forEach((actionId) => {
      const action = creditActions.find((a) => a.action === actionId)
      if (action) {
        simulatedScore += action.impact
      }
    })
    return Math.max(300, Math.min(850, simulatedScore))
  }

  const addCreditCard = () => {
    if (newCard.name && newCard.balance && newCard.limit) {
      const card: CreditCard = {
        id: Date.now().toString(),
        name: newCard.name,
        balance: Number.parseFloat(newCard.balance),
        limit: Number.parseFloat(newCard.limit),
      }
      setCreditCards([...creditCards, card])
      setNewCard({ name: "", balance: "", limit: "" })
      onPointsEarned(5)
    }
  }

  const removeCreditCard = (id: string) => {
    setCreditCards(creditCards.filter((card) => card.id !== id))
  }

  const toggleAction = (actionId: string) => {
    setSelectedActions((prev) => (prev.includes(actionId) ? prev.filter((id) => id !== actionId) : [...prev, actionId]))
  }

  const completeLesson = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId])
      const lesson = creditLessons.find((l) => l.id === lessonId)
      if (lesson) {
        onPointsEarned(lesson.points)
      }
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600"
    if (score >= 650) return "text-blue-600"
    if (score >= 550) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 750) return "Excellent"
    if (score >= 650) return "Good"
    if (score >= 550) return "Fair"
    return "Poor"
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Credit Score Tools</h1>
        <p className="text-muted-foreground">Build and maintain excellent credit for better financial opportunities</p>
      </div>

      <Tabs defaultValue="simulator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="simulator">Score Simulator</TabsTrigger>
          <TabsTrigger value="utilization">Utilization Tracker</TabsTrigger>
          <TabsTrigger value="lessons">Credit Lessons</TabsTrigger>
          <TabsTrigger value="goals">Goals & Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="simulator" className="space-y-6">
          {/* Current Score Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Credit Score Simulator
              </CardTitle>
              <CardDescription>See how different actions would affect your credit score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-score">Your Current Credit Score</Label>
                    <Input
                      id="current-score"
                      type="number"
                      value={currentScore}
                      onChange={(e) => setCurrentScore(Number.parseFloat(e.target.value) || 650)}
                      min={300}
                      max={850}
                      className="text-2xl font-bold text-center"
                    />
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className={`text-3xl font-bold ${getScoreColor(currentScore)}`}>{currentScore}</div>
                    <div className="text-sm text-muted-foreground">{getScoreLabel(currentScore)} Credit</div>
                    <Progress value={((currentScore - 300) / (850 - 300)) * 100} className="mt-2 h-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Simulated Score After Actions</h4>
                  <div className="text-center p-4 border rounded-lg bg-primary/5">
                    <div className={`text-3xl font-bold ${getScoreColor(calculateSimulatedScore())}`}>
                      {calculateSimulatedScore()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getScoreLabel(calculateSimulatedScore())} Credit
                    </div>
                    <div
                      className={`text-sm font-medium mt-1 ${
                        calculateSimulatedScore() > currentScore
                          ? "text-green-600"
                          : calculateSimulatedScore() < currentScore
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    >
                      {calculateSimulatedScore() > currentScore ? "+" : ""}
                      {calculateSimulatedScore() - currentScore} points
                    </div>
                    <Progress value={((calculateSimulatedScore() - 300) / (850 - 300)) * 100} className="mt-2 h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Select Actions to Simulate</CardTitle>
              <CardDescription>Choose actions to see their combined impact on your credit score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {creditActions.map((action) => (
                  <div
                    key={action.action}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedActions.includes(action.action)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => toggleAction(action.action)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {action.impact > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`font-bold ${action.impact > 0 ? "text-green-600" : "text-red-600"}`}>
                          {action.impact > 0 ? "+" : ""}
                          {action.impact}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {action.timeframe}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium mb-1">{action.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="utilization" className="space-y-6">
          {/* Overall Utilization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Credit Utilization Tracker
              </CardTitle>
              <CardDescription>Monitor your credit card usage to maintain a healthy credit score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold mb-2">
                    <span
                      className={
                        overallUtilization > 30
                          ? "text-red-600"
                          : overallUtilization > 10
                            ? "text-orange-600"
                            : "text-green-600"
                      }
                    >
                      {overallUtilization.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">Overall Credit Utilization</p>
                  <Progress value={overallUtilization} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0%</span>
                    <span className="text-orange-600">30%</span>
                    <span>100%</span>
                  </div>
                </div>

                {overallUtilization > 30 && (
                  <Alert className="border-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Your credit utilization is above 30%. This could negatively impact your credit score. Try to pay
                      down balances or increase credit limits.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Balance:</span>
                      <span className="font-bold">R{totalBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Limit:</span>
                      <span className="font-bold">R{totalLimit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available Credit:</span>
                      <span className="font-bold text-green-600">R{(totalLimit - totalBalance).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>Utilization Guidelines:</strong>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>0-10%: Excellent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span>10-30%: Good</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>30%+: Poor</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Individual Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Individual Card Utilization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {creditCards.map((card) => {
                const utilization = (card.balance / card.limit) * 100
                return (
                  <div key={card.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{card.name}</h4>
                      <Button variant="ghost" size="sm" onClick={() => removeCreditCard(card.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Balance:</span>
                          <span>R{card.balance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Limit:</span>
                          <span>R{card.limit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Available:</span>
                          <span className="text-green-600">R{(card.limit - card.balance).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Utilization:</span>
                          <span
                            className={`font-bold ${
                              utilization > 30
                                ? "text-red-600"
                                : utilization > 10
                                  ? "text-orange-600"
                                  : "text-green-600"
                            }`}
                          >
                            {utilization.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={utilization} className="h-2" />
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Add New Card */}
              <div className="p-4 border-2 border-dashed rounded-lg space-y-4">
                <h4 className="font-semibold">Add Credit Card</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="card-name">Card Name</Label>
                    <Input
                      id="card-name"
                      value={newCard.name}
                      onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                      placeholder="e.g., Visa Card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="card-balance">Current Balance (R)</Label>
                    <Input
                      id="card-balance"
                      type="number"
                      value={newCard.balance}
                      onChange={(e) => setNewCard({ ...newCard, balance: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="card-limit">Credit Limit (R)</Label>
                    <Input
                      id="card-limit"
                      type="number"
                      value={newCard.limit}
                      onChange={(e) => setNewCard({ ...newCard, limit: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
                <Button onClick={addCreditCard} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Credit Card
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Smart Credit Habits Mini-Lessons
              </CardTitle>
              <CardDescription>Learn essential credit concepts in bite-sized lessons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {creditLessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id)
                  return (
                    <Card
                      key={lesson.id}
                      className={`cursor-pointer transition-all ${
                        isCompleted ? "bg-green-50 border-green-200" : "hover:shadow-md"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <BookOpen className="w-5 h-5 text-primary" />
                            )}
                            <h4 className="font-semibold">{lesson.title}</h4>
                          </div>
                          <Badge variant="secondary">+{lesson.points} pts</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{lesson.description}</p>
                        <p className="text-sm mb-4">{lesson.content}</p>
                        {!isCompleted ? (
                          <Button onClick={() => completeLesson(lesson.id)} size="sm" className="w-full">
                            Complete Lesson
                          </Button>
                        ) : (
                          <div className="text-center">
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Completed!
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Credit Goals & Challenges
              </CardTitle>
              <CardDescription>Set goals and track your progress toward better credit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Active Goals */}
              <div className="space-y-4">
                <h4 className="font-semibold">Active Goals</h4>

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        <h5 className="font-semibold">Keep Utilization Below 30%</h5>
                      </div>
                      <Badge variant="secondary">3 months</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Maintain credit utilization below 30% for 3 consecutive months
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current: {overallUtilization.toFixed(1)}%</span>
                        <span>Target: &lt;30%</span>
                      </div>
                      <Progress
                        value={overallUtilization > 30 ? 100 : (overallUtilization / 30) * 100}
                        className="h-2"
                      />
                    </div>
                    {overallUtilization <= 30 && (
                      <div className="mt-3 text-sm text-green-600 font-medium">
                        ✓ Goal achieved! Keep it up for 3 months to complete the challenge.
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <h5 className="font-semibold">Perfect Payment Streak</h5>
                      </div>
                      <Badge variant="secondary">6 months</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Make all credit card payments on time for 6 consecutive months
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current streak: 2 months</span>
                        <span>Target: 6 months</span>
                      </div>
                      <Progress value={(2 / 6) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <h5 className="font-semibold">Credit Score Improvement</h5>
                      </div>
                      <Badge variant="secondary">50 points</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Improve your credit score by 50 points through good habits
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Starting: 600</span>
                        <span>Current: {currentScore}</span>
                        <span>Target: 650</span>
                      </div>
                      <Progress value={((currentScore - 600) / 50) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Completed Challenges */}
              <div className="space-y-4">
                <h4 className="font-semibold">Completed Challenges</h4>

                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h5 className="font-semibold">Credit Education Graduate</h5>
                      </div>
                      <Badge className="bg-green-600">+50 pts</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Completed all credit education lessons</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
