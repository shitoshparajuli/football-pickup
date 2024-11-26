'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAuthUser } from '@/lib/authUtils'
import { updateUserProfile, getUserProfile } from '@/lib/userApi'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const positions = ['Attacker', 'Midfielder', 'Defender'] as const
type Position = typeof positions[number]

interface RankedPosition {
  position: Position
  rank: number
}

export default function EditProfile() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [rankedPositions, setRankedPositions] = useState<RankedPosition[]>(
    positions.map((pos, index) => ({ position: pos, rank: index + 1 }))
  )
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await getAuthUser()
        if (!user?.userId) {
          router.push('/login')
          return
        }

        const profile = await getUserProfile(user.userId)
        if (profile) {
          setFirstName(profile.FirstName)
          setLastName(profile.LastName)
          if (profile.PreferredPositions?.length > 0) {
            // Convert preferred positions array to ranked positions
            setRankedPositions(
              profile.PreferredPositions.map((pos: string, index) => ({
                position: pos as Position,
                rank: index + 1
              }))
            )
          }
        } else {
          setFirstName(user.given_name || '')
          setLastName(user.family_name || '')
        }
      } catch (error: any) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleRankChange = (position: Position, newRank: number) => {
    setRankedPositions(prev => {
      const oldRank = prev.find(p => p.position === position)?.rank
      if (!oldRank || oldRank === newRank) return prev

      return prev.map(p => {
        if (p.position === position) return { ...p, rank: newRank }
        if (p.rank === newRank) return { ...p, rank: oldRank }
        return p
      }).sort((a, b) => a.rank - b.rank)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const user = await getAuthUser()
      if (!user?.userId) {
        throw new Error('No user ID found')
      }

      // Sort positions by rank and extract just the position names
      const sortedPositions = [...rankedPositions]
        .sort((a, b) => a.rank - b.rank)
        .map(p => p.position)

      await updateUserProfile({
        UserId: user.userId,
        FirstName: firstName,
        LastName: lastName,
        PreferredPositions: sortedPositions
      })

      router.push('/profile')
    } catch (error: any) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-4">
              <Label>Position Preferences</Label>
              <div className="space-y-3">
                {rankedPositions.sort((a, b) => a.rank - b.rank).map((rankedPos) => (
                  <div key={rankedPos.position} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="font-medium">{rankedPos.position}</div>
                    </div>
                    <Select
                      value={rankedPos.rank.toString()}
                      onValueChange={(value) => handleRankChange(rankedPos.position, parseInt(value))}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3].map((rank) => (
                          <SelectItem key={rank} value={rank.toString()}>
                            Choice {rank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => router.push('/profile')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
