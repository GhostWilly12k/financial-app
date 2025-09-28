"use client"

import { useState, useEffect } from "react"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { TrendingUp, PiggyBank, Calculator, Lightbulb, Target, Star } from "lucide-react"

interface CompoundCalculatorPageProps {
  onBack: () => void
}

export function CompoundCalculatorPage({ onBack }: CompoundCalculatorPageProps) {
  const [principal, setPrincipal] = useState([1000])
  const [rate, setRate] = useState([8])
  const [years, setYears] = useState([10])
  const [compoundFrequency, setCompoundFrequency] = useState("annually")
  const [showResults, setShowResults] = useState(false)
  const [gamificationPoints, setGamificationPoints] = useState(0)

  // Calculate compound interest
  const calculateCompoundInterest = () => {
    const p = principal[0]
    const r = rate[0] / 100
    const t = years[0]
    const n = compoundFrequency === "monthly" ? 12 : 1

    const amount = p * Math.pow(1 + r / n, n * t)
    const interest = amount - p
    return { amount, interest, principal: p }
  }

  // Generate chart data
  const generateChartData = () => {
    const data = []
    const p = principal[0]
    const r = rate[0] / 100
    const n = compoundFrequency === "monthly" ? 12 : 1

    for (let year = 0; year <= years[0]; year++) {
      const amount = p * Math.pow(1 + r / n, n * year)
      const interest = amount - p
      data.push({
        year,
        amount: Math.round(amount),
        principal: p,
        interest: Math.round(interest),
      })
    }
    return data
  }

  const results = calculateCompoundInterest()
  const chartData = generateChartData()

  // Gamification: Award points for using calculator
  useEffect(() => {
    if (showResults) {
      setGamificationPoints((prev) => prev + 10)
    }
  }, [showResults])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getMotivationalMessage = () => {
    const interestEarned = results.interest
    if (interestEarned > results.principal) {
      return "Amazing! Your money more than doubled through compound interest!"
    } else if (interestEarned > results.principal * 0.5) {
      return "Great job! You earned more than half your initial investment in interest!"
    } else if (interestEarned > results.principal * 0.25) {
      return "Good progress! Your money is growing steadily with compound interest."
    } else {
      return "Every rand counts! Even small amounts grow over time."
    }
  }

  return (
    <PageLayout
      title="Compound Interest Calculator"
      description="See how your savings can grow over time with the power of compound interest"
      showBackButton
      onBack={onBack}
    >
      <div className="space-y-6">
        {/* Gamification Header */}
        {gamificationPoints > 0 && (
          <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Great job exploring!</p>
                  <p className="text-sm text-muted-foreground">You've earned {gamificationPoints} learning points!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Calculator Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Your Savings Plan
              </CardTitle>
              <CardDescription>Adjust the sliders to see how your money can grow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Principal Amount */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">How much will you save?</label>
                  <Badge variant="secondary">{formatCurrency(principal[0])}</Badge>
                </div>
                <Slider
                  value={principal}
                  onValueChange={setPrincipal}
                  max={100000}
                  min={100}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>R100</span>
                  <span>R100,000</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Interest rate per year</label>
                  <Badge variant="secondary">{rate[0]}%</Badge>
                </div>
                <Slider value={rate} onValueChange={setRate} max={20} min={1} step={0.5} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1%</span>
                  <span>20%</span>
                </div>
              </div>

              {/* Time Period */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">How many years?</label>
                  <Badge variant="secondary">{years[0]} years</Badge>
                </div>
                <Slider value={years} onValueChange={setYears} max={30} min={1} step={1} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 year</span>
                  <span>30 years</span>
                </div>
              </div>

              {/* Compound Frequency */}
              <div className="space-y-3">
                <label className="text-sm font-medium">How often does interest compound?</label>
                <Select value={compoundFrequency} onValueChange={setCompoundFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annually">Once per year (Annual)</SelectItem>
                    <SelectItem value="monthly">Every month (Monthly)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={() => setShowResults(true)} className="w-full" size="lg">
                <TrendingUp className="w-4 h-4 mr-2" />
                Calculate My Growth!
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-accent" />
                Your Money Will Grow To
              </CardTitle>
              <CardDescription>See the power of compound interest in action</CardDescription>
            </CardHeader>
            <CardContent>
              {showResults ? (
                <div className="space-y-6">
                  {/* Key Results */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(results.amount)}</p>
                    </div>
                    <div className="text-center p-4 bg-accent/5 rounded-lg border border-accent/20">
                      <p className="text-sm text-muted-foreground mb-1">Interest Earned</p>
                      <p className="text-2xl font-bold text-accent">{formatCurrency(results.interest)}</p>
                    </div>
                  </div>

                  {/* Motivational Message */}
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground mb-1">Amazing Result!</p>
                        <p className="text-sm text-muted-foreground">{getMotivationalMessage()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Visualization */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Your money vs. interest earned</span>
                      <span>{Math.round((results.interest / results.amount) * 100)}% is interest!</span>
                    </div>
                    <Progress value={(results.interest / results.amount) * 100} className="h-3" />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Adjust your savings plan and click calculate to see results!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        {showResults && (
          <Card>
            <CardHeader>
              <CardTitle>Watch Your Money Grow Over Time</CardTitle>
              <CardDescription>See how compound interest accelerates your savings growth</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="line" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="line">Growth Over Time</TabsTrigger>
                  <TabsTrigger value="breakdown">Money Breakdown</TabsTrigger>
                </TabsList>

                <TabsContent value="line" className="space-y-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`} />
                        <Tooltip
                          formatter={(value: any, name: string) => [formatCurrency(value), name]}
                          labelFormatter={(label) => `Year ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                          name="Total Amount"
                        />
                        <Line
                          type="monotone"
                          dataKey="principal"
                          stroke="hsl(var(--muted-foreground))"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Your Savings"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="breakdown" className="space-y-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[{ name: "Final Result", principal: results.principal, interest: results.interest }]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(value: any, name: string) => [formatCurrency(value), name]} />
                        <Bar dataKey="principal" stackId="a" fill="hsl(var(--muted-foreground))" name="Your Savings" />
                        <Bar dataKey="interest" stackId="a" fill="hsl(var(--accent))" name="Interest Earned" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Educational Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              Learn More About Compound Interest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-foreground mb-2">What is Compound Interest?</h4>
                <p className="text-sm text-muted-foreground">
                  Compound interest is when you earn interest on both your original money AND the interest you've
                  already earned. It's like your money making more money!
                </p>
              </div>
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <h4 className="font-semibold text-foreground mb-2">Why Start Early?</h4>
                <p className="text-sm text-muted-foreground">
                  Time is your best friend with compound interest. The earlier you start saving, the more time your
                  money has to grow and multiply.
                </p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-foreground mb-2">Monthly vs Annual</h4>
                <p className="text-sm text-muted-foreground">
                  Monthly compounding means your interest is calculated and added 12 times per year, which helps your
                  money grow faster than annual compounding.
                </p>
              </div>
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <h4 className="font-semibold text-foreground mb-2">Small Amounts Matter</h4>
                <p className="text-sm text-muted-foreground">
                  Even saving R50 per month can grow into thousands over time. Don't wait until you have a lot of money
                  to start!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
