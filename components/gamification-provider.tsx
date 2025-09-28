"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface GamificationContextType {
  userLevel: number
  totalPoints: number
  streakDays: number
  achievements: string[]
  addPoints: (points: number, reason?: string) => void
  unlockAchievement: (achievementId: string) => void
  incrementStreak: () => void
  resetStreak: () => void
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined)

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [userLevel, setUserLevel] = useState(3)
  const [totalPoints, setTotalPoints] = useState(185)
  const [streakDays, setStreakDays] = useState(7)
  const [achievements, setAchievements] = useState<string[]>([
    "first-calculation",
    "video-watcher",
    "week-warrior",
    "savings-hero",
    "early-adopter",
  ])

  // Calculate level based on points
  useEffect(() => {
    const newLevel = Math.floor(totalPoints / 100) + 1
    if (newLevel !== userLevel) {
      setUserLevel(newLevel)
    }
  }, [totalPoints, userLevel])

  const addPoints = (points: number, reason?: string) => {
    setTotalPoints((prev) => prev + points)
    // You could add a toast notification here showing points earned
    console.log(`Earned ${points} points${reason ? ` for ${reason}` : ""}!`)
  }

  const unlockAchievement = (achievementId: string) => {
    if (!achievements.includes(achievementId)) {
      setAchievements((prev) => [...prev, achievementId])
      // You could add a celebration animation here
      console.log(`Achievement unlocked: ${achievementId}!`)
    }
  }

  const incrementStreak = () => {
    setStreakDays((prev) => prev + 1)
  }

  const resetStreak = () => {
    setStreakDays(0)
  }

  return (
    <GamificationContext.Provider
      value={{
        userLevel,
        totalPoints,
        streakDays,
        achievements,
        addPoints,
        unlockAchievement,
        incrementStreak,
        resetStreak,
      }}
    >
      {children}
    </GamificationContext.Provider>
  )
}

export function useGamification() {
  const context = useContext(GamificationContext)
  if (context === undefined) {
    throw new Error("useGamification must be used within a GamificationProvider")
  }
  return context
}
