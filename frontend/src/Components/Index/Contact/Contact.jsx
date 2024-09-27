import React from 'react'
import './Contact.css'
import image from '../../../assets/msg-icon.png'
import mail from '../../../assets/mail-icon.png'
import phone from '../../../assets/phone-icon.png'
import address from '../../../assets/location-icon.png'
import white from '../../../assets/white-arrow.png'

const Contact = () => {

  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "5a3f89f6-afde-4a88-8e30-64146370f2cb");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div className='contact'>
        <div className='contact-col'>
            <h3>Send us a message <img src={image}/></h3>
            <p>If you have any query regarding Kalakaar, you can message us. Please give your working so that we can answer you. you will be answered in 48 hours</p>
            <ul>
                <li> <img src={mail} /> kalakaar2024@gmail.com</li>
                <li> <img src={phone} /> 0310-4703376</li>
                <li> <img src={address} /> 
                Lahore Cantt, Pakistan</li>
            </ul>
        </div>
        <div className="contact-col">
          <form onSubmit={onSubmit}>
             <label>Your name</label>
             <input type="text" name='name' placeholder='Enter your name' required/>
             <label>Email address</label>
             <input type="tel" name='phone' placeholder='Enter your email' required/>
             <label>Write your message here</label>
             <textarea name="message" rows='6' placeholder='Enter your message' required></textarea>
             <button className='btn'>Submit now <img src={white}/></button>
          </form>
          <span>{result}</span>
        </div>
    </div>
  )
}

export default Contact