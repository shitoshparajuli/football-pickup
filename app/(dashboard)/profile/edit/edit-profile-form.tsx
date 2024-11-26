'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateUserProfile } from '@/lib/userApi'

const positions = ['Attacker', 'Midfielder', 'Defender'] as const
type Position = typeof positions[number]

interface RankedPosition {
  position: Position
  rank: number
}

interface Profile {
  FirstName: string
  LastName: string
  PreferredPositions: string[]
}

interface EditProfileFormProps {
  initialProfile: Profile | null
  userId: string
}

export default function EditProfileForm({ initialProfile, userId }: EditProfileFormProps) {
  const router = useRouter()
  const [firstName, setFirstName] = useState(initialProfile?.FirstName || '')
  const [lastName, setLastName] = useState(initialProfile?.LastName || '')
  const [rankedPositions, setRankedPositions] = useState<RankedPosition[]>(
    (initialProfile?.PreferredPositions || positions).map((pos, index) => ({
      position: pos as Position,
      rank: index + 1
    }))
  )
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const sortedPositions = rankedPositions
        .sort((a, b) => a.rank - b.rank)
        .map(rp => rp.position)

      await updateUserProfile({
        UserId: userId,
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
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
