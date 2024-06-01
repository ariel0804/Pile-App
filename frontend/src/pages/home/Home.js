import React from 'react'
import { RiProductHuntLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import './Home.scss';
import heroImg from '../../assets/inv-img.png'
import { ShowOnLogin,ShowOnLogout } from '../../components/protect/HiddenLink';

function Home() {
  return (
    <div className='home'>
       <nav className='container --flex-between'>
          <div className='logo'>
            <RiProductHuntLine size={35}/>

          </div>
          <ul className='home-links'>
           <ShowOnLogout>
            <li>
              <Link to= "/register">Register</Link>
            </li>
            </ShowOnLogout>
            <ShowOnLogout>
            <li>
              <button className='--btn --btn-primary'>
              <Link to ="/login">Login</Link>

              </button>
              
            </li>
            </ShowOnLogout>
            
           <ShowOnLogin>
            <li>
              <button className='--btn --btn-primary'>
              <Link to ="/dashboard">Dashboard</Link>

              </button>
              
            </li>
            </ShowOnLogin>
            
          </ul>
       </nav>
      {/* HERO SECTION*/}
      <section className='container hero'>
      
      <div className="hero-text">
        <h2>Inventory & Stock Management Solution</h2>
        <p>
          Inventory system to control and manage your products in real time and integrated to make it easier to develop your business.
        </p>
        <div className="hero-button">
        <button className='--btn --btn-secondary'>
              <Link to ="/register">Free Trial</Link>

              </button>
        </div>
        <div className="--flex-start">
          <Text mainText= "Optimized stock levels for cost savings." 
          otherText=" Our inventory management system ensures your business maintains optimal stock levels, preventing costly stockouts and overstock situations."/>
         <Text mainText= "Boost financial performance with data-driven decisions." 
          otherText="Our inventory management system empowers you to make data-driven decisions that enhance financial performance."/>
         <Text mainText= "Enhance customer satisfaction through efficiency." 
          otherText="Improve customer satisfaction by fulfilling orders promptly and accurately. 
          Our system helps streamline order processing, reduce errors, and ensure you have the right products in stock when customers need them."/>
        </div>

      </div>
      <div className="hero-image">

        <img src={heroImg} alt="Inventory" />
      </div>



      </section>

    </div>
  )
}

const Text = ({mainText,otherText}) => {
  return (
    <div className='--mr'>
      <h3 className='--color-white'>{mainText}</h3>
      <p className='--color-white'>{otherText}</p>
      
    </div>
  )
}

export default Home;