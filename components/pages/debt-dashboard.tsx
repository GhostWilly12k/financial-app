"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, AlertTriangle, TrendingDown, Calendar, DollarSign, Plus, Trash2, Target, Zap } from "lucide-react"

interface Debt {
  id: string
  name: string
  type: "credit_card" | "personal_loan" | "store_card" | "home_loan" | "car_loan"
  balance: number
  interestRate: number
  minimumPayment: number
  monthlyPayment: number
}

interface DebtDashboardProps {
  onPointsEarned: (points: number) => void
}

export function DebtDashboard({ onPointsEarned }: DebtDashboardProps) {
  const [debts, setDebts] = useState<Debt[]>([
    {
      id: "1",
      name: "Credit Card",
      type: "credit_card",
      balance: 15000,
      interestRate: 21,
      minimumPayment: 450,
      monthlyPayment: 450,
    },
    {
      id: "2",
      name: "Store Card",
      type: "store_card",
      balance: 8500,
      interestRate: 24,
      minimumPayment: 255,
      monthlyPayment: 255,
    },
    {
      id: "3",
      name: "Personal Loan",
      type: "personal_loan",
      balance: 25000,
      interestRate: 18,
      minimumPayment: 850,
      monthlyPayment: 850,
    },
  ])

  const [newDebt, setNewDebt] = useState({
    name: "",
    type: "credit_card" as const,
    balance: "",
    interestRate: "",
    minimumPayment: "",
  })

  const [monthlyIncome, setMonthlyIncome] = useState(15000)
  const [strategy, setStrategy] = useState<"snowball" | "avalanche">("avalanche")

  // Calculate debt metrics
  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0)
  const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0)
  const totalMonthlyPayments = debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)
  const monthlyInterest = debts.reduce((sum, debt) => sum + (debt.balance * debt.interestRate) / 100 / 12, 0)
  const debtServiceRatio = (totalMonthlyPayments / monthlyIncome) * 100

  // Calculate payoff timeline for each debt
  const calculatePayoffTime = (debt: Debt) => {
    const monthlyRate = debt.interestRate / 100 / 12
    const payment = debt.monthlyPayment

    if (payment <= debt.balance * monthlyRate) {
      return { months: Number.POSITIVE_INFINITY, totalPaid: Number.POSITIVE_INFINITY }
    }

    const months = Math.ceil(-Math.log(1 - (debt.balance * monthlyRate) / payment) / Math.log(1 + monthlyRate))
    const totalPaid = months * payment

    return { months, totalPaid }
  }

  // Debt repayment strategies
  const getDebtOrder = () => {
    if (strategy === "snowball") {
      return [...debts].sort((a, b) => a.balance - b.balance)
    } else {
      return [...debts].sort((a, b) => b.interestRate - a.interestRate)
    }
  }

  const addDebt = () => {
    if (newDebt.name && newDebt.balance && newDebt.interestRate && newDebt.minimumPayment) {
      const debt: Debt = {
        id: Date.now().toString(),
        name: newDebt.name,
        type: newDebt.type,
        balance: Number.parseFloat(newDebt.balance),
        interestRate: Number.parseFloat(newDebt.interestRate),
        minimumPayment: Number.parseFloat(newDebt.minimumPayment),
        monthlyPayment: Number.parseFloat(newDebt.minimumPayment),
      }
      setDebts([...debts, debt])
      setNewDebt({ name: "", type: "credit_card", balance: "", interestRate: "", minimumPayment: "" })
      onPointsEarned(10) // Points for tracking debt
    }
  }

  const removeDebt = (id: string) => {
    setDebts(debts.filter((d) => d.id !== id))
  }

  const updateDebtPayment = (id: string, payment: number) => {
    setDebts(debts.map((debt) => (debt.id === id ? { ...debt, monthlyPayment: payment } : debt)))
  }

  const debtTypes = [
    { value: "credit_card", label: "Credit Card" },
    { value: "store_card", label: "Store Card" },
    { value: "personal_loan", label: "Personal Loan" },
    { value: "car_loan", label: "Car Loan" },
    { value: "home_loan", label: "Home Loan" },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Debt Management Dashboard</h1>
        <p className="text-muted-foreground">Take control of your debt and plan your path to freedom</p>
      </div>

      {/* Debt Health Alert */}
      {debtServiceRatio > 40 && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> Your debt payments are {debtServiceRatio.toFixed(1)}% of your income. This is
            above the recommended 40% limit and may be unsustainable. Consider debt counseling or consolidation.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="manage">Manage Debts</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="simulator">Simulator</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Income Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Monthly Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Label htmlFor="income">Your monthly income (R)</Label>
                <Input
                  id="income"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number.parseFloat(e.target.value) || 0)}
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>

          {/* Debt Summary Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Debt</p>
                    <p className="text-2xl font-bold text-red-600">R{totalDebt.toLocaleString()}</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Monthly Interest</p>
                    <p className="text-2xl font-bold text-orange-600">R{monthlyInterest.toFixed(0)}</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Monthly Payments</p>
                    <p className="text-2xl font-bold">R{totalMonthlyPayments.toLocaleString()}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Debt Ratio</p>
                    <p
                      className={`text-2xl font-bold ${debtServiceRatio > 40 ? "text-red-600" : debtServiceRatio > 30 ? "text-orange-600" : "text-green-600"}`}
                    >
                      {debtServiceRatio.toFixed(1)}%
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Debt List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Debts</CardTitle>
              <CardDescription>Current debt balances and payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {debts.map((debt) => {
                  const payoff = calculatePayoffTime(debt)
                  const progressPercent = Math.max(
                    0,
                    100 - (debt.balance / (debt.balance + (payoff.totalPaid - debt.balance))) * 100,
                  )

                  return (
                    <div key={debt.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{debt.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {debt.type.replace("_", " ")} • {debt.interestRate}% interest
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">R{debt.balance.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">R{debt.monthlyPayment}/month</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Payoff Progress</span>
                          <span>
                            {payoff.months === Number.POSITIVE_INFINITY ? "Never" : `${payoff.months} months`}
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>

                      {payoff.months === Number.POSITIVE_INFINITY && (
                        <Alert className="border-red-500">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            Your payment only covers interest! Increase payment to make progress.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Debt</CardTitle>
              <CardDescription>Track all your debts to get a complete picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="debt-name">Debt Name</Label>
                  <Input
                    id="debt-name"
                    value={newDebt.name}
                    onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                    placeholder="e.g., Visa Credit Card"
                  />
                </div>
                <div>
                  <Label htmlFor="debt-type">Type</Label>
                  <select
                    id="debt-type"
                    value={newDebt.type}
                    onChange={(e) => setNewDebt({ ...newDebt, type: e.target.value as any })}
                    className="w-full p-2 border rounded-md"
                  >
                    {debtTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="debt-balance">Current Balance (R)</Label>
                  <Input
                    id="debt-balance"
                    type="number"
                    value={newDebt.balance}
                    onChange={(e) => setNewDebt({ ...newDebt, balance: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="debt-rate">Interest Rate (%)</Label>
                  <Input
                    id="debt-rate"
                    type="number"
                    value={newDebt.interestRate}
                    onChange={(e) => setNewDebt({ ...newDebt, interestRate: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="debt-minimum">Minimum Payment (R)</Label>
                  <Input
                    id="debt-minimum"
                    type="number"
                    value={newDebt.minimumPayment}
                    onChange={(e) => setNewDebt({ ...newDebt, minimumPayment: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <Button onClick={addDebt} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Debt
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Payments</CardTitle>
              <CardDescription>Adjust your monthly payments to see the impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {debts.map((debt) => (
                  <div key={debt.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{debt.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Balance: R{debt.balance.toLocaleString()} • Min: R{debt.minimumPayment}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`payment-${debt.id}`} className="text-sm">
                        Monthly Payment:
                      </Label>
                      <Input
                        id={`payment-${debt.id}`}
                        type="number"
                        value={debt.monthlyPayment}
                        onChange={(e) => updateDebtPayment(debt.id, Number.parseFloat(e.target.value) || 0)}
                        className="w-24"
                        min={debt.minimumPayment}
                      />
                      <Button variant="ghost" size="sm" onClick={() => removeDebt(debt.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Debt Repayment Strategies</CardTitle>
              <CardDescription>Choose the best approach for your situation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card
                  className={`cursor-pointer transition-all ${strategy === "snowball" ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setStrategy("snowball")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-blue-500" />
                      <h4 className="font-semibold">Debt Snowball</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Pay minimum on all debts, then put extra money toward the smallest balance first.
                    </p>
                    <div className="space-y-1 text-sm">
                      <div className="font-medium text-green-600">✓ Builds momentum and motivation</div>
                      <div className="font-medium text-green-600">✓ Quick wins boost confidence</div>
                      <div className="text-muted-foreground">• May cost more in interest</div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all ${strategy === "avalanche" ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setStrategy("avalanche")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-green-500" />
                      <h4 className="font-semibold">Debt Avalanche</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Pay minimum on all debts, then put extra money toward the highest interest rate first.
                    </p>
                    <div className="space-y-1 text-sm">
                      <div className="font-medium text-green-600">✓ Saves the most money</div>
                      <div className="font-medium text-green-600">✓ Mathematically optimal</div>
                      <div className="text-muted-foreground">• May take longer to see progress</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>
                    Recommended Payment Order ({strategy === "snowball" ? "Snowball" : "Avalanche"})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getDebtOrder().map((debt, index) => (
                      <div key={debt.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{debt.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            R{debt.balance.toLocaleString()} at {debt.interestRate}% interest
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">R{debt.monthlyPayment}</p>
                          <p className="text-sm text-muted-foreground">per month</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Extra Payment Simulator</CardTitle>
              <CardDescription>See how extra payments can accelerate your debt freedom</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {debts.map((debt) => {
                  const currentPayoff = calculatePayoffTime(debt)
                  const extraPayment100 = calculatePayoffTime({ ...debt, monthlyPayment: debt.monthlyPayment + 100 })
                  const extraPayment500 = calculatePayoffTime({ ...debt, monthlyPayment: debt.monthlyPayment + 500 })

                  return (
                    <div key={debt.id} className="p-4 border rounded-lg space-y-4">
                      <h4 className="font-semibold">{debt.name}</h4>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-gray-800">Current Payment</h5>
                          <div className="text-sm space-y-1 mt-2">
                            <div>
                              Payment: <span className="font-bold">R{debt.monthlyPayment}</span>
                            </div>
                            <div>
                              Time:{" "}
                              <span className="font-bold">
                                {currentPayoff.months === Number.POSITIVE_INFINITY
                                  ? "Never"
                                  : `${currentPayoff.months} months`}
                              </span>
                            </div>
                            <div>
                              Total:{" "}
                              <span className="font-bold">
                                R
                                {currentPayoff.totalPaid === Number.POSITIVE_INFINITY
                                  ? "∞"
                                  : currentPayoff.totalPaid.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h5 className="font-medium text-blue-800">+R100 Extra</h5>
                          <div className="text-sm space-y-1 mt-2">
                            <div>
                              Payment: <span className="font-bold">R{debt.monthlyPayment + 100}</span>
                            </div>
                            <div>
                              Time: <span className="font-bold text-blue-600">{extraPayment100.months} months</span>
                            </div>
                            <div>
                              Total:{" "}
                              <span className="font-bold text-blue-600">
                                R{extraPayment100.totalPaid.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-green-600 font-medium">
                              Save: R{(currentPayoff.totalPaid - extraPayment100.totalPaid).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-green-50 rounded-lg">
                          <h5 className="font-medium text-green-800">+R500 Extra</h5>
                          <div className="text-sm space-y-1 mt-2">
                            <div>
                              Payment: <span className="font-bold">R{debt.monthlyPayment + 500}</span>
                            </div>
                            <div>
                              Time: <span className="font-bold text-green-600">{extraPayment500.months} months</span>
                            </div>
                            <div>
                              Total:{" "}
                              <span className="font-bold text-green-600">
                                R{extraPayment500.totalPaid.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-green-600 font-medium">
                              Save: R{(currentPayoff.totalPaid - extraPayment500.totalPaid).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
