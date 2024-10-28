import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/spaces/utilities/getCurrentUser'
import { uploadFile } from '@/spaces/utilities/actions/upload'
import { MediaCategory } from '@/spaces/collections/types'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as MediaCategory
    const alt = formData.get('alt') as string
    const caption = formData.get('caption') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided', code: 'NO_FILE' }, { status: 400 })
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required', code: 'NO_CATEGORY' },
        { status: 400 },
      )
    }

    const media = await uploadFile({
      file,
      category,
      userId: user.id,
      alt,
      caption,
    })

    return NextResponse.json({
      success: true,
      data: media,
    })
  } catch (error) {
    console.error('Upload error:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.name === 'UploadError' ? (error as any).code : 'UNKNOWN_ERROR',
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ error: 'Upload failed', code: 'UNKNOWN_ERROR' }, { status: 500 })
  }
}
