"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Trophy,
  Star,
  Calculator,
  PlayCircle,
  PiggyBank,
  Target,
  BookOpen,
  Zap,
  Crown,
  Award,
  TrendingUp,
  Shield,
  Flame,
  Users,
  Gift,
  CreditCard,
  Percent,
  Lock,
  Unlock,
} from "lucide-react"

interface AchievementsPageProps {
  onBack: () => void
  achievements: any[]
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: any
  category: "calculator" | "learning" | "streak" | "milestone" | "special"
  earned: boolean
  progress?: number
  maxProgress?: number
  points: number
  rarity: "common" | "rare" | "epic" | "legendary"
  incentive?: {
    type: "discount" | "feature_unlock" | "premium_access" | "cash_reward" | "badge"
    value: string
    description: string
    claimed?: boolean
  }
}

const allAchievements: Achievement[] = [
  // Calculator Achievements
  {
    id: "first-calculation",
    name: "First Calculator",
    description: "Used any calculator for the first time",
    icon: Calculator,
    category: "calculator",
    earned: true,
    points: 10,
    rarity: "common",
    incentive: {
      type: "feature_unlock",
      value: "Advanced Calculator Features",
      description: "Unlock advanced comparison tools and scenario planning",
    },
  },
  {
    id: "compound-master",
    name: "Compound Interest Master",
    description: "Used the compound interest calculator 10 times",
    icon: TrendingUp,
    category: "calculator",
    earned: false,
    progress: 3,
    maxProgress: 10,
    points: 50,
    rarity: "rare",
    incentive: {
      type: "discount",
      value: "0.25% Interest Rate Reduction",
      description: "Get 0.25% off your next savings account interest rate for 6 months",
    },
  },
  {
    id: "loan-expert",
    name: "Loan Calculator Expert",
    description: "Calculated loan costs with different scenarios",
    icon: Target,
    category: "calculator",
    earned: false,
    progress: 1,
    maxProgress: 5,
    points: 30,
    rarity: "common",
    incentive: {
      type: "premium_access",
      value: "Free Loan Consultation",
      description: "Get a free 30-minute consultation with our loan specialists",
    },
  },

  // Learning Achievements
  {
    id: "video-watcher",
    name: "Video Watcher",
    description: "Watched your first educational video",
    icon: PlayCircle,
    category: "learning",
    earned: true,
    points: 15,
    rarity: "common",
    incentive: {
      type: "feature_unlock",
      value: "Premium Video Library",
      description: "Access to advanced financial planning video courses",
      claimed: true,
    },
  },
  {
    id: "quiz-master",
    name: "Quiz Master",
    description: "Answered 10 quiz questions correctly",
    icon: BookOpen,
    category: "learning",
    earned: false,
    progress: 2,
    maxProgress: 10,
    points: 75,
    rarity: "epic",
    incentive: {
      type: "cash_reward",
      value: "R50 Account Credit",
      description: "Receive R50 credited directly to your First Principles Bank account",
    },
  },
  {
    id: "knowledge-seeker",
    name: "Knowledge Seeker",
    description: "Completed all beginner video lessons",
    icon: Star,
    category: "learning",
    earned: false,
    progress: 1,
    maxProgress: 4,
    points: 100,
    rarity: "rare",
    incentive: {
      type: "discount",
      value: "Free Banking for 3 Months",
      description: "No monthly account fees for 3 months on your primary account",
    },
  },

  // Streak Achievements
  {
    id: "week-warrior",
    name: "Week Warrior",
    description: "Maintained a 7-day learning streak",
    icon: Flame,
    category: "streak",
    earned: true,
    points: 40,
    rarity: "rare",
    incentive: {
      type: "badge",
      value: "Digital Badge",
      description: "Special 'Dedicated Learner' badge on your banking profile",
      claimed: true,
    },
  },
  {
    id: "month-master",
    name: "Month Master",
    description: "Maintained a 30-day learning streak",
    icon: Crown,
    category: "streak",
    earned: false,
    progress: 7,
    maxProgress: 30,
    points: 200,
    rarity: "legendary",
    incentive: {
      type: "cash_reward",
      value: "R200 Bonus",
      description: "R200 cash bonus deposited into your savings account",
    },
  },

  // Milestone Achievements
  {
    id: "savings-hero",
    name: "Savings Hero",
    description: "Calculated potential savings over R10,000",
    icon: PiggyBank,
    category: "milestone",
    earned: true,
    points: 25,
    rarity: "common",
    incentive: {
      type: "discount",
      value: "Higher Savings Rate",
      description: "Qualify for our premium savings account with 1% higher interest rate",
    },
  },
  {
    id: "financial-guru",
    name: "Financial Guru",
    description: "Reached Level 5 in financial literacy",
    icon: Award,
    category: "milestone",
    earned: false,
    progress: 3,
    maxProgress: 5,
    points: 150,
    rarity: "epic",
    incentive: {
      type: "premium_access",
      value: "VIP Banking Status",
      description: "Upgrade to VIP banking with priority support and exclusive products",
    },
  },

  // Special Achievements
  {
    id: "early-adopter",
    name: "Early Adopter",
    description: "One of the first 100 users of the app",
    icon: Zap,
    category: "special",
    earned: true,
    points: 50,
    rarity: "rare",
    incentive: {
      type: "cash_reward",
      value: "R100 Welcome Bonus",
      description: "R100 welcome bonus for being an early supporter",
      claimed: true,
    },
  },
  {
    id: "community-helper",
    name: "Community Helper",
    description: "Shared financial knowledge with others",
    icon: Users,
    category: "special",
    earned: false,
    progress: 1,
    maxProgress: 5,
    points: 75,
    rarity: "epic",
    incentive: {
      type: "discount",
      value: "Referral Bonus Program",
      description: "Unlock enhanced referral bonuses - earn R50 for each successful referral",
    },
  },
]

export function AchievementsPage({ onBack }: AchievementsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [claimedIncentives, setClaimedIncentives] = useState<string[]>([
    "first-calculation",
    "video-watcher",
    "week-warrior",
    "early-adopter",
  ])

  const totalPoints = allAchievements.filter((a) => a.earned).reduce((sum, a) => sum + a.points, 0)
  const earnedCount = allAchievements.filter((a) => a.earned).length
  const totalCount = allAchievements.length
  const completionPercentage = (earnedCount / totalCount) * 100

  const claimIncentive = (achievementId: string) => {
    setClaimedIncentives((prev) => [...prev, achievementId])
    console.log(`[v0] Claimed incentive for achievement: ${achievementId}`)
  }

  const getIncentiveIcon = (type: string) => {
    switch (type) {
      case "discount":
        return Percent
      case "cash_reward":
        return CreditCard
      case "premium_access":
        return Crown
      case "feature_unlock":
        return Unlock
      case "badge":
        return Award
      default:
        return Gift
    }
  }

  const getIncentiveColor = (type: string) => {
    switch (type) {
      case "discount":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "cash_reward":
        return "text-green-600 bg-green-50 border-green-200"
      case "premium_access":
        return "text-purple-600 bg-purple-50 border-purple-200"
      case "feature_unlock":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "badge":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
      case "rare":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20"
      case "epic":
        return "bg-purple-500/10 text-purple-700 border-purple-500/20"
      case "legendary":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "calculator":
        return Calculator
      case "learning":
        return BookOpen
      case "streak":
        return Flame
      case "milestone":
        return Trophy
      case "special":
        return Star
      default:
        return Award
    }
  }

  const filteredAchievements =
    selectedCategory === "all" ? allAchievements : allAchievements.filter((a) => a.category === selectedCategory)

  const categories = [
    { id: "all", name: "All", count: allAchievements.length },
    { id: "calculator", name: "Calculator", count: allAchievements.filter((a) => a.category === "calculator").length },
    { id: "learning", name: "Learning", count: allAchievements.filter((a) => a.category === "learning").length },
    { id: "streak", name: "Streaks", count: allAchievements.filter((a) => a.category === "streak").length },
    { id: "milestone", name: "Milestones", count: allAchievements.filter((a) => a.category === "milestone").length },
    { id: "special", name: "Special", count: allAchievements.filter((a) => a.category === "special").length },
  ]

  const availableIncentives = allAchievements.filter(
    (a) => a.earned && a.incentive && !claimedIncentives.includes(a.id),
  )

  return (
    <PageLayout
      title="Your Achievements"
      description="Track your progress and unlock new badges as you learn"
      showBackButton
      onBack={onBack}
    >
      <div className="space-y-6">
        {availableIncentives.length > 0 && (
          <Alert className="border-green-500 bg-green-50">
            <Gift className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>
                  <strong>Congratulations!</strong> You have {availableIncentives.length} unclaimed reward
                  {availableIncentives.length > 1 ? "s" : ""} waiting for you.
                </span>
                <Button size="sm" variant="outline" className="ml-4 bg-transparent">
                  View Rewards
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{earnedCount}</div>
              <div className="text-sm text-muted-foreground">Achievements Earned</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{Math.round(completionPercentage)}%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-foreground">Overall Progress</h3>
              <span className="text-sm text-muted-foreground">
                {earnedCount} of {totalCount} achievements
              </span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </CardContent>
        </Card>

        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="rewards">Rewards & Incentives</TabsTrigger>
          </TabsList>

          <TabsContent value="rewards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  Your Rewards
                </CardTitle>
                <CardDescription>Claim your earned rewards and see what's coming next</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableIncentives.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-600">Available to Claim</h4>
                      {availableIncentives.map((achievement) => {
                        const IncentiveIcon = getIncentiveIcon(achievement.incentive!.type)
                        return (
                          <Card key={achievement.id} className="border-green-200 bg-green-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <IncentiveIcon className="w-5 h-5 text-green-600" />
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-green-800">{achievement.incentive!.value}</h5>
                                    <p className="text-sm text-green-600">{achievement.incentive!.description}</p>
                                    <p className="text-xs text-muted-foreground">From: {achievement.name}</p>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => claimIncentive(achievement.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Claim Reward
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-600">Claimed Rewards</h4>
                    {allAchievements
                      .filter((a) => a.earned && a.incentive && claimedIncentives.includes(a.id))
                      .map((achievement) => {
                        const IncentiveIcon = getIncentiveIcon(achievement.incentive!.type)
                        return (
                          <Card key={achievement.id} className="border-gray-200 bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <IncentiveIcon className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-semibold text-gray-800">{achievement.incentive!.value}</h5>
                                  <p className="text-sm text-gray-600">{achievement.incentive!.description}</p>
                                </div>
                                <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                                  Claimed
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-600">Upcoming Rewards</h4>
                    {allAchievements
                      .filter((a) => !a.earned && a.incentive)
                      .slice(0, 3)
                      .map((achievement) => {
                        const IncentiveIcon = getIncentiveIcon(achievement.incentive!.type)
                        return (
                          <Card key={achievement.id} className="border-blue-200 bg-blue-50">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Lock className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-semibold text-blue-800">{achievement.incentive!.value}</h5>
                                  <p className="text-sm text-blue-600">{achievement.incentive!.description}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Complete: {achievement.name}
                                    {achievement.progress &&
                                      achievement.maxProgress &&
                                      ` (${achievement.progress}/${achievement.maxProgress})`}
                                  </p>
                                </div>
                                <Badge variant="outline" className="border-blue-300 text-blue-700">
                                  Locked
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievement Categories</CardTitle>
                <CardDescription>Explore different types of achievements you can earn</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                    {categories.map((category) => {
                      const IconComponent = getCategoryIcon(category.id)
                      return (
                        <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          <span className="hidden sm:inline">{category.name}</span>
                          <Badge variant="secondary" className="ml-1 text-xs">
                            {category.count}
                          </Badge>
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>

                  <TabsContent value={selectedCategory} className="mt-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredAchievements.map((achievement) => (
                        <Card
                          key={achievement.id}
                          className={`transition-all hover:shadow-md ${
                            achievement.earned
                              ? "border-accent/30 bg-accent/5"
                              : "border-border hover:border-primary/50 opacity-75"
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                  achievement.earned ? "bg-accent/20" : "bg-muted/50"
                                }`}
                              >
                                <achievement.icon
                                  className={`w-6 h-6 ${achievement.earned ? "text-accent" : "text-muted-foreground"}`}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-sm text-foreground">{achievement.name}</h4>
                                  <Badge variant="outline" className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                                    {achievement.rarity}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                  {achievement.description}
                                </p>

                                {achievement.incentive && (
                                  <div
                                    className={`text-xs p-2 rounded border mb-2 ${getIncentiveColor(achievement.incentive.type)}`}
                                  >
                                    <div className="flex items-center gap-1">
                                      <Gift className="w-3 h-3" />
                                      <span className="font-medium">{achievement.incentive.value}</span>
                                    </div>
                                  </div>
                                )}

                                {!achievement.earned &&
                                  achievement.progress !== undefined &&
                                  achievement.maxProgress && (
                                    <div className="space-y-1 mb-2">
                                      <div className="flex justify-between text-xs">
                                        <span>Progress</span>
                                        <span>
                                          {achievement.progress}/{achievement.maxProgress}
                                        </span>
                                      </div>
                                      <Progress
                                        value={(achievement.progress / achievement.maxProgress) * 100}
                                        className="h-2"
                                      />
                                    </div>
                                  )}

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-accent" />
                                    <span className="text-xs font-medium">{achievement.points} pts</span>
                                  </div>
                                  {achievement.earned && (
                                    <Badge variant="secondary" className="bg-green-500/20 text-green-700 text-xs">
                                      Earned!
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Upcoming Challenges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Weekly Challenges
            </CardTitle>
            <CardDescription>Complete these challenges to earn bonus points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-3">
                  <Calculator className="w-6 h-6 text-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">Calculator Challenge</h4>
                    <p className="text-sm text-muted-foreground">Use both calculators this week</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1">
                    1/2 Complete
                  </Badge>
                  <div className="text-sm text-muted-foreground">+50 points</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-accent/5 rounded-lg border border-accent/20">
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-6 h-6 text-accent" />
                  <div>
                    <h4 className="font-medium text-foreground">Learning Streak</h4>
                    <p className="text-sm text-muted-foreground">Watch 3 videos this week</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1">
                    0/3 Complete
                  </Badge>
                  <div className="text-sm text-muted-foreground">+75 points</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-3">
                  <Flame className="w-6 h-6 text-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">Streak Master</h4>
                    <p className="text-sm text-muted-foreground">Maintain your daily streak</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1">
                    7/7 Days
                  </Badge>
                  <div className="text-sm text-green-600 font-medium">Complete!</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-accent" />
              Community Leaderboard
            </CardTitle>
            <CardDescription>See how you rank among other learners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-yellow-700">1</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Thabo M.</div>
                    <div className="text-sm text-muted-foreground">Level 8 • 1,250 points</div>
                  </div>
                </div>
                <Crown className="w-5 h-5 text-yellow-600" />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-500/10 rounded-lg border border-gray-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-500/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-700">2</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Nomsa K.</div>
                    <div className="text-sm text-muted-foreground">Level 6 • 980 points</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-700">3</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Sipho D.</div>
                    <div className="text-sm text-muted-foreground">Level 5 • 750 points</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">12</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">You</div>
                    <div className="text-sm text-muted-foreground">Level 3 • {totalPoints} points</div>
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View Full Leaderboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
