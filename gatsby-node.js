const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // template for project page
  const projectPage = path.resolve(`./src/templates/project-page.jsx`)

  // Get all markdown projects sorted by date
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: ASC }
          limit: 1000
        ) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your projects`,
      result.errors
    )
    return
  }

  const projects = result.data.allMarkdownRemark.nodes

  if (projects.length > 0) {
    projects.forEach((project, index) => {
      const previousProjectId = index === 0 ? null : projects[index - 1].id
      const nextProjectId =
        index === projects.length - 1 ? null : projects[index + 1].id

      createPage({
        path: project.fields.slug,
        component: projectPage,
        context: {
          id: project.id,
          previousProjectId,
          nextProjectId,
        },
      })
    })
  }
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes, createFieldExtension } = actions;

  createFieldExtension({
    name: 'fileByDataPath', // we'll use it in createTypes as `@fileByDataPath`
    extend: () => ({
      resolve: function (src, args, context, info) {
        // look up original string, i.e img/photo.jpg
        const { fieldName } = info
        const partialPath = src[fieldName]
          if (!partialPath) {
            return null
          }
    
        // get the absolute path of the image file in the filesystem
        const filePath = path.join(
          __dirname,
          'static',
          partialPath
        )
    
        // look for a node with matching path
        // check out the query object, it's the same as a regular query filter
        const fileNode = context.nodeModel.runQuery({
          firstOnly: true,
          type: 'File',
          query: {
            filter: {
              absolutePath: {
                eq: filePath
              }
            }
          }
        })
    
        // no node? return
        if (!fileNode) {
          return null
        }
    
        // else return the node
        return fileNode
      },             // the resolve function above
    })
  })
  

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type Author {
      name: String
      summary: String
    }

    type Social {
      github: String
      linkedin: String
    }
    
    type SiteSiteMetadata {
      title: String
      author: Author
      description: String
      siteUrl: String
      social: Social
    }

    type MarkdownRemark implements Node @infer {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Screenshot @infer {
      screenshot: File @fileByDataPath
    }

    type Frontmatter @infer {
      title: String
      description: String
      date: Date @dateformat
      icon: File @fileByDataPath
      screenshots: [Screenshot]
    }

    type Fields {
      slug: String
    }

    type SkillsYaml implements Node @infer {
      image: File @fileByDataPath
      name: String
      description: String
      level: Int
    }

  `);
};
