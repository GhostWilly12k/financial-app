"use client"

import { useState } from "react"
import { GamificationProvider } from "@/components/gamification-provider"
import { Navigation } from "@/components/navigation"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calculator, PlayCircle, Trophy, Target, BookOpen, PiggyBank, Star } from "lucide-react"

// Import placeholder components for different pages
import { CompoundCalculatorPage } from "@/components/pages/compound-calculator"
import { LoanCalculatorPage } from "@/components/pages/loan-calculator"
import { VideosPage } from "@/components/pages/videos"
import { AchievementsPage } from "@/components/pages/achievements"
import { SpendingAnalyzer } from "@/components/pages/spending-analyzer"
import { DebtDashboard } from "@/components/pages/debt-dashboard"
import { CreditTools } from "@/components/pages/credit-tools"

function FinancialLiteracyAppContent() {
  const [currentPage, setCurrentPage] = useState("home")
  const [userProgress, setUserProgress] = useState(65)
  const [userLevel, setUserLevel] = useState(3)
  const [streakDays, setStreakDays] = useState(7)

  const achievements = [
    { name: "First Calculator", icon: Calculator, earned: true },
    { name: "Video Watcher", icon: PlayCircle, earned: true },
    { name: "Quiz Master", icon: Trophy, earned: false },
    { name: "Savings Hero", icon: PiggyBank, earned: true },
  ]

  const handlePointsEarned = (points: number) => {
    // This would integrate with the gamification system
    console.log(`[v0] User earned ${points} points`)
  }

  const renderPage = () => {
    switch (currentPage) {
      case "compound-calculator":
        return <CompoundCalculatorPage onBack={() => setCurrentPage("home")} />
      case "loan-calculator":
        return <LoanCalculatorPage onBack={() => setCurrentPage("home")} />
      case "videos":
        return <VideosPage onBack={() => setCurrentPage("home")} />
      case "achievements":
        return <AchievementsPage onBack={() => setCurrentPage("home")} achievements={achievements} />
      case "spending-analyzer":
        return (
          <PageLayout>
            <SpendingAnalyzer onPointsEarned={handlePointsEarned} />
          </PageLayout>
        )
      case "debt-dashboard":
        return (
          <PageLayout>
            <DebtDashboard onPointsEarned={handlePointsEarned} />
          </PageLayout>
        )
      case "credit-tools":
        return (
          <PageLayout>
            <CreditTools onPointsEarned={handlePointsEarned} />
          </PageLayout>
        )
      default:
        return <HomePage onPageChange={setCurrentPage} userProgress={userProgress} achievements={achievements} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        userLevel={userLevel}
        streakDays={streakDays}
      />
      {renderPage()}
    </div>
  )
}

export default function FinancialLiteracyApp() {
  return (
    <GamificationProvider>
      <FinancialLiteracyAppContent />
    </GamificationProvider>
  )
}

function HomePage({ onPageChange, userProgress, achievements }: any) {
  return (
    <PageLayout>
      {/* Welcome Section with Gamification */}
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back, Learner!</h2>
                <p className="text-muted-foreground">Continue your journey to financial freedom</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-accent" />
                  <span className="font-bold text-lg">Level 3</span>
                </div>
                <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                  7 day streak!
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Level 4</span>
                <span>{userProgress}%</span>
              </div>
              <Progress value={userProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Compound Interest Calculator */}
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => onPageChange("compound-calculator")}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Calculator className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Compound Interest Calculator</CardTitle>
                <CardDescription>See your money grow over time</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Discover how small savings can become big money with the power of compound interest!
            </p>
            <Button className="w-full">Start Calculating</Button>
          </CardContent>
        </Card>

        {/* Loan Calculator */}
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => onPageChange("loan-calculator")}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">Loan Calculator</CardTitle>
                <CardDescription>Understand your loan payments</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Learn how loans work and see the real cost of borrowing money.
            </p>
            <Button variant="secondary" className="w-full">
              Calculate Loans
            </Button>
          </CardContent>
        </Card>

        {/* Educational Videos */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => onPageChange("videos")}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <PlayCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Video Lessons</CardTitle>
                <CardDescription>Learn with easy explanations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Watch short videos that explain financial concepts in simple terms.
            </p>
            <Button variant="outline" className="w-full bg-transparent">
              Watch Videos
            </Button>
          </CardContent>
        </Card>

        {/* Spending Analyzer */}
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => onPageChange("spending-analyzer")}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">Spending Analyzer</CardTitle>
                <CardDescription>Analyze your spending habits</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Understand where your money goes and identify areas for savings.
            </p>
            <Button variant="secondary" className="w-full">
              Analyze Spending
            </Button>
          </CardContent>
        </Card>

        {/* Debt Dashboard */}
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => onPageChange("debt-dashboard")}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <PiggyBank className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Debt Dashboard</CardTitle>
                <CardDescription>Manage your debts effectively</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Get a comprehensive view of your debts and plan your repayment strategy.
            </p>
            <Button variant="outline" className="w-full bg-transparent">
              View Debt Dashboard
            </Button>
          </CardContent>
        </Card>

        {/* Credit Tools */}
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => onPageChange("credit-tools")}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Credit Tools</CardTitle>
                <CardDescription>Build and monitor your credit score</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Learn about credit scores, track utilization, and set goals for credit improvement.
            </p>
            <Button variant="outline" className="w-full bg-transparent">
              Manage Credit
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Section */}
      <Card className="mb-8" onClick={() => onPageChange("achievements")}>
        <CardHeader className="cursor-pointer">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" />
            Your Achievements
          </CardTitle>
          <CardDescription>Unlock badges as you learn and grow your financial knowledge</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border text-center transition-all ${
                  achievement.earned
                    ? "bg-accent/10 border-accent/30 text-accent-foreground"
                    : "bg-muted/50 border-border text-muted-foreground"
                }`}
              >
                <achievement.icon
                  className={`w-8 h-8 mx-auto mb-2 ${achievement.earned ? "text-accent" : "text-muted-foreground"}`}
                />
                <p className="text-sm font-medium">{achievement.name}</p>
                {achievement.earned && (
                  <Badge variant="secondary" className="mt-2 bg-accent/20">
                    Earned!
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Today's Financial Tip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-foreground font-medium mb-2">Did you know?</p>
            <p className="text-muted-foreground">
              If you save just R100 per month with 8% annual interest, you'll have over R15,000 after 10 years! That's
              R3,000 more than what you put in, thanks to compound interest.
            </p>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
