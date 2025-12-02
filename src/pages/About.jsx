import React from "react";

const About = () => {
  const team = [
    { name: "John Doe", role: "CEO", experience: "10+ years" },
    { name: "Jane Smith", role: "CTO", experience: "8+ years" },
    { name: "Mike Johnson", role: "Lead Developer", experience: "6+ years" },
  ];

  const companyInfo = {
    founded: "2020",
    mission: "Building innovative web solutions",
    location: "San Francisco, CA",
  };

  return (
    <div>
      <h1>About Us</h1>
      <p>Learn more about our team and company mission.</p>

      <section>
        <h2>Our Team</h2>
        <ul>
          {team.map((member, index) => (
            <li key={index}>
              <strong>{member.name}</strong> - {member.role} (
              {member.experience})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Company Info</h2>
        <p>Founded in {companyInfo.founded}</p>
        <p>{companyInfo.mission}</p>
        <p>Location: {companyInfo.location}</p>
      </section>
    </div>
  );
};

export default About;
