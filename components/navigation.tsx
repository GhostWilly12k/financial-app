"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Calculator,
  PlayCircle,
  Trophy,
  Target,
  Globe,
  Star,
  TrendingUp,
  Home,
  Menu,
  X,
  PieChart,
  CreditCard,
  AlertTriangle,
} from "lucide-react"

interface NavigationProps {
  currentPage: string
  onPageChange: (page: string) => void
  userLevel: number
  streakDays: number
}

interface NavigationItem {
  id: string
  label: string
  icon: any
  external?: string
}

export function Navigation({ currentPage, onPageChange, userLevel, streakDays }: NavigationProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const languages = [
    "English",
    "Afrikaans",
    "isiZulu",
    "isiXhosa",
    "Sepedi",
    "Setswana",
    "Sesotho",
    "isiNdebele",
    "SiSwati",
    "Tshivenda",
    "Xitsonga",
  ]

  const navigationItems: NavigationItem[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "compound-calculator", label: "Savings Calculator", icon: Calculator },
    { id: "loan-calculator", label: "Loan Calculator", icon: Target },
    { id: "spending-analyzer", label: "Spending Tracker", icon: PieChart },
    { id: "debt-dashboard", label: "Debt Manager", icon: CreditCard },
    { id: "credit-tools", label: "Credit Tools", icon: AlertTriangle },
    { id: "videos", label: "Learn", icon: PlayCircle },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "security-tools", label: "Security Tools", icon: AlertTriangle, external: "http://localhost:5000" },
  ]

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 py-3 max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground leading-tight">First Principles Bank</h1>
              <p className="text-xs text-muted-foreground">Financial Literacy Hub</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-base font-bold text-foreground">FPB</h1>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                onClick={() => {
                  if (item.external) {
                    window.open(item.external, '_blank', 'noopener,noreferrer');
                  } else {
                    onPageChange(item.id);
                  }
                }}
                className="p-2"
                size="sm"
                title={item.label}
              >
                <item.icon className="w-5 h-5" />
              </Button>
            ))}
          </nav>

          {/* User Stats and Language Selector */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-accent" />
                <span className="font-bold text-sm">{userLevel}</span>
              </div>
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground text-xs px-2 py-1">
                {streakDays}d
              </Badge>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="p-2 bg-transparent" title="Language">
                  <Globe className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language}
                    onClick={() => setSelectedLanguage(language)}
                    className={`cursor-pointer ${
                      selectedLanguage === language ? "bg-accent text-accent-foreground" : ""
                    }`}
                  >
                    {language}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-3 pb-3 border-t pt-3 bg-card/80 rounded-lg">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "outline"}
                  onClick={() => {
                    if (item.external) {
                      window.open(item.external, '_blank', 'noopener,noreferrer');
                      setMobileMenuOpen(false);
                    } else {
                      onPageChange(item.id);
                      setMobileMenuOpen(false);
                    }
                  }}
                  className="gap-2 justify-start text-xs py-2"
                  size="sm"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              ))}
            </div>
            {/* Mobile User Stats */}
            <div className="flex items-center justify-center gap-3 pt-3 border-t">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-accent" />
                <span className="font-bold text-sm">Level {userLevel}</span>
              </div>
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground text-xs">
                {streakDays} day streak
              </Badge>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
