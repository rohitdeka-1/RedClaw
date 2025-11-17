import React from 'react'
import Header from './Header/Header'
import Main from './Main/Main'
import AdStrip from './Main/AdStrip'

const Home = () => {
  return (
    <div className='min-h-screen bg-brown-200 '>
      <div>
        <Header/>
        {/* <Header/> */}
        <div  >
        <Main/>
        </div>
      </div>
    </div>
  )
}

export default Home
