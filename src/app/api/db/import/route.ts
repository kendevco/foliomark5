import { getPayloadClient } from '@/spaces/utilities/payload/getPayloadClient'
import { seed } from '@/endpoints/seed'

export async function POST() {
  try {
    const payload = await getPayloadClient()
    await seed(payload)

    return new Response(
      JSON.stringify({
        message: 'Data imported successfully',
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error('Import error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to import data',
      }),
      { status: 500 },
    )
  }
}
