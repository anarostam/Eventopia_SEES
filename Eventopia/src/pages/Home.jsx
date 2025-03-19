import React from 'react'
import image1 from '../../src/images/4.png'

const Home = () => {
  return (
    <div className="s-container">
      <h1>Welcome to Eventopia </h1>

      <div className="card mb-3" style={{ maxWidth: '80em' }}>
        <div className="row g-0">
          <div className="col-md-4">
            <img src={image1} className="img-fluid rounded-start" alt="Description" />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title"> Understanding the Importance of Eventopia </h5>
              <p className="card-text">
                Eventopia is an innovative platform designed to simplify the planning, execution, and management of educational events. Whether it's a conference, seminar, workshop, or webinar, Eventopia streamlines every aspect of event coordination, ensuring a seamless experience for organizers, attendees, and speakers alike.
                <br></br>
                <br></br>

                Our platform's user-friendly interface ensures accessibility and efficiency for all users, from event organizers to participants. Eventopia is here to redefine the future of educational events, helping create dynamic, well-organized, and impactful learning experiences.

              </p>
              {/* <p className="card-text">
                <small className="text-body-secondary">Last updated 3 mins ago</small>
              </p> */}
            </div>
          </div>
        </div>
      </div>
      <div className="card mb-3" style={{ maxWidth: '80em' }}>
        <div className="row g-10">
          <div className="col-md-8 order-md-1">
            <div className="card-body">
              <h5 className="card-title">How it works</h5>
              <p className="card-text">
                With features like event scheduling, stakeholder management, interactive networking, event promotion, and real-time analytics, Eventopia fosters a collaborative learning environment that maximizes engagement and knowledge sharing. The system supports both in-person and virtual events, making it the go-to solution for modern educational event management.
              </p>
              {/* <p className="card-text">
                <small className="text-body-secondary">Last updated 3 mins ago</small>
              </p> */}
            </div>
          </div>
          <div className="col-md-4 order-md-2">
            <img src={image1} className="img-fluid rounded-end" alt="Description" />
          </div>
        </div>
      </div>

      <div class="container">
  <div class="row">
   
    <div class="col-md-4">
      <div class="card">
        <img src="..." class="card-img-top" alt="..."/>
        <div class="card-body">
          <h5 class="card-title">Card title</h5>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        </div>
      </div>
    </div>

   
    <div class="col-md-4">
      <div class="card">
        <img src="..." class="card-img-top" alt="..."/>
        <div class="card-body">
          <h5 class="card-title">Card title</h5>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        </div>
      </div>
    </div>

  
    <div class="col-md-4">
      <div class="card">
        <img src="..." class="card-img-top" alt="..."/>
        <div class="card-body">
          <h5 class="card-title">Card title</h5>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        </div>
      </div>
    </div>
  </div>
</div>


    </div>

  )
}

export default Home