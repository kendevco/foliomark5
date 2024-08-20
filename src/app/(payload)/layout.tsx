/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import configPromise from '@payload-config'
import '@payloadcms/next/css'
import { RootLayout } from '@payloadcms/next/layouts'
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import React from 'react'

import './custom.scss'
<<<<<<< HEAD
import { importMap } from './admin/importMap'
=======
>>>>>>> origin/main

type Args = {
  children: React.ReactNode
}

<<<<<<< HEAD
const Layout = ({ children }: Args) => (
  <RootLayout importMap={importMap} config={configPromise}>
    {children}
  </RootLayout>
)
=======
const Layout = ({ children }: Args) => <RootLayout config={configPromise}>{children}</RootLayout>
>>>>>>> origin/main

export default Layout
