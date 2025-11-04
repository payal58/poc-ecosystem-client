'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { pathwaysApi } from '@/lib/api'
import { Compass, ArrowRight, CheckCircle } from 'lucide-react'

export default function SupportPathwaysPage() {
  const router = useRouter()
  const [pathways, setPathways] = useState([])
  const [loading, setLoading] = useState(true)
  const [responses, setResponses] = useState({})
  const [currentStep, setCurrentStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchPathways()
  }, [])

  const fetchPathways = async () => {
    try {
      setLoading(true)
      const response = await pathwaysApi.getAll()
      setPathways(response.data)
    } catch (error) {
      console.error('Error fetching pathways:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (pathwayId, answer) => {
    setResponses({
      ...responses,
      [pathwayId]: answer
    })
  }

  const handleNext = () => {
    if (currentStep < pathways.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await pathwaysApi.query({ responses })
      router.push(`/support/results?data=${encodeURIComponent(JSON.stringify(response.data))}`)
    } catch (error) {
      console.error('Error submitting pathway query:', error)
      alert('Error getting recommendations. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading questionnaire...</p>
        </div>
      </div>
    )
  }

  if (pathways.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Compass className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No pathways available at this time.</p>
        </div>
      </div>
    )
  }

  const currentPathway = pathways[currentStep]
  const answerOptions = currentPathway.answer_options || {}
  const hasAnswer = responses[currentPathway.id] !== undefined
  const isLastStep = currentStep === pathways.length - 1
  const allAnswered = pathways.every(p => responses[p.id] !== undefined)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8 text-center">
          <Compass className="h-10 sm:h-12 w-10 sm:w-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Support Pathways</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Answer a few questions to get personalized recommendations
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Question {currentStep + 1} of {pathways.length}
            </span>
            <span className="text-sm text-gray-600">
              {Object.keys(responses).length} of {pathways.length} answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentStep + 1) / pathways.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-8 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
            {currentPathway.question}
          </h2>

          <div className="space-y-2 sm:space-y-3">
            {Object.entries(answerOptions).map(([key, value]) => {
              const isSelected = responses[currentPathway.id] === key
              return (
                <button
                  key={key}
                  onClick={() => handleAnswer(currentPathway.id, key)}
                  className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary-600 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white text-sm sm:text-base">{value}</span>
                    {isSelected && (
                      <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base ${
              currentStep === 0
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Previous
          </button>

          {isLastStep ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={`px-6 py-2 rounded-lg flex items-center ${
                allAnswered
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Get Recommendations
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!hasAnswer}
              className={`px-6 py-2 rounded-lg flex items-center ${
                hasAnswer
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

