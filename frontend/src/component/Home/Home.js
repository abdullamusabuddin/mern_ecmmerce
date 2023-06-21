import React from 'react'
import { CgMouse } from "react-icons/cg"

export default function Home() {
    return (
        <>
            <div className='banner'>
                <p>Welcome to DUKAAN</p>
                <h1>Find Your Needs below</h1>

                <a href='#Container'>
                    <button>
                        Scroll <CgMouse />
                    </button>
                </a>
            </div>
        </>
    )
}
