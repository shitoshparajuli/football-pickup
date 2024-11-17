import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, MapPin, Edit } from 'lucide-react'

export default function ProfileViewPage() {
  // In a real application, you would fetch this data from your backend
  const user = {
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@example.com",
    location: "Denver, CO",
    preferredPositions: ["Midfielder", "Attacker", "Defender"],
    gamesPlayed: 27,
    goalsScored: 12,
    assists: 8
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="relative">
          <div className="absolute top-4 right-4">
            <Link href="/profile/edit">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/placeholder.svg?height=128&width=128"
              alt="Profile picture"
              width={128}
              height={128}
              className="rounded-full"
            />
            <CardTitle className="mt-4 text-2xl font-bold">
              {user.firstName} {user.lastName}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="h-5 w-5" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{user.location}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Preferred Positions</h3>
              <div className="flex flex-wrap gap-2">
                {user.preferredPositions.map((position, index) => (
                  <Badge key={index} variant={index === 0 ? "default" : "secondary"}>
                    {position}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{user.gamesPlayed}</div>
                <div className="text-sm text-gray-600">Games Played</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user.goalsScored}</div>
                <div className="text-sm text-gray-600">Goals Scored</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user.assists}</div>
                <div className="text-sm text-gray-600">Assists</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}