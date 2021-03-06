import React from 'react';
import { Link } from 'gatsby';
import { GatsbyImage, getImage, StaticImage } from 'gatsby-plugin-image';

import { CustomButton } from '../CustomButton/CustomButton.component';
import { TechList } from '../TechList/TechList.component';
import { HeaderBlade } from '../HeaderBlade/HeaderBlade.component';
import { ProjectCardScreenshots } from '../ProjectCardScreenshots/ProjectCardScreenshots.component';

import './ProjectCard.styles.scss';

export const ProjectCard = ({ project, slug }) => {
  const icon = getImage(project.icon);
  return (
    <article className="project-overview">
      <header className="project-overview-header">
        <div className="project-overview-icon">
          {project.type === 'frontend' ? (
            <GatsbyImage image={icon} alt={`${project.name} logo`} />
          ) : (
            <StaticImage
              src="../../../static/img/backend.png"
              alt=""
              placeholder="tracedSVG"
              width={75}
            />
          )}
        </div>
        <HeaderBlade className="project-overview-title">
          <h3>{project.title}</h3>
          <TechList technologies={project.technologies} />
        </HeaderBlade>
      </header>
      {project.type === 'frontend' && (
        <ProjectCardScreenshots screenshots={project.screenshots} />
      )}
      <section className="project-overview-info">
        <div className="project-overview-info-links">
          <CustomButton hyperlink href={project.link}>
            {project.type === 'frontend' ? 'Link' : 'Docs'}
          </CustomButton>
          <CustomButton alternate hyperlink href={project.repo}>
            Repo
          </CustomButton>
        </div>
        <div className="project-overview-info-details">
          <div className="project-overview-info-details-description">
            <p>{project.description}</p>
            <Link to={slug}>More details...</Link>
          </div>
        </div>
      </section>
    </article>
  );
};
