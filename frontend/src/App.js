import React, { Component, useState, useEffect } from 'react'
import jobService from './services/jobs'
import Select from 'react-select'

// Todo: add labels to the form, make assignee multi select and allow to filter by assignee

const JobForm = ({ formType, job, updateJobList, closeForm }) => {
  const [jobNumber, setJobNumber] = useState(job.jobNumber)
  const [dueDate, setDueDate] = useState(job.dueDate)
  const [maxHours, setMaxHours] = useState(job.maxHours)
  const [assignee, setAssignee] = useState(job.assignee)
  const [description, setDescription] = useState(job.description)
  const [status, setStatus] = useState(job.status)
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([{value: 'all'}])

  const teamMembers = [
    { value: 'all', label: 'All' },
    { value: 'cedric', label: 'Cédric' },
    { value: 'dora', label: 'Dora' },
    { value: 'luke', label: 'Luke' },
    { value: 'vera', label: 'Vera' }
  ]

  const clearState = () => {
    setJobNumber('')
    setDueDate('')
    setMaxHours('')
    setAssignee('')
    setDescription('')
    setStatus('')
    
    return null
  }

  const handleJob = (event) => {
    event.preventDefault()

    const jobObject = {
      jobNumber: jobNumber,
      dueDate: dueDate,
      maxHours: maxHours,
      assignee: selectedTeamMembers,
      description: description,
      status: status
    }

    console.log(jobObject)

    if (formType === 'add') {
      jobService
      .create(jobObject)
      .then(returnedJob => {
        clearState()
        updateJobList()
        closeForm()
      })
    } else if (formType === 'edit') {
      jobService
      .update(job.id, jobObject)
      .then(returnedJob => {
        clearState()
        updateJobList()
        closeForm()
      })
    }
  }

  return (
    <form onSubmit={handleJob} className="form">
      <input type="text" placeholder="Job Number" className="bg-gray-200 border-2 border-gray-300 bg-gray-100 mx-1 rounded-lg focus:border-gray-700" value={jobNumber} onChange={(event) => setJobNumber(event.target.value)}/>
      <input type="text" placeholder="Due Date" className="bg-gray-200 border-2 border-gray-300 bg-gray-100 mx-1 rounded-lg focus:border-gray-700" value={dueDate} onChange={(event) => setDueDate(event.target.value)}/>
      <input type="text" placeholder="Max Hours" className="bg-gray-200 border-2 border-gray-300 bg-gray-100 mx-1 rounded-lg focus:border-gray-700" value={maxHours} onChange={(event) => setMaxHours(event.target.value)}/>
      <Select
      options={teamMembers}
      onChange={setSelectedTeamMembers}
      placeholder='Assignee'
      isMulti
      isSearchable
      />
      <input type="text" placeholder="Description" className="bg-gray-200 border-2 border-gray-300 bg-gray-100 mx-1 rounded-lg focus:border-gray-700" value={description} onChange={(event) => setDescription(event.target.value)}/>
      <input type="text" placeholder="Status" className="bg-gray-200 border-2 border-gray-300 bg-gray-100 mx-1 mr-4 rounded-lg focus:border-gray-700" value={status} onChange={(event) => setStatus(event.target.value)}/>
      <button type="submit" className="px-4 py-2 text-sm font-semibold tracking-wider border-2 border-gray-300 rounded hover:bg-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 mr-2">Submit</button>
      <button onClick={() => closeForm()} className="px-4 py-2 text-sm font-semibold tracking-wider border-2 border-gray-300 rounded hover:bg-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">Cancel</button>
    </form>
  )
}

const Job = ({ jobNumber, dueDate, maxHours, assignee, description, status, editJob, deleteJob }) => {
  return (
    <tr>
      <td>{jobNumber}</td>
      <td>{dueDate}</td>
      <td>{maxHours}</td>
      <td>{assignee}</td>
      <td>{description}</td>
      <td>{status}</td>
      <td>
        <div className="flex item-center justify-center">
          <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110" onClick={editJob}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110" onClick={deleteJob}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        </div>
      </td>
    </tr>
  )
}

const App = () => {
  const [jobs, setJobs] = useState([])
  const [job, setJob] = useState(null)
  const [isButtonHidden, setIsButtonHidden] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState('')
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([{label: 'All'}])

  const teamMembers = [
    { value: 'all', label: 'All' },
    { value: 'cedric', label: 'Cédric' },
    { value: 'dora', label: 'Dora' },
    { value: 'luke', label: 'Luke' },
    { value: 'vera', label: 'Vera' }
  ]

  const getJobList = () => {
    jobService
      .getAll()
      .then(initialJobs => {
        const eachJob = initialJobs.map(job => {
          const jobObject = {
            id: job.id,
            jobNumber: job.jobNumber,
            dueDate: job.dueDate,
            maxHours: job.maxHours,
            assignee: job.assignee.map(eachAssignee => eachAssignee.label),
            description: job.description,
            status: job.status
          }
          
          return jobObject
        })
        
        setJobs(eachJob)
      })
  }

  useEffect(() => {
    getJobList()
  }, [])

  const filterJobsByAssignee = () => {
    const selectedTeamMemberValues = selectedTeamMembers.map(teamMember => teamMember.label)

    if(selectedTeamMemberValues.includes('All')) {
      return jobs
    } else {
      return jobs.filter(job => job.assignee.some(eachAssignee => selectedTeamMemberValues.includes(eachAssignee)))
    }
  }

  const updateJobList = () => {
    getJobList()
  }

  const closeForm = () => {
    setShowForm(false)
    setIsButtonHidden(false)
  }
  const editJob = (job) => {
    if (showForm === false) {
      return null
    }

    return (
      <JobForm formType={formType} job={job} updateJobList={updateJobList} closeForm={closeForm} />
    )
  }

  const deleteJob = (id) => {
    jobService
    .remove(id)
    .then(returnedJob => {
      setJobs(jobs.filter(job => job.id !== id))
    })
  }

  const showAddForm = () => {
    setFormType('add')
    setJob({})
    setIsButtonHidden(true)
    setShowForm(true)
    setIsButtonHidden(true)
  }

  const showEditForm = (job) => {
    setFormType('edit')
    setJob(job)
    setIsButtonHidden(true)
    setShowForm(true)
    setIsButtonHidden(true)
  }

  return (
    <>
      <div className="container">
        {showForm ? editJob(job) : null}
        <button onClick={() => showAddForm()} hidden={isButtonHidden} className="px-4 py-2 text-sm font-semibold tracking-wider border-2 border-gray-300 rounded hover:bg-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">Add Job</button>
      </div>
      {/* <Notification message={message} /> */}
      <div className="container">
        <table>
          <thead>
            <tr>
              <th>Job Number</th>
              <th>Due Date</th>
              <th>Max Hours</th>
              <Select
              defaultValue={teamMembers[0]}
              options={teamMembers}
              onChange={setSelectedTeamMembers}
              placeholder='Assignee'
              isMulti
              isSearchable
              />
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filterJobsByAssignee().map(job => 
              <Job
              key={job.id}
              jobId = {job.id}
              jobNumber={job.jobNumber}
              dueDate={job.dueDate}
              maxHours={job.maxHours}
              assignee={`${job.assignee}`}
              description={job.description}
              status={job.status}
              deleteJob={() => deleteJob(job.id)}
              editJob={() => showEditForm(job)}
              />
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App