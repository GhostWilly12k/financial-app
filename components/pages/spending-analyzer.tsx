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
import { AlertTriangle, DollarSign, ShoppingCart, Coffee, Car, Home, Gamepad2, Plus, Trash2 } from "lucide-react"

interface Expense {
  id: string
  category: string
  amount: number
  description: string
  date: string
  isRecurring?: boolean
}

interface SpendingAnalyzerProps {
  onPointsEarned: (points: number) => void
}

export function SpendingAnalyzer({ onPointsEarned }: SpendingAnalyzerProps) {
  const [monthlyIncome, setMonthlyIncome] = useState(15000)
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      category: "Food & Dining",
      amount: 2500,
      description: "Takeout & restaurants",
      date: "2024-01-15",
      isRecurring: true,
    },
    {
      id: "2",
      category: "Entertainment",
      amount: 1200,
      description: "Movies, games, subscriptions",
      date: "2024-01-10",
      isRecurring: true,
    },
    { id: "3", category: "Transport", amount: 800, description: "Uber rides", date: "2024-01-12" },
    { id: "4", category: "Shopping", amount: 3200, description: "Clothing & accessories", date: "2024-01-08" },
  ])

  const [newExpense, setNewExpense] = useState({
    category: "Food & Dining",
    amount: "",
    description: "",
  })

  const categories = [
    { name: "Food & Dining", icon: Coffee, color: "bg-red-500" },
    { name: "Entertainment", icon: Gamepad2, color: "bg-purple-500" },
    { name: "Transport", icon: Car, color: "bg-blue-500" },
    { name: "Shopping", icon: ShoppingCart, color: "bg-green-500" },
    { name: "Housing", icon: Home, color: "bg-orange-500" },
    { name: "Other", icon: DollarSign, color: "bg-gray-500" },
  ]

  // Calculate spending analytics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const spendingRatio = (totalExpenses / monthlyIncome) * 100

  const categoryTotals = categories
    .map((category) => {
      const total = expenses
        .filter((expense) => expense.category === category.name)
        .reduce((sum, expense) => sum + expense.amount, 0)
      return {
        ...category,
        total,
        percentage: monthlyIncome > 0 ? (total / monthlyIncome) * 100 : 0,
      }
    })
    .sort((a, b) => b.total - a.total)

  // Identify problematic spending patterns
  const alerts = []
  const foodSpending = categoryTotals.find((c) => c.name === "Food & Dining")?.percentage || 0
  const entertainmentSpending = categoryTotals.find((c) => c.name === "Entertainment")?.percentage || 0

  if (foodSpending > 20) {
    alerts.push({
      type: "warning",
      message: `You're spending ${foodSpending.toFixed(1)}% on food & dining. Consider cooking more at home to save money!`,
      savings: Math.round(((foodSpending - 15) * monthlyIncome) / 100),
    })
  }

  if (entertainmentSpending > 10) {
    alerts.push({
      type: "info",
      message: `Entertainment is ${entertainmentSpending.toFixed(1)}% of income. Look for free activities to reduce this.`,
      savings: Math.round(((entertainmentSpending - 8) * monthlyIncome) / 100),
    })
  }

  if (spendingRatio > 80) {
    alerts.push({
      type: "error",
      message: "You're spending over 80% of your income! This leaves no room for savings or emergencies.",
      savings: 0,
    })
  }

  const addExpense = () => {
    if (newExpense.amount && newExpense.description) {
      const expense: Expense = {
        id: Date.now().toString(),
        category: newExpense.category,
        amount: Number.parseFloat(newExpense.amount),
        description: newExpense.description,
        date: new Date().toISOString().split("T")[0],
      }
      setExpenses([...expenses, expense])
      setNewExpense({ category: "Food & Dining", amount: "", description: "" })
      onPointsEarned(5) // Points for tracking expenses
    }
  }

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const simulateCutting = (categoryName: string, reductionPercent: number) => {
    const category = categoryTotals.find((c) => c.name === categoryName)
    if (!category) return 0

    const monthlySavings = (category.total * reductionPercent) / 100
    const yearlySavings = monthlySavings * 12
    const fiveYearGrowth = yearlySavings * 5 * 1.08 // 8% compound growth

    return {
      monthly: monthlySavings,
      yearly: yearlySavings,
      fiveYear: fiveYearGrowth,
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Smart Spending Analyzer</h1>
        <p className="text-muted-foreground">Track your expenses and discover where your money goes</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tracker">Add Expenses</TabsTrigger>
          <TabsTrigger value="simulator">Savings Simulator</TabsTrigger>
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

          {/* Spending Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <Alert
                  key={index}
                  className={
                    alert.type === "error"
                      ? "border-red-500"
                      : alert.type === "warning"
                        ? "border-amber-500"
                        : "border-blue-500"
                  }
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {alert.message}
                    {alert.savings > 0 && (
                      <span className="block mt-1 font-semibold text-green-600">
                        Potential monthly savings: R{alert.savings}
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Spending Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending Breakdown</CardTitle>
                <CardDescription>Where your money goes each month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryTotals.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${category.color}`} />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">R{category.total.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{category.percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Health Check</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Spending</span>
                    <span className="font-bold">R{totalExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spending Ratio</span>
                    <Badge variant={spendingRatio > 80 ? "destructive" : spendingRatio > 60 ? "secondary" : "default"}>
                      {spendingRatio.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Available for Savings</span>
                    <span
                      className={`font-bold ${monthlyIncome - totalExpenses > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      R{(monthlyIncome - totalExpenses).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Recommended Budget (50/30/20 Rule)</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Needs (50%)</span>
                      <span>R{(monthlyIncome * 0.5).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wants (30%)</span>
                      <span>R{(monthlyIncome * 0.3).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Savings (20%)</span>
                      <span>R{(monthlyIncome * 0.2).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tracker" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Expense</CardTitle>
              <CardDescription>Track your spending to get personalized insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount (R)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder="What did you buy?"
                  />
                </div>
              </div>
              <Button onClick={addExpense} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expenses.map((expense) => {
                  const category = categories.find((c) => c.name === expense.category)
                  const CategoryIcon = category?.icon || DollarSign
                  return (
                    <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${category?.color || "bg-gray-500"}`}>
                          <CategoryIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{expense.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {expense.category} • {expense.date}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">R{expense.amount.toLocaleString()}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeExpense(expense.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Cutting Simulator</CardTitle>
              <CardDescription>See how much you could save by reducing certain expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {categoryTotals
                .filter((c) => c.total > 0)
                .map((category) => {
                  const savings25 = simulateCutting(category.name, 25)
                  const savings50 = simulateCutting(category.name, 50)

                  return (
                    <div key={category.name} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${category.color}`} />
                        <h4 className="font-semibold">{category.name}</h4>
                        <Badge variant="outline">R{category.total}/month</Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h5 className="font-medium text-green-800">Cut by 25%</h5>
                          <div className="text-sm space-y-1 mt-2">
                            <div>
                              Monthly savings: <span className="font-bold">R{savings25.monthly.toFixed(0)}</span>
                            </div>
                            <div>
                              Yearly savings: <span className="font-bold">R{savings25.yearly.toFixed(0)}</span>
                            </div>
                            <div>
                              5-year growth:{" "}
                              <span className="font-bold text-green-600">R{savings25.fiveYear.toFixed(0)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h5 className="font-medium text-blue-800">Cut by 50%</h5>
                          <div className="text-sm space-y-1 mt-2">
                            <div>
                              Monthly savings: <span className="font-bold">R{savings50.monthly.toFixed(0)}</span>
                            </div>
                            <div>
                              Yearly savings: <span className="font-bold">R{savings50.yearly.toFixed(0)}</span>
                            </div>
                            <div>
                              5-year growth:{" "}
                              <span className="font-bold text-blue-600">R{savings50.fiveYear.toFixed(0)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
