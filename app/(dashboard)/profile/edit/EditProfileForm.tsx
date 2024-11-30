'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateUserProfile } from '@/lib/userApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const positions = ['Attacker', 'Midfielder', 'Defender'] as const
type Position = typeof positions[number]

interface RankedPosition {
  position: Position
  rank: number
}

export interface Profile {
  FirstName: string
  LastName: string
  PreferredPositions?: string[]
}

interface EditProfileFormProps {
  initialProfile?: Profile
  userId: string
}

export default function EditProfileForm({ initialProfile, userId }: EditProfileFormProps) {
  const router = useRouter()
  const [firstName, setFirstName] = useState(initialProfile?.FirstName || '')
  const [lastName, setLastName] = useState(initialProfile?.LastName || '')
  const [rankedPositions, setRankedPositions] = useState<RankedPosition[]>(
    positions.map((pos, index) => {
      const posIndex = initialProfile?.PreferredPositions?.indexOf(pos) ?? -1;
      return {
        position: pos,
        rank: posIndex >= 0 ? posIndex + 1 : index + 1
      };
    })
  )
  const [saving, setSaving] = useState(false)

  const handleRankChange = (position: Position, newRank: number) => {
    setRankedPositions(prev => {
      const oldRank = prev.find(p => p.position === position)?.rank
      if (!oldRank || oldRank === newRank) return prev

      return prev.map(p => {
        if (p.position === position) return { ...p, rank: newRank }
        if (p.rank === newRank) return { ...p, rank: oldRank }
        return p
      })
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const sortedPositions = rankedPositions
        .sort((a, b) => a.rank - b.rank)
        .map(rp => rp.position);

      await updateUserProfile({
        UserId: userId,
        FirstName: firstName,
        LastName: lastName,
        PreferredPositions: sortedPositions
      });

      router.push('/profile');
    } catch (error) {
      console.error('Error saving profile:', error instanceof Error ? error.message : String(error));
    } finally {
      setSaving(false);
    }
  }

  return (
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
  )
}
