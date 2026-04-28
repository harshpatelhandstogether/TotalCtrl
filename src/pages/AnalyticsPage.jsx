import React from 'react'
import Header from '../components/UI/Header'
import AnalyticData from '../components/Analytics/AnalyticData'

export default function AnalyticsPage() {
  return (
    <div >
        <Header title={"Analytics"} className="text-xl"></Header>
        <AnalyticData />
        
    </div>
  )
}
