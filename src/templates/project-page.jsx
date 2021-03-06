import * as React from 'react';
import { graphql } from 'gatsby';
import { getImage } from 'gatsby-plugin-image';

import { useModal } from '../libs/useModal';

import Layout from '../components/Layout';
import Seo from '../components/seo';
import { HeaderBlade } from '../components/HeaderBlade/HeaderBlade.component';
import { ProjectLinks } from '../components/ProjectLinks/ProjectLinks.component';
import { ImageModal } from '../components/ImageModal/ImageModal.component';
import { ScreenshotCarousel } from '../components/ScreenshotCarousel/ScreenshotCarousel.component';
import { BackButton } from '../components/BackButton/BackButton.component';

import './project-page.styles.scss';
import { ScreenshotSlide } from '../components/ScreenshotSlide/ScreenshotSlide.component';

const ProjectPageTemplate = ({ data }) => {
  const {
    html,
    frontmatter: {
      title,
      description,
      headline,
      type,
      repo,
      link,
      screenshots,
    },
  } = data.markdownRemark;
  const { modalActive, modalIndex, openModal, closeModal, scrollModal } =
    useModal(screenshots);

  return (
    <>
      {modalActive && (
        <ImageModal
          modalIndex={modalIndex}
          imageList={screenshots}
          scrollModal={scrollModal}
          closeModal={closeModal}
        />
      )}
      <header className="project-page-header page-header">
        <HeaderBlade className="project-page-title page-title">
          <BackButton />
          <h1 itemProp="headline">{title}</h1>
        </HeaderBlade>
      </header>
      <Layout className="project-page">
        <Seo title={title} description={description} />
        <article
          className="project-page-article page-section"
          itemScope
          itemType="https://schema.org/SoftwareApplication"
        >
          <header className="project-article-header">
            <h2>{headline}</h2>
          </header>
          <ProjectLinks
            type={type}
            repo={repo}
            link={link}
            className="project-page-links"
          />
          <div className="project-article-content">
            <section
              dangerouslySetInnerHTML={{ __html: html }}
              itemProp="articleBody"
              className="project-article-body"
            />
            {type === 'frontend' && (
              <section className="project-page-screenshots">
                <h3>Screenshots</h3>
                <ul className="project-page-screenshot-grid">
                  {screenshots.map((el, i) => {
                    const image = getImage(el.screenshot);
                    return (
                      <li
                        key={el}
                        className="project-page-screenshot-grid-item"
                      >
                        <ScreenshotSlide
                          image={image}
                          openModal={() => openModal(i)}
                        />
                      </li>
                    );
                  })}
                </ul>
                <ScreenshotCarousel
                  screenshots={screenshots}
                  openModal={openModal}
                  className="project-page-screenshot-carousel"
                />
              </section>
            )}
          </div>
        </article>
      </Layout>
    </>
  );
};

export default ProjectPageTemplate;

export const pageQuery = graphql`
  query ProjectBySlug(
    $id: String! # $previousProjectId: String # $nextProjectId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        headline
        type
        repo
        link
        screenshots {
          screenshot {
            childImageSharp {
              gatsbyImageData(
                placeholder: BLURRED
                transformOptions: { fit: CONTAIN }
                formats: [JPG]
                quality: 90
              )
            }
          }
        }
      }
    }
    # previous: markdownRemark(id: { eq: $previousProjectId }) {
    #   fields {
    #     slug
    #   }
    #   frontmatter {
    #     title
    #   }
    # }
    # next: markdownRemark(id: { eq: $nextProjectId }) {
    #   fields {
    #     slug
    #   }
    #   frontmatter {
    #     title
    #   }
    # }
  }
`;
