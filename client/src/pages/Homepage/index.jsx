import React, { useState, useEffect } from 'react';
import './index.css';

function HomePage() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/companies')
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error('Error al cargar los datos:', err));
  }, []);

  return (
    <div className="container">
      <aside className="sidebar">
        <h2>DIRECTORIO</h2>
        <ul>
          <li>
            <button
              className={selectedCompany === null ? 'active' : ''}
              onClick={() => setSelectedCompany(null)}
            >
              Ver todos los videos
            </button>
          </li>
          {companies.map((company) => (
            <li key={company.id}>
              <button
                className={selectedCompany?.id === company.id ? 'active' : ''}
                onClick={() => setSelectedCompany(company)}
              >
                {company.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="presentations">
        <h2>PRESENTACIONES</h2>

        {selectedCompany ? (
          <div className="single-video-wrapper">
            <div className="single-video-block">
              <div className="single-video">
                <video
                  src={`http://localhost:5000${selectedCompany.videoUrl}`}
                  controls
                  width="100%"
                  height="100%"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="all-videos">
            {companies.map((company) => (
              <div className="video-card" key={company.id}>
                <div className="phone-frame">
                  <video
                    src={`http://localhost:5000${company.videoUrl}`}
                    controls
                    width="100%"
                    height="100%"
                  />
                </div>
                <p>{company.name}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;
