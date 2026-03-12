import mystrFounder from '../assets/mystr-founder.png';

export default function OurTeam() {
  return (
    <div className="page-content-inner">
      <h1 className="page-title">Our Team</h1>
      <p className="page-lead">
       
      </p>
      <div className="team-member">
        <img
          src={mystrFounder}
          alt="Asif Khan"
          className="team-member-photo"
        />
        <div className="team-member-info">
          <p className="team-member-name">Asif Khan</p>
          <p className="team-member-title">Founder and Tech Lead</p>
          <p className="team-member-detail">IIT Alumni</p>
          <p className="team-member-detail">Software Engineer - J P Morgan</p>
        </div>
      </div>
    </div>
  );
}
