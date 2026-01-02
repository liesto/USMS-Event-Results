export interface TopTimeResult {
  rank: number
  swimmerId: string
  swimmerName: string
  age: number
  gender: string
  club: string
  lmsc: string
  event: string
  course: string
  timeFormatted: string
  timeSeconds: number
  date: string
  meet: string
}

export const strokes = ["Free", "Back", "Breast", "Fly", "IM"]

export const distances = ["50", "100", "200", "400", "500", "800", "1000", "1500", "1650"]

export const ageGroups = [
  { value: "all", label: "--None--" },
  { value: "18-24", label: "18-24" },
  { value: "25-29", label: "25-29" },
  { value: "30-34", label: "30-34" },
  { value: "35-39", label: "35-39" },
  { value: "40-44", label: "40-44" },
  { value: "45-49", label: "45-49" },
  { value: "50-54", label: "50-54" },
  { value: "55-59", label: "55-59" },
  { value: "60-64", label: "60-64" },
  { value: "65-69", label: "65-69" },
  { value: "70-74", label: "70-74" },
  { value: "75-79", label: "75-79" },
  { value: "80-84", label: "80-84" },
  { value: "85-89", label: "85-89" },
  { value: "90-94", label: "90-94" },
  { value: "95-99", label: "95-99" },
  { value: "100-104", label: "100-104" },
]

export const genders = [
  { value: "M", label: "Men" },
  { value: "F", label: "Women" },
]

// Generate sample data for demonstration
export const topTimesData: TopTimeResult[] = generateSampleData()

function generateSampleData(): TopTimeResult[] {
  const results: TopTimeResult[] = []
  const courses = ["SCY", "SCM", "LCM"]
  const clubs = ["SHARK", "AGUA", "PALM", "FAST", "MAKO", "WAVE", "TIDE", "SWIM", "BLUE", "GOLD"]
  const lmscs = [
    "Florida",
    "Georgia",
    "Texas",
    "California",
    "New York",
    "Colorado",
    "Arizona",
    "Oregon",
    "Virginia",
    "Ohio",
  ]
  const meets = [
    "Spring Nationals",
    "Summer Nationals",
    "LC Nationals",
    "Zone Championships",
    "Regional Championship",
    "State Meet",
    "Masters Classic",
    "Invitational",
  ]
  const firstNames = [
    "Michael",
    "Katie",
    "Ryan",
    "Natalie",
    "Jason",
    "Sarah",
    "David",
    "Amanda",
    "Chris",
    "Lauren",
    "Brian",
    "Emily",
    "Mark",
    "Jessica",
    "Kevin",
    "Michelle",
    "James",
    "Rachel",
    "Tom",
    "Nicole",
    "Steve",
    "Ashley",
    "Matt",
    "Megan",
    "Dan",
    "Amy",
    "Scott",
    "Lisa",
    "John",
    "Kelly",
  ]
  const lastNames = [
    "Johnson",
    "Smith",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Anderson",
    "Taylor",
    "Thomas",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Thompson",
    "White",
    "Harris",
  ]

  // Generate times for each combination
  for (const course of courses) {
    for (const gender of ["M", "F"]) {
      for (const stroke of strokes) {
        for (const distance of distances) {
          // Skip invalid combinations
          if (stroke === "IM" && !["100", "200", "400"].includes(distance)) continue
          if (distance === "400" && stroke !== "Free" && stroke !== "IM") continue
          if (["500", "800", "1000", "1500", "1650"].includes(distance) && stroke !== "Free") continue

          // Generate 150 results per event
          for (let i = 0; i < 150; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
            const age = 18 + Math.floor(Math.random() * 80)
            const baseTime = getBaseTime(Number.parseInt(distance), stroke, gender, course)
            const variation = baseTime * (0.05 + (i / 150) * 0.4) // 5% to 45% slower than base
            const time = baseTime + variation + Math.random() * baseTime * 0.1

            results.push({
              rank: i + 1,
              swimmerId: `SW${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
              swimmerName: `${firstName} ${lastName}`,
              age,
              gender,
              club: clubs[Math.floor(Math.random() * clubs.length)],
              lmsc: lmscs[Math.floor(Math.random() * lmscs.length)],
              event: `${distance} ${stroke}`,
              course,
              timeFormatted: formatTime(time),
              timeSeconds: time,
              date: generateRandomDate(),
              meet: meets[Math.floor(Math.random() * meets.length)],
            })
          }
        }
      }
    }
  }

  return results
}

function getBaseTime(distance: number, stroke: string, gender: string, course: string): number {
  // Base times in seconds for elite swimmers (SCY Men)
  const baseTimes: Record<string, Record<number, number>> = {
    Free: { 50: 19.5, 100: 43, 200: 95, 400: 215, 500: 270, 800: 450, 1000: 570, 1500: 870, 1650: 960 },
    Back: { 50: 22, 100: 47, 200: 105 },
    Breast: { 50: 24, 100: 52, 200: 115 },
    Fly: { 50: 21, 100: 46, 200: 105 },
    IM: { 100: 48, 200: 105, 400: 230 },
  }

  let time = baseTimes[stroke]?.[distance] || 60

  // Adjust for gender
  if (gender === "F") time *= 1.08

  // Adjust for course
  if (course === "LCM") time *= 1.11
  if (course === "SCM") time *= 1.02

  return time
}

function formatTime(seconds: number): string {
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60)
    const secs = (seconds % 60).toFixed(2)
    return `${mins}:${secs.padStart(5, "0")}`
  }
  return seconds.toFixed(2)
}

function generateRandomDate(): string {
  const year = 2020 + Math.floor(Math.random() * 5)
  const month = 1 + Math.floor(Math.random() * 12)
  const day = 1 + Math.floor(Math.random() * 28)
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
