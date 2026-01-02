/**
 * Swimmer Search Component
 * Allows searching by SwimmerID or Name
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

export function SwimmerSearch() {
  const navigate = useNavigate()
  const [searchType, setSearchType] = useState<'id' | 'name'>('id')
  const [swimmerId, setSwimmerId] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchType === 'id' && swimmerId.trim()) {
      navigate(`/individual-results?SwimmerID=${swimmerId.trim().toUpperCase()}`)
    } else if (searchType === 'name' && firstName.trim() && lastName.trim()) {
      navigate(`/individual-results?FirstName=${firstName.trim()}&LastName=${lastName.trim()}`)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold">Search for a Swimmer</h2>

      <div className="mb-4 flex gap-4">
        <button
          type="button"
          onClick={() => setSearchType('id')}
          className={`rounded px-4 py-2 text-sm font-medium ${
            searchType === 'id'
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Search by ID
        </button>
        <button
          type="button"
          onClick={() => setSearchType('name')}
          className={`rounded px-4 py-2 text-sm font-medium ${
            searchType === 'name'
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Search by Name
        </button>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        {searchType === 'id' ? (
          <div className="space-y-2">
            <Label htmlFor="swimmerId">Swimmer ID</Label>
            <Input
              id="swimmerId"
              type="text"
              placeholder="e.g., GAT0R"
              value={swimmerId}
              onChange={(e) => setSwimmerId(e.target.value)}
              className="max-w-xs"
            />
            <p className="text-sm text-slate-500">
              Enter the 5-character USMS Swimmer ID (e.g., GAT0R)
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
        )}

        <Button type="submit" className="w-full sm:w-auto">
          Search Results
        </Button>
      </form>

      <div className="mt-6 border-t pt-4">
        <p className="mb-2 text-sm font-medium text-slate-700">Quick Examples:</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate('/individual-results?SwimmerID=GAT0R')}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm hover:bg-slate-200"
          >
            Kyle Deery (GAT0R)
          </button>
          <button
            type="button"
            onClick={() => navigate('/individual-results?FirstName=Joy&LastName=Ward')}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm hover:bg-slate-200"
          >
            Joy Ward
          </button>
        </div>
      </div>
    </Card>
  )
}
