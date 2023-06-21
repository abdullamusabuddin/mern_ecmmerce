import React from 'react'
import playStore from '../../../assets/images/playstore.png'
import appStore from '../../../assets/images/Appstore.png'
import './footer.css'

export default function Footer() {
    return (
        <footer id='footer'>
            <div className='leftFooter'>
                <h4>Download our APP</h4>
                <p>Download App for Android and IOS</p>
                <img src={playStore} alt='Play store' />
                <img src={appStore} alt='App store' />
            </div>
            <div className='midFooter'>
                <h1>Dukaan</h1>
                <p>High quality is our priority</p>
                <p>Copyright 2022 &copy; Dukaan</p>
            </div>
            <div className='rightFooter'>
                <h4>Follow us</h4>
                <a>Instagram</a>
                <a>Youtube</a>
                <a>Facebook</a>
            </div>
        </footer>
    )
}
