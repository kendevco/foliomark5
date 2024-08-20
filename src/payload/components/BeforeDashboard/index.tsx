import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to your dashboard!</h4>
      </Banner>
      Here&apos;s what to do next:
      <ul className={`${baseClass}__instructions`}>
        <li>
          <SeedButton />
          {' with a few pages, posts, and projects to jump-start your new site, then '}
          <a href="/" target="_blank">
            visit your website
          </a>
          {' to see the results.'}
        </li>
        <li>
<<<<<<< HEAD
          If you created this repo using Payload Cloud, head over to GitHub and clone it to your
          local machine. It will be under the <i>GitHub Scope</i> that you selected when creating
          this project.
        </li>
        <li>
          {'Modify your '}
          <a
            href="https://payloadcms.com/docs/configuration/collections"
=======
          {'Modify your '}
          <a
            href="https://payloadcms.com/docs/beta/configuration/collections"
>>>>>>> origin/main
            rel="noopener noreferrer"
            target="_blank"
          >
            collections
          </a>
          {' and add more '}
          <a
<<<<<<< HEAD
            href="https://payloadcms.com/docs/fields/overview"
=======
            href="https://payloadcms.com/beta/docs/fields/overview"
>>>>>>> origin/main
            rel="noopener noreferrer"
            target="_blank"
          >
            fields
          </a>
          {' as needed. If you are new to Payload, we also recommend you check out the '}
          <a
<<<<<<< HEAD
            href="https://payloadcms.com/docs/getting-started/what-is-payload"
=======
            href="https://payloadcms.com/beta/docs/getting-started/what-is-payload"
>>>>>>> origin/main
            rel="noopener noreferrer"
            target="_blank"
          >
            Getting Started
          </a>
          {' docs.'}
        </li>
        <li>
          Commit and push your changes to the repository to trigger a redeployment of your project.
        </li>
      </ul>
      {'Pro Tip: This block is a '}
      <a
<<<<<<< HEAD
        href="https://payloadcms.com/docs/admin/components#base-component-overrides"
=======
        href="https://payloadcms.com/docs/beta/admin/components#base-component-overrides"
>>>>>>> origin/main
        rel="noopener noreferrer"
        target="_blank"
      >
        custom component
      </a>
      , you can remove it at any time by updating your <strong>payload.config</strong>.
    </div>
  )
}

export default BeforeDashboard
