import { useState, useEffect } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { useCourses } from "../hooks/useCourses"
import CourseCard from "../components/course/CourseCard"
import LoadingSpinner from "../components/ui/LoadingSpinner"

const categories = [
  "All",
  "Artificial Intelligence",
  "Programming",
  "Data Analysis",
  "Cybersecurity",
  "Business Skills",
]
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"]
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
]

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "All",
  )
  const [activeLevel, setActiveLevel] = useState(
    searchParams.get("level") || "All Levels",
  )
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "popular")
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading } = useCourses({
    category: activeCategory !== "All" ? activeCategory : undefined,
    level: activeLevel !== "All Levels" ? activeLevel : undefined,
    search: search || undefined,
    sortBy,
  })

  const courses = data?.data || []

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (activeCategory !== "All") params.set("category", activeCategory)
    if (activeLevel !== "All Levels") params.set("level", activeLevel)
    if (sortBy !== "popular") params.set("sort", sortBy)
    setSearchParams(params, { replace: true })
  }, [search, activeCategory, activeLevel, sortBy, setSearchParams])

  return (
    <div style={{ background: "#060A12", minHeight: "100vh" }}>
      {/* Header */}
      <div
        className="py-12 px-6 text-center"
        style={{
          background:
            "linear-gradient(180deg, rgba(59,130,246,0.06) 0%, transparent 100%)",
          borderBottom: "1px solid rgba(59,130,246,0.08)",
        }}
      >
        <h1
          className="text-4xl lg:text-5xl font-bold font-display mb-3"
          style={{ color: "#F1F5F9" }}
        >
          Course <span className="gradient-text">Marketplace</span>
        </h1>
        <p className="text-lg mb-8" style={{ color: "#64748B" }}>
          {courses.length} expert-crafted courses across 5 categories
        </p>

        <div className="max-w-2xl mx-auto">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{
              background: "#0D1421",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            <Search size={18} style={{ color: "#475569", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search for courses, topics, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "#F1F5F9" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs px-2 py-1 rounded-md"
                style={{ color: "#475569" }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Category tabs */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-2 mb-6"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background:
                  activeCategory === cat ? "rgba(59,130,246,0.15)" : "#0D1421",
                color: activeCategory === cat ? "#3B82F6" : "#94A3B8",
                border:
                  activeCategory === cat
                    ? "1px solid rgba(59,130,246,0.3)"
                    : "1px solid rgba(59,130,246,0.1)",
              }}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="ml-auto flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: showFilters ? "rgba(59,130,246,0.15)" : "#0D1421",
              color: showFilters ? "#3B82F6" : "#94A3B8",
              border: showFilters
                ? "1px solid rgba(59,130,246,0.3)"
                : "1px solid rgba(59,130,246,0.1)",
            }}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div
            className="p-4 rounded-xl mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
            style={{
              background: "#0D1421",
              border: "1px solid rgba(59,130,246,0.1)",
            }}
          >
            <div>
              <label
                className="block text-xs font-medium mb-2"
                style={{ color: "#64748B" }}
              >
                LEVEL
              </label>
              <div className="flex gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setActiveLevel(level)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background:
                        activeLevel === level
                          ? "rgba(59,130,246,0.15)"
                          : "transparent",
                      color: activeLevel === level ? "#3B82F6" : "#64748B",
                      border:
                        activeLevel === level
                          ? "1px solid rgba(59,130,246,0.3)"
                          : "1px solid rgba(59,130,246,0.1)",
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label
                className="block text-xs font-medium mb-2"
                style={{ color: "#64748B" }}
              >
                SORT BY
              </label>
              <div className="flex gap-2">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background:
                        sortBy === opt.value
                          ? "rgba(59,130,246,0.15)"
                          : "transparent",
                      color: sortBy === opt.value ? "#3B82F6" : "#64748B",
                      border:
                        sortBy === opt.value
                          ? "1px solid rgba(59,130,246,0.3)"
                          : "1px solid rgba(59,130,246,0.1)",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Course grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size={32} />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg" style={{ color: "#64748B" }}>
              No courses found matching your criteria
            </p>
            <button
              onClick={() => {
                setSearch("")
                setActiveCategory("All")
                setActiveLevel("All Levels")
              }}
              className="mt-4 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: "rgba(59,130,246,0.1)", color: "#3B82F6" }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
