import React, { useState, useEffect } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './Portfolio.css'

const Portfolio: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [headerRef, isHeaderVisible] = useScrollAnimation(0.2)
  const [projectsRef, isProjectsVisible] = useScrollAnimation(0.1)

  const projects = [
    {
      id: 1,
      title: "3D Art Gallery",
      description: "Galeri seni 3D interaktif dengan navigasi WASD dan mouse look",
      image: "/api/placeholder/400/300",
      technologies: ["Three.js", "React", "TypeScript"],
      category: "3D Web"
    },
    {
      id: 2,
      title: "Portfolio Website",
      description: "Website portofolio modern dengan desain responsif",
      image: "/api/placeholder/400/300",
      technologies: ["React", "Vite", "CSS3"],
      category: "Web Development"
    },
    {
      id: 3,
      title: "3D Model Showcase",
      description: "Showcase model 3D dengan interaksi real-time",
      image: "/api/placeholder/400/300",
      technologies: ["Three.js", "WebGL", "JavaScript"],
      category: "3D Web"
    },
    {
      id: 4,
      title: "Interactive Dashboard",
      description: "Dashboard interaktif dengan visualisasi data 3D",
      image: "/api/placeholder/400/300",
      technologies: ["React", "D3.js", "Three.js"],
      category: "Data Visualization"
    }
  ]

  const categories = ["All", "3D Web", "Web Development", "Data Visualization"]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeFilter)

  return (
    <div className="portfolio">
      <div className="portfolio-header" ref={headerRef}>
        <div className="container">
          <h1 className={`page-title ${isHeaderVisible ? 'animate-in' : ''}`}>Portfolio</h1>
          <p className={`page-subtitle ${isHeaderVisible ? 'animate-in' : ''}`}>
            Koleksi proyek 3D dan web development yang telah saya buat
          </p>
        </div>
      </div>

      <div className="portfolio-content">
        <div className="container">
          <div className={`filter-tabs ${isHeaderVisible ? 'animate-in' : ''}`}>
            {categories.map((category, index) => (
              <button 
                key={category}
                className={`filter-tab ${activeFilter === category ? 'active' : ''}`}
                onClick={() => setActiveFilter(category)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="projects-grid" ref={projectsRef}>
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                className={`project-card ${isProjectsVisible ? 'animate-in' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="project-image">
                  <div className="image-placeholder">
                    <span>🎨</span>
                  </div>
                  <div className="project-overlay">
                    <button className="view-project">
                      <span>View Project</span>
                      <div className="btn-bg"></div>
                    </button>
                  </div>
                </div>
                <div className="project-content">
                  <div className="project-category">{project.category}</div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-technologies">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Portfolio
