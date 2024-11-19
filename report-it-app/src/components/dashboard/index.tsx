import React from 'react'
import { Link } from 'react-router-dom'

type Props = {
    linkToParent: string
}

const Dashboard = ({linkToParent}: Props) => {
  return (
    <div>
        <p>Dashboard</p>
        <Link to={`${linkToParent}/configuration`}>Configuration</Link>

    </div>
  )
}

export default Dashboard