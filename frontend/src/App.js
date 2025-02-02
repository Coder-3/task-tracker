import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import jobService from './services/jobs'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'

Modal.setAppElement('#root')

const JobForm = ({ formType, job, updateJobList, closeForm, teamMembers }) => {
  const [jobNumber, setJobNumber] = useState(job.jobNumber)
  const [jobLink, setJobLink] = useState(job.jobLink)
  const [dueDate, setDueDate] = useState(job.dueDate ? new Date(job.dueDate) : new Date())
  const [maxHours, setMaxHours] = useState(job.maxHours)
  const [assignee, setAssignee] = useState(job.assignee ? teamMembers.filter(teamMember => job.assignee.includes(` ${teamMember.label}`)) : [])
  const [description, setDescription] = useState(job.description)
  const [selectedStatus, setSelectedStatus] = useState(job.status ? job.status : { value: 'toStart', label: 'To Start' })

  const statusOptions = [
    { value: 'toStart', label: 'To Start' },
    { value: 'inProgress', label: 'In Progress' },
    { value: 'blocked', label: 'Blocked' },
    { value: 'completed', label: 'Completed' }
  ]

  const clearState = () => {
    setJobNumber('')
    setDueDate('')
    setMaxHours('')
    setAssignee('')
    setDescription('')
    
    return null
  }

  const handleJob = (event) => {
    event.preventDefault()
    
    let statusInArray = []

    if (selectedStatus instanceof Array) {
      statusInArray = selectedStatus
    } else {
      statusInArray = new Array(selectedStatus)
    }

    const jobObject = {
      jobNumber: jobNumber,
      jobLink: jobLink,
      dueDate: new Date(dueDate),
      maxHours: maxHours,
      assignee: assignee,
      description: description,
      status: statusInArray
    }

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
    <>
      <div className="bg-white flex flex-col justify-center">
        <div className="relative sm:max-w-xl sm:mx-auto">
          <div className="relative bg-gray-200 px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
            <div className="max-w-md mx-auto">
              <div className="flex items-center space-x-5">
                <div className="h-14 w-14 bg-gray-900 rounded-md flex flex-shrink-0 justify-center items-center text-white text-2xl">JL</div>
                <div className="block pl-2 pt-2 font-semibold text-xl self-start text-gray-700">
                  <h2 className="leading-relaxed">Job</h2>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <label className="leading-loose">Job Number</label>
                      <input type="text" value={jobNumber} onChange={(event) => setJobNumber(event.target.value)} className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" />
                    </div>
                    <div className="flex flex-col">
                      <label className="leading-loose">Job Link</label>
                      <input type="text" value={jobLink} placeholder="https://..." onChange={(event) => setJobLink(event.target.value)} className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <label className="leading-loose">Due Date</label>
                      <div className="relative focus-within:text-gray-600 text-gray-400">
                        <DatePicker
                        dateFormat="yyyy-MM-dd"
                        selected={dueDate}
                        onChange={date => setDueDate(date)}
                        className="pl-10 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        />
                        <div className="absolute left-3 top-2">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="leading-loose">Max Hours</label>
                      <input type="text" value={maxHours} onChange={(event) => setMaxHours(event.target.value)} className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col w-1/2">
                      <label className="leading-loose">Assignee</label>
                      <Select
                      options={teamMembers}
                      defaultValue={assignee}
                      onChange={setAssignee}
                      isMulti
                      isSearchable
                      /> 
                    </div>
                    <div className="flex flex-col w-1/2">
                      <label className="leading-loose">Status</label>
                      <Select
                      options={statusOptions}
                      defaultValue={selectedStatus}
                      onChange={setSelectedStatus}
                      isSearchable
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="leading-loose">Description</label>
                    <input type="text" value={description} onChange={(event) => setDescription(event.target.value)} className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" />
                  </div>
                </div>
                <div className="pt-4 flex items-center space-x-4">
                  <button onClick={() => closeForm()} className="flex justify-center items-center w-full text-gray-900 px-4 py-3 rounded-md focus:outline-none">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> Cancel
                  </button>
                  <button onClick={handleJob} className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none">Submit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const Job = ({ jobNumber, jobLink, dueDate, maxHours, assignee, description, status, editJob, deleteJob }) => {
  const jobNumberLink = () => {
    if (jobLink) {
      return <a className="text-blue-600 hover:text-blue-900" href={jobLink} target="_blank" rel="noreferrer">{jobNumber}</a>
    } else {
      return jobNumber
    }
  }

  const approachingDeadline = () => {
    const dateDue = new Date(dueDate.toString().slice(0, 15))
    const today = new Date()

    const dayDifference = Math.ceil((dateDue - today) / (1000 * 60 * 60 * 24))

    if (dayDifference < 0) {
      return 'text-red-600 font-bold'
    } else if (dayDifference === 0) {
      return 'text-yellow-600 font-semibold'
    } else if (dayDifference === 1) {
      return 'font-medium'
    }
  }

  return (
    <tr>
      <td className="py-3 px-6 text-left whitespace-nowrap">
        {jobNumberLink()}
      </td>
      <td className={`py-3 px-6 text-left whitespace-nowrap ${approachingDeadline()}`}>{dueDate.toString().slice(0, 10)}</td>
      <td className="py-3 px-6 text-left whitespace-nowrap">{maxHours}</td>
      <td className="py-3 px-6 text-left whitespace-nowrap">{assignee}</td>
      <td className="py-3 px-6 text-left break-normal max-w-sm">{description}</td>
      <td className="py-3 px-6 text-left whitespace-nowrap">{status}</td>
      <td className="border-b hover:bg-gray-100">
        <div className="flex item-center justify-center">
          <div className="w-4 mr-2 transform hover:text-blue-600 hover:scale-110" onClick={editJob}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <div className="w-4 mr-2 transform hover:text-blue-600 hover:scale-110" onClick={deleteJob}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        </div>
      </td>
    </tr>
  )
}

const GifForm = ({ emailJob, show, teamMembers }) => {
  const [gifLink, setGifLink] = useState('')

  const sendEmail = () => {
    const members = [teamMembers.splice(1, teamMembers.length), gifLink]
    axios.post('/api/email', members)
  }

  return (
    <div className="bg-white flex flex-col justify-center">
      <div className="relative sm:max-w-xl sm:mx-auto">
        <div className="relative bg-gray-200 px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <div className="flex flex-row">
                <label className="leading-loose">GIF Link</label><img src={"./cool_cat.gif"} alt="" width="30px" className="mx-2 mb-1"/>
              </div>
              <input type="text" value={gifLink} placeholder="https:// ... .gif" onChange={(event) => setGifLink(event.target.value)} className="px-9 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" />
            </div>
          </div>
        <div className="pt-4 flex items-center space-x-4">
          <button onClick={() => show(false)} className="flex justify-center items-center w-full text-gray-900 px-4 py-3 rounded-md focus:outline-none">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> Cancel
          </button>
          <button onClick={sendEmail} className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none">Submit</button>
        </div>
        </div>
      </div>
    </div>
  )
}

const App = () => {
  const [jobs, setJobs] = useState([])
  const [job, setJob] = useState(null)
  const [isEmailButtonDisabled, setIsEmailButtonDisabled] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showGifBox, setShowGifBox] = useState(false)
  const [formType, setFormType] = useState('')
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([{label: 'All'}])
  const [selectedStatus, setSelectedStatus] = useState([
    { value: 'toStart', label: 'To Start' },
    { value: 'inProgress', label: 'In Progress' },
    { value: 'blocked', label: 'Blocked' }
  ])

  const teamMembers = [
    { value: 'all', label: 'All' },
    { value: 'cedric', label: 'Cédric' },
    { value: 'dora', label: 'Dora' },
    { value: 'kelly', label: 'Kelly' },
    { value: 'luke', label: 'Luke' },
    { value: 'mihir', label: 'Mihir' },
    { value: 'vera', label: 'Vera' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'toStart', label: 'To Start' },
    { value: 'inProgress', label: 'In Progress' },
    { value: 'blocked', label: 'Blocked' },
    { value: 'completed', label: 'Completed' }
  ]

  const getJobList = () => {
    jobService
      .getAll()
      .then(initialJobs => {
        const eachJob = initialJobs.map(job => {
          const jobObject = {
            id: job.id,
            jobNumber: job.jobNumber,
            jobLink: job.jobLink,
            dueDate: new Date(job.dueDate),
            maxHours: job.maxHours,
            assignee: job.assignee.map(eachAssignee => ` ${eachAssignee.label}`),
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

  const filterJobs = () => {
    let finalJobs

    const selectedTeamMemberValues = selectedTeamMembers.map(teamMember => ` ${teamMember.label}`)
    const selectedStatusValues = selectedStatus.map(status => status.label)

    if (selectedTeamMemberValues.includes(' All')) {
      finalJobs = jobs
    } else {
      finalJobs = jobs.filter(job => job.assignee.some(eachAssignee => selectedTeamMemberValues.includes(eachAssignee)))
    }

    if (selectedStatusValues.includes('All')) {
      return finalJobs
    } else {
      finalJobs = finalJobs.filter(job => selectedStatusValues.includes(job.status[0].label))
    }

    return finalJobs
  }

  const updateJobList = () => {
    getJobList()
  }

  const closeForm = () => {
    setShowForm(false)
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
    setShowForm(true)
  }

  const showEditForm = (job) => {
    setFormType('edit')
    setJob(job)
    setShowForm(true)
  }

  const emailJobList = () => {
    setIsEmailButtonDisabled(true)
    setShowGifBox(true)
  }

  return (
    <>
      <nav className="bg-gray-200 shadow">
        <div className="mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-800 text-xl font-bold md:text-2xl hover:text-gray-700">HBK Job List</p>
            </div>
          </div>
          <div className="md:flex items-center">
            <div className="flex flex-col md:flex-row md:mx-6">
              <button className={`my-1 text-sm ${isEmailButtonDisabled ? 'text-gray-400 hover:text-blue-300' : 'text-gray-700 hover:text-blue-600'} font-medium md:mx-0 md:my-0`} disabled={isEmailButtonDisabled} onClick={() => emailJobList()}>Email Job List</button>
            </div>
            <div className="flex flex-col md:flex-row md:mx-6">
              <button className="my-1 text-sm text-gray-700 font-medium hover:text-blue-600 md:mr-2 md:my-0" onClick={() => showAddForm()}>Add Job</button>
            </div>
          </div>
        </div>
      </nav>

      <Modal
      isOpen={showForm}
      onRequestClose={() => setShowForm(false)}
      style={{
        overlay: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        },
        content: {
          inset: 'unset',
          padding: 0,
          overflow: 'initial',
          border: 'none'
        }
      }}
      >
        <JobForm formType={formType} job={job} updateJobList={updateJobList} closeForm={closeForm} teamMembers={teamMembers} />
      </Modal>

      <Modal
      isOpen={showGifBox}
      onRequestClose={() => setShowGifBox(false)}
      style={{
        overlay: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        },
        content: {
          inset: 'unset',
          padding: 0,
          overflow: 'initial',
          border: 'none'
        }
      }}
      >
        <GifForm teamMembers={teamMembers} show={setShowGifBox} />
      </Modal>

      {/* <Notification message={message} /> */}
      <div className="min-w-full bg-white pt-12 overflow-y-auto flex items-center justify-center font-sans">
          <div className="w-full pb-80 mx-3 lg:w-full">
              <table className="min-w-max w-full table-auto">
                <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
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
                    <Select
                    defaultValue={selectedStatus}
                    options={statusOptions}
                    onChange={setSelectedStatus}
                    placeholder='Status'
                    isSearchable
                    isMulti
                    />
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {filterJobs().map(job => 
                    <Job
                    key={job.id}
                    jobId = {job.id}
                    jobNumber={job.jobNumber}
                    jobLink={job.jobLink}
                    dueDate={job.dueDate}
                    maxHours={job.maxHours}
                    assignee={`${job.assignee}`}
                    description={job.description}
                    status={job.status[0].label}
                    deleteJob={() => deleteJob(job.id)}
                    editJob={() => showEditForm(job)}
                    />
                  )}
                </tbody>
              </table>
          </div>
        </div>
    </>
  )
}

export default App