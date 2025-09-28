"use client"

import { useState, useEffect } from "react"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { AlertTriangle, Calculator, CreditCard, Lightbulb, Target, Star, DollarSign } from "lucide-react"

interface LoanCalculatorPageProps {
  onBack: () => void
}

export function LoanCalculatorPage({ onBack }: LoanCalculatorPageProps) {
  const [loanAmount, setLoanAmount] = useState([50000])
  const [interestRate, setInterestRate] = useState([12])
  const [loanTerm, setLoanTerm] = useState([24])
  const [extraPayment, setExtraPayment] = useState([0])
  const [missedPayments, setMissedPayments] = useState([0])
  const [showResults, setShowResults] = useState(false)
  const [gamificationPoints, setGamificationPoints] = useState(0)

  // Calculate loan details
  const calculateLoan = () => {
    const principal = loanAmount[0]
    const monthlyRate = interestRate[0] / 100 / 12
    const numPayments = loanTerm[0]

    // Basic monthly payment calculation
    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)

    const totalPaid = monthlyPayment * numPayments
    const totalInterest = totalPaid - principal

    // With extra payments
    const adjustedPayment = monthlyPayment + extraPayment[0]
    let remainingBalance = principal
    let adjustedTotalPaid = 0
    let adjustedMonths = 0

    while (remainingBalance > 0 && adjustedMonths < numPayments * 2) {
      const interestPayment = remainingBalance * monthlyRate
      const principalPayment = Math.min(adjustedPayment - interestPayment, remainingBalance)
      remainingBalance -= principalPayment
      adjustedTotalPaid += interestPayment + principalPayment
      adjustedMonths++

      if (remainingBalance <= 0) break
    }

    // With missed payments (simplified - adds penalty interest)
    const penaltyRate = 0.02 // 2% penalty per missed payment
    const missedPenalty = principal * penaltyRate * missedPayments[0]
    const totalWithMissed = totalPaid + missedPenalty

    return {
      monthlyPayment,
      totalPaid,
      totalInterest,
      adjustedTotalPaid,
      adjustedMonths,
      savings: totalPaid - adjustedTotalPaid,
      missedPenalty,
      totalWithMissed,
      principal,
    }
  }

  // Generate payment schedule data
  const generatePaymentSchedule = () => {
    const principal = loanAmount[0]
    const monthlyRate = interestRate[0] / 100 / 12
    const monthlyPayment = calculateLoan().monthlyPayment

    const schedule = []
    let remainingBalance = principal

    for (let month = 1; month <= Math.min(loanTerm[0], 60); month++) {
      const interestPayment = remainingBalance * monthlyRate
      const principalPayment = monthlyPayment - interestPayment
      remainingBalance -= principalPayment

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(remainingBalance, 0),
      })

      if (remainingBalance <= 0) break
    }

    return schedule
  }

  const results = calculateLoan()
  const paymentSchedule = generatePaymentSchedule()

  // Gamification: Award points for using calculator
  useEffect(() => {
    if (showResults) {
      setGamificationPoints((prev) => prev + 15)
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

  const getDebtWarning = () => {
    const debtToIncomeRatio = (results.monthlyPayment / 5000) * 100 // Assuming R5000 monthly income
    if (debtToIncomeRatio > 40) {
      return {
        level: "high",
        message: "This loan payment is very high compared to typical income. Consider a smaller loan or longer term.",
      }
    } else if (debtToIncomeRatio > 25) {
      return {
        level: "medium",
        message: "This loan payment is manageable but will take a significant portion of your income.",
      }
    } else {
      return { level: "low", message: "This loan payment appears manageable for most budgets." }
    }
  }

  const pieData = [
    { name: "Principal", value: results.principal, color: "hsl(var(--primary))" },
    { name: "Interest", value: results.totalInterest, color: "hsl(var(--destructive))" },
  ]

  return (
    <PageLayout
      title="Loan Calculator"
      description="Understand your loan payments and the true cost of borrowing"
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
                  <p className="font-semibold text-foreground">Smart financial planning!</p>
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
                Loan Details
              </CardTitle>
              <CardDescription>Enter your loan information to see the real cost</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Loan Amount */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">How much do you want to borrow?</label>
                  <Badge variant="secondary">{formatCurrency(loanAmount[0])}</Badge>
                </div>
                <Slider
                  value={loanAmount}
                  onValueChange={setLoanAmount}
                  max={500000}
                  min={1000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>R1,000</span>
                  <span>R500,000</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Interest rate per year</label>
                  <Badge variant="secondary">{interestRate[0]}%</Badge>
                </div>
                <Slider
                  value={interestRate}
                  onValueChange={setInterestRate}
                  max={30}
                  min={5}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5%</span>
                  <span>30%</span>
                </div>
              </div>

              {/* Loan Term */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">How many months to pay back?</label>
                  <Badge variant="secondary">{loanTerm[0]} months</Badge>
                </div>
                <Slider value={loanTerm} onValueChange={setLoanTerm} max={72} min={6} step={6} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>6 months</span>
                  <span>72 months</span>
                </div>
              </div>

              {/* Extra Payment */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Extra payment per month (optional)</label>
                  <Badge variant="outline">{formatCurrency(extraPayment[0])}</Badge>
                </div>
                <Slider
                  value={extraPayment}
                  onValueChange={setExtraPayment}
                  max={2000}
                  min={0}
                  step={50}
                  className="w-full"
                />
              </div>

              {/* Missed Payments */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Missed payments (see the penalty)</label>
                  <Badge variant="destructive">{missedPayments[0]} payments</Badge>
                </div>
                <Slider
                  value={missedPayments}
                  onValueChange={setMissedPayments}
                  max={12}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <Button onClick={() => setShowResults(true)} className="w-full" size="lg">
                <CreditCard className="w-4 h-4 mr-2" />
                Calculate Loan Cost
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-destructive" />
                The True Cost of Your Loan
              </CardTitle>
              <CardDescription>See exactly what this loan will cost you</CardDescription>
            </CardHeader>
            <CardContent>
              {showResults ? (
                <div className="space-y-6">
                  {/* Key Results */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-1">Monthly Payment</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(results.monthlyPayment)}</p>
                    </div>
                    <div className="text-center p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                      <p className="text-sm text-muted-foreground mb-1">Total Interest</p>
                      <p className="text-2xl font-bold text-destructive">{formatCurrency(results.totalInterest)}</p>
                    </div>
                  </div>

                  {/* Debt Warning */}
                  <Alert
                    className={`${
                      getDebtWarning().level === "high"
                        ? "border-destructive/50 bg-destructive/5"
                        : getDebtWarning().level === "medium"
                          ? "border-yellow-500/50 bg-yellow-500/5"
                          : "border-green-500/50 bg-green-500/5"
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{getDebtWarning().message}</AlertDescription>
                  </Alert>

                  {/* Total Cost Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Loan Amount</span>
                      <span className="font-medium">{formatCurrency(results.principal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Interest</span>
                      <span className="font-medium text-destructive">+{formatCurrency(results.totalInterest)}</span>
                    </div>
                    {missedPayments[0] > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Missed Payment Penalty</span>
                        <span className="font-medium text-destructive">+{formatCurrency(results.missedPenalty)}</span>
                      </div>
                    )}
                    <hr />
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total You'll Pay</span>
                      <span className="text-destructive">
                        {formatCurrency(missedPayments[0] > 0 ? results.totalWithMissed : results.totalPaid)}
                      </span>
                    </div>
                  </div>

                  {/* Extra Payment Benefits */}
                  {extraPayment[0] > 0 && (
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <h4 className="font-semibold text-green-700 mb-2">Great Choice! Extra Payments Help</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          You'll save:{" "}
                          <span className="font-bold text-green-600">{formatCurrency(results.savings)}</span>
                        </p>
                        <p>
                          Loan paid off in: <span className="font-bold">{results.adjustedMonths} months</span> instead
                          of {loanTerm[0]}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Enter your loan details and click calculate to see the costs!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        {showResults && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Payment Breakdown Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Where Your Money Goes</CardTitle>
                <CardDescription>See how much goes to interest vs. the actual loan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-sm">
                      Principal ({Math.round((results.principal / results.totalPaid) * 100)}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <span className="text-sm">
                      Interest ({Math.round((results.totalInterest / results.totalPaid) * 100)}%)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Loan Balance Over Time</CardTitle>
                <CardDescription>Watch how your debt decreases with each payment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={paymentSchedule}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`} />
                      <Tooltip
                        formatter={(value: any, name: string) => [formatCurrency(value), name]}
                        labelFormatter={(label) => `Month ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="balance"
                        stroke="hsl(var(--destructive))"
                        strokeWidth={3}
                        name="Remaining Balance"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Educational Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              Smart Borrowing Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                <h4 className="font-semibold text-green-700 mb-2">Do This</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Compare interest rates from different lenders</li>
                  <li>• Make extra payments when possible</li>
                  <li>• Choose the shortest term you can afford</li>
                  <li>• Read all loan terms carefully</li>
                </ul>
              </div>
              <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                <h4 className="font-semibold text-destructive mb-2">Avoid This</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Missing payments (expensive penalties!)</li>
                  <li>• Borrowing more than you need</li>
                  <li>• Ignoring the total cost of the loan</li>
                  <li>• Taking loans for wants vs. needs</li>
                </ul>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-foreground mb-2">Interest Rate Impact</h4>
                <p className="text-sm text-muted-foreground">
                  A 2% difference in interest rate can cost you thousands over the life of a loan. Always shop around!
                </p>
              </div>
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <h4 className="font-semibold text-foreground mb-2">Emergency Fund First</h4>
                <p className="text-sm text-muted-foreground">
                  Before taking a loan, try to save an emergency fund. This prevents you from needing expensive credit
                  later.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
