import { getPayloadClient } from '@/spaces/utilities/payload/getPayloadClient'
import { exportData } from '@/spaces/utilities/payload/exportData'
import fs from 'fs/promises'

export async function GET() {
  try {
    const payload = await getPayloadClient()

    // Create the export directory if it doesn't exist
    const outputDir = 'cache/exports'
    await fs.mkdir(outputDir, { recursive: true })

    await exportData({
      payload,
      outputDir,
    })

    return new Response('Export completed successfully', { status: 200 })
  } catch (error) {
    console.error('Export failed:', error)
    return new Response('Export failed: ' + error.message, { status: 500 })
  }
}
