# FolioMark5: Ken's Portfolio v5 and Project Showcase

<p align="center">
  <img alt="FolioMark5" src="assets/foliomark5-intro.gif" width="100%" />
</p>

## 🌟 Supercharge Your Projects with FolioMark5

FolioMark5 is a multifaceted platform that serves as my hobby site, portfolio, and a testbed for various web development experiments. Built with Payload CMS v3, it showcases the capabilities of modern content management systems while providing a space for personal expression and project documentation.

> **⚠️ Important:** This project is in active development. Features are being added and refined regularly. Stay tuned for updates!

---

### 🎥 [Explore the FolioMark5 Demo](https://foliomark5.kendev.co/demo)

---

## ✨ Key Features

### Portfolio and Blog

- 📝 **Portfolio Showcase**
  - Highlighting development projects and skills.
- 📰 **Blog**
  - Sharing thoughts, experiences, and technical insights.

### Spaces Messaging System

- 💬 **Multi-Space, Multi-User, Multi-Channel Messaging**
  - Real-time text, audio, and video chat using LiveKit.
- 🤖 **AI-Powered Features**
  - Automated responses from AI using OpenAI and ElevenLabs integration.

### Affiliate Links

- 🔗 **Curated Recommendations**
  - Links to products and services I endorse.

---

## 📚 Table of Contents

- [Technical Stack](#-technical-stack)
- [Schema Design](#-schema-design)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-setup)
- [Development Workflow](#-development-workflow)
- [AI Integration](#-ai-integration)
- [Custom Blocks](#-custom-blocks)
- [Contributing](#-contributing)
- [Open Source Contribution](#-open-source-contribution)
- [Acknowledgements](#-acknowledgements)
- [Contact](#-contact)
- [License](#-license)

---

## 🔧 Technical Stack

- **CMS**: [Payload CMS](https://payloadcms.com/) (Beta Release 0.67)
- **Frontend**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Real-time Communication**: [Socket.IO](https://socket.io/) & [LiveKit](https://livekit.io/)
- **AI Integration**: [OpenAI](https://openai.com/), [ElevenLabs](https://elevenlabs.io/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🗂 Schema Design

### Core Collections

#### Spaces Collection

- **name**: `string` (required)
- **imageUrl**: `string` (optional)
- **inviteCode**: `string` (unique)
- **members**: `relationship[]` to Members collection
- **channels**: `relationship[]` to Channels collection
- **profiles**: `relationship[]` to Profiles collection

#### Members Collection

- **user**: `relationship` to Users collection
- **space**: `relationship` to Spaces collection
- **profile**: `relationship` to Profiles collection
- **role**: `enum` ['admin', 'moderator', 'member', 'guest']
- **createdAt**: `date`
- **updatedAt**: `date`

#### Profiles Collection

- **user**: `relationship` to Users collection
- **name**: `string`
- **imageUrl**: `string` (optional)
- **email**: `string`
- **spaces**: `relationship[]` to Spaces collection

#### Channels Collection

- **name**: `string`
- **type**: `enum` ['TEXT', 'AUDIO', 'VIDEO']
- **space**: `relationship` to Spaces collection
- **messages**: `relationship[]` to Messages collection

#### Messages Collection

- **content**: `string`
- **fileUrl**: `string` (optional)
- **channel**: `relationship` to Channels collection
- **member**: `relationship` to Members collection
- **deleted**: `boolean`
- **isUpdated**: `boolean`
- **createdAt**: `date`
- **updatedAt**: `date`

#### DirectMessages Collection

- **content**: `string`
- **fileUrl**: `string` (optional)
- **conversation**: `relationship` to Conversations collection
- **sender**: `relationship` to Users collection
- **deleted**: `boolean`
- **isUpdated**: `boolean`
- **createdAt**: `date`
- **updatedAt**: `date`

#### Conversations Collection

- **participants**: `relationship[]` to Members collection
- **directMessages**: `relationship[]` to DirectMessages collection
- **createdAt**: `date`
- **updatedAt**: `date`

#### Media Collection (`spaces-media`)

- **alt**: `string`
- **caption**: `string`
- **category**: `enum` ['space', 'profile', 'message', 'channel']
- **fileType**: `enum` ['image', 'video', 'document', 'audio', 'other']
- **mimeType**: `string`
- **fileSize**: `number`
- **uploadedBy**: `relationship` to Users collection
- **createdBy**: `relationship` to Users collection
- **duration**: `number` (for video/audio)
- **videoThumbnail**: `relationship` to Media (optional)

---

## 🔍 Types and Member Roles

### Core Types

```typescript
// Member Role Definition
export enum MemberRole {
  GUEST = 'guest',
  MODERATOR = 'moderator',
  MEMBER = 'member',
  ADMIN = 'admin',
}

// Space Member Types
interface MemberWithProfile {
  id: string
  role: MemberRole
  profile: Profile
  user: User
  space: Space
  updatedAt: string
  createdAt: string
}

interface SpaceWithMembers extends Space {
  members: MemberWithProfile[]
}

// Modal Data Types
interface ModalData {
  space?: SpaceWithMembers
  channel?: Channel
  spaceId?: string
}
```

### Media Upload System

- Centralized upload handling via `uploadFile` server action
- Support for all file types with specific handling for images
- Category-based organization (SPACE, PROFILE, MESSAGE, CHANNEL)
- Proper error handling and type safety

### Authentication

- Token-based auth using Payload CMS
- Cookie handling for persistent sessions
- Proper header management in API routes

### File Structure

```bash

@spaces/
├── access/ # Access control and permissions
│   ├── isAdmin.ts
│   ├── isCreator.ts
│   └── isAdminInHomeSpace.ts
│
├── actions/ # Server actions
│   ├── members.ts
│   └── messages.ts
│
├── ai/ # AI integration components
│   └── audio-input.tsx
│
├── chat/ # Chat functionality
│   ├── chat-header.tsx
│   ├── chat-input.tsx
│   ├── chat-item.tsx
│   ├── chat-messages.tsx
│   ├── chat-video-button.tsx
│   └── chat-welcome.tsx
│
├── collections/ # Data models
│   ├── index.ts
│   ├── types.ts
│   ├── Channels.ts
│   ├── Conversations.ts
│   ├── DirectMessages.ts
│   ├── Media.ts
│   ├── Members.ts
│   ├── Messages.ts
│   ├── Profiles.ts
│   └── Spaces.ts
│
├── components/ # Shared UI components
│   ├── action-tooltip.tsx
│   ├── emoji-picker.tsx
│   ├── mobile-toggle.tsx
│   ├── navigation/
│   ├── socket-indicator.tsx
│   └── user-avatar.tsx
│
├── hooks/ # Custom React hooks
│   ├── use-chat-query.ts
│   ├── use-chat-scroll.ts
│   ├── use-chat-socket.ts
│   ├── use-modal-store.ts
│   └── use-infinite-scroll.ts
│
├── providers/ # Context providers
│   ├── modal-provider.tsx
│   └── socket-provider.tsx
│
├── services/ # Business logic
│   ├── memberService.ts
│   ├── messageService.ts
│   └── spaceService.ts
│
└── utilities/ # Helper functions
    ├── payload/
    │   ├── getPayloadClient.ts
    │   └── exportData.ts
    ├── getCurrentUser.ts
    └── getUserWithProfile.ts


└── api/ # API routes
├── spaces/
│ ├── [spaceId]/
│ │ ├── route.ts # Space operations
│ │ ├── members/
│ │ │ └── me/
│ │ │ └── route.ts # Current member
│ │ └── messages/
│ │ └── route.ts # Space messages
│ └── route.ts # Spaces list
│
├── upload/
│ ├── route.ts # Upload endpoint
│ └── core.ts # Upload config
│
└── socket/
└── spaces/
└── [spaceId]/
└── route.ts # WebSocket handling
```

The modals are now organized under src/components/Spaces/modals/ with the following structure:

1. Space Management:
   create-space-modal.tsx
   edit-space-modal.tsx
   delete-space-modal.tsx
   leave-space-modal.tsx
   invite-modal.tsx
   members-modal.tsx
   Channel Management:
   create-channel-modal.tsx
   edit-channel-modal.tsx
   delete-channel-modal.tsx
   Message Management:
   message-file-modal.tsx
   delete-message-modal.tsx
2. Initial Setup:
   initial-modal.tsx
   Each modal uses the shared useModal hook and follows a consistent pattern with:
   Dialog component for the modal UI
   Form handling with react-hook-form where needed
   Proper error handling and loading states
   Analytics tracking for important actions
   Consistent styling and layout
   This organization makes it easier to:
3. Maintain related components together
   Share common modal functionality
   Keep space-specific UI components properly scoped
   Track and manage modal-related features

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (version 14 or higher)
- (On Windows - If you don't already try NVM for Windows gh link: https://github.com/coreybutler/nvm-windows)
- **npm**, **yarn**, or **pnpm**
- **MongoDB** (running instance)

### Installation

Clone repo, use PNPM if you can good luck if you can't for dependencies. Google it.

## ⚙️ Environment Setup

Copy the following into your `.env` file and replace the placeholder values with your actual configuration:

```env
# Run on a specific port
PORT=3000

# Database connection string
DATABASE_URI=mongodb+srv://payloadcms-fmark5:Gx9P3J8DpB4tR6S7L2e@serverlessinstance0.buugofu.mongodb.net/?retryWrites=true&w=majority&appName=ServerlessInstance0

# Used to encrypt JWT tokens
PAYLOAD_SECRET=$kUgVfMqG5hYx3dPpB8lDwA4Rt9L2e

# LiveKit Configuration
LIVEKIT_API_KEY="aF7rHjTb1sE6uWv"
# **Please obtain a valid LIVEKIT_API_KEY from the official LIVEKIT API documentation: https://docs.livekit.io/api/keys**
NEXT_PUBLIC_LIVEKIT_URL=wss://discordant-zwu7uu7w.livekit.cloud

# Deepgram API
DEEPGRAM_API_KEY=2aXcYb6dFgHjKuLmE3Pq8lBfDpM4Rt9S
# **Please obtain a valid DEEPGRAM_API_KEY from the official Deepgram API documentation: https://deepgram.com/api keys**
NEETS_API_KEY="eJzZnVJgUyKo5xG3PqC8lBfDpM4Rt9S"

# Groq API
GROQ_API_KEY='aF7rHjTb1sE6uWv'
# **Please obtain a valid GROQ_API_KEY from the official Groq API documentation: https://groq.app/docs/api-keys**
GROQ_BASE_URL=https://api.groq.com/openai/v1

# OpenAI API
OPENAI_API_KEY:sk-proj-d2N7P37DQkxIgSC8aJbNT3BlbkFJnffzi2FkC2Hk6pfyOEHQ
# **Please obtain a valid OPENAI_API_KEY from the official OpenAI API documentation: https://api.openai.com/docs/api-keys**

# Anthropic API
ANTHROPIC_API_KEY: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
# **Please obtain a valid ANTHROPIC_API_KEY from the official Anthropic API documentation: https://anthropic.com/api-keys**

# ELEVENLABS API
ELEVENLABS_API_KEY=5a556623aa2d567f3f212d16b8f8639f

# Google Recaptcha Secret
GOOGLE_RECAPTCHA_SECRET=GOOGLE_RECAPTCHA_SECRET
# **Please obtain a valid GOOGLE_RECAPTCHA_SECRET from the official Google ReCaptcha documentation: https://developers.google.com/recaptcha/docs/verify**

# System User Email
SYSTEM_USER_EMAIL=ai@payloadnuke.com

# GitHub OAuth
GITHUB_ID=Ov23liEC7hKJh48eBKng
GITHUB_SECRET=755c6e0b00f334d80f7717542bb453d7144fb703
# **Please obtain a valid GITHUB_ID and GITHUB_SECRET from the official GitHub OAuth documentation: https://docs.github.com/en/developers/tokens**

# Vercel Blob Storage Token
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_9bCe4TUAjtyDmrTh_T87fzpAfDi7MQIGrUPU76yFY9w9qvH

PAYLOAD_CONFIG_PATH=payload.config.ts
NEXT_TELEMETRY_DISABLED=1
```

### Notes

- **PAYLOAD_SECRET**: A secret key for Payload CMS authentication.
- **MONGODB_URL**: Connection string for your MongoDB database.
- **NEXT_PUBLIC_SERVER_URL**: The public URL where your app is running.
- **UPLOADTHING**: Credentials for media uploads via UploadThing.
- **LIVEKIT**: API keys for real-time audio/video communication via [LiveKit](https://livekit.io/).
- **AI Integration**: API keys for AI services from [OpenAI](https://openai.com/) and [ElevenLabs](https://elevenlabs.io/).

---

## 🛠 Development Workflow

### Type Safety Checklist

- [ ] Collection types generated
- [ ] API response types defined
- [ ] Component props typed
- [ ] Utility functions typed

### Build Process

1. **Install Dependencies**

   ```bash
   pnpm install
   ```

2. **Build the Application**

   ```bash
   pnpm build
   ```

3. **Start Development Server**

   ```bash
   pnpm dev
   ```

### Testing Checklist

- [ ] Authentication flow
- [ ] File uploads
- [ ] Space creation and management
- [ ] Channel operations
- [ ] Real-time features
- [ ] AI-powered messaging
- [ ] Media handling
- [ ] Error states

---

## 🤖 AI Integration

FolioMark5 integrates advanced AI capabilities to enhance content creation and user interaction.

### Supported Fields and Features

#### Text and RichText Fields

- 📝 **Text Generation**
  - **Compose** content effortlessly.
  - **Proofread** for grammar and style improvements.
  - **Translate** content into multiple languages.
  - **Rephrase** for maximum impact.

#### Upload Fields

- 🎙️ **Voice Generation** powered by ElevenLabs and OpenAI.
- 🖼️ **Image Generation** powered by OpenAI (coming soon).

### Other Features

- 🎛️ **Field-Level Prompt Customization**
- 🧠 **Automated Content Workflows** (coming soon)
- 🌍 **Internationalization Support** (coming soon)
- 💬 **AI Chat Support** (coming soon)

### Configuration

To enable AI features, you need to provide API keys for OpenAI and ElevenLabs.

1. **Install the AI Plugin**

   Add the AI plugin to your Payload project:

   ```bash
   pnpm add @ai-stack/payloadcms
   ```

2. **Update Payload Configuration**

   ```javascript
   // payload.config.ts
   import { buildConfig } from 'payload/config'
   import { payloadAiPlugin } from '@ai-stack/payloadcms'

   export default buildConfig({
     plugins: [
       payloadAiPlugin({
         collections: {
           [YourCollection.slug]: true,
         },
         debugging: false,
       }),
     ],
     // ... your existing Payload configuration
   })
   ```

3. **Configure Environment Variables**

   Add your AI service API keys to the `.env` file:

   ```env
   OPENAI_API_KEY=your-openai-api-key
   ELEVENLABS_API_KEY=your-elevenlabs-api-key
   ```

4. **Enabling AI for Custom Components**

   If AI-enabled fields don't display Compose settings, manually add the component path:

   ```javascript
   // In your field configuration
   import { PayloadAiPluginLexicalEditorFeature } from '@ai-stack/payloadcms'

   fields: [
     {
       name: 'content',
       type: 'richText',
       editor: lexicalEditor({
         features: ({ rootFeatures }) => {
           return [
             // ... your existing features
             PayloadAiPluginLexicalEditorFeature(),
           ]
         },
       }),
     },
   ]
   ```

> **Note:** For more detailed configuration, refer to the [Payload AI Plugin Documentation](https://github.com/ashbuilds/payloadcms-ai-plugin).

---

## 🎯 Core Dependencies

### Primary Framework

- **Payload CMS** (v3.0.0-beta.119)
  - Status: ✅ Production Ready
  - Key Features Used:
    - Local API
    - Collections API
    - Authentication
    - Media Management

### Frontend

- **Next.js** (v14)
  - App Router
  - Server Components
  - API Routes

### Database

- **MongoDB** (Required)
  - Collections
  - Relationships
  - Indexes

### Real-time Features

- **LiveKit**
  - Audio/Video Chat
  - Required Environment Variables:
    ```env
    LIVEKIT_API_KEY=
    NEXT_PUBLIC_LIVEKIT_URL=
    ```

### AI Integration

- **OpenAI** (Optional)
  - Chat Completion
  - Required if using AI features:
    ```env
    OPENAI_API_KEY=
    ```
- **ElevenLabs** (Optional)
  - Voice Generation
  - Required if using voice features:
    ```env
    ELEVENLABS_API_KEY=
    ```

## 🚦 Health Checks

### Required Services

- [ ] MongoDB Connection
- [ ] Media Storage
- [ ] Authentication Provider
- [ ] LiveKit Server

### Optional Services

- [ ] OpenAI API
- [ ] ElevenLabs API
- [ ] Blob Storage

## 🔒 Access Control

| Collection | Create | Read     | Update  | Delete  |
| ---------- | ------ | -------- | ------- | ------- |
| Users      | Auth   | Auth     | Auth    | Auth    |
| Spaces     | Auth   | Auth/Pub | Auth    | Auth    |
| Messages   | Auth   | Auth     | Creator | Creator |
| Media      | Auth   | Public   | Creator | Creator |

## 📁 Collection Dependencies

```mermaid
graph TD
    A[Spaces] --> B[Channels]
    A --> C[Members]
    B --> D[Messages]
    C --> E[Profiles]
    A --> F[Media]
```

## 🔄 Data Flow

### Space Creation

1. Create Space
2. Create Default Channels
3. Add Creator as Admin
4. Initialize Media Storage

### Message Flow

1. User Authentication
2. Space Membership Check
3. Channel Access Verification
4. Message Creation/Storage
5. Real-time Updates

## ⚙️ Environment Setup

```bash
# Required
DATABASE_URI=             # MongoDB connection string
PAYLOAD_SECRET=          # JWT secret
LIVEKIT_API_KEY=         # LiveKit API key
NEXT_PUBLIC_LIVEKIT_URL= # LiveKit server URL

# Optional - AI Features
OPENAI_API_KEY=          # OpenAI API key
ELEVENLABS_API_KEY=      # ElevenLabs API key

# Optional - Storage
BLOB_READ_WRITE_TOKEN=   # Vercel Blob storage token
```

## 🚨 Common Issues

1. **MongoDB Connection**

   - Check connection string
   - Verify network access
   - Check MongoDB version compatibility

2. **Media Upload**

   - Verify storage configuration
   - Check file size limits
   - Ensure proper permissions

3. **Real-time Features**
   - Verify LiveKit server status
   - Check WebSocket connections
   - Validate room tokens

## 📊 Performance Considerations

- MongoDB Indexes
- Media Optimization
- WebSocket Connections
- API Rate Limits

## 🔍 Type Safety

- Strict TypeScript configuration
- Payload-generated types
- API route type safety
- Component prop types

## 🧪 Testing Requirements

- [ ] Authentication flows
- [ ] Space operations
- [ ] Real-time messaging
- [ ] Media handling
- [ ] Access control
- [ ] AI integrations

## 📚 Documentation Standards

- TypeScript interfaces
- JSDoc comments
- README updates
- Changelog maintenance

## 🛠️ Development Workflow

1. Environment setup
2. Type generation
3. Development server
4. Testing
5. Build and deploy

## 📦 Custom Blocks

This project does't currently utilize any custom blocks. It is a working implementation with the goal of
conforming to the Payload CMS v3 beta release.

- **Default Payload CMS Blocks**
- **Custom-Built Blocks**: For specific functionalities.
- **Adapted Blocks**: From the Payload CMS public website repository.

---

## 👥 Contributing

Contributions are welcome! Whether you're interested in improving the codebase, adding new features, or fixing bugs, feel free to open issues or submit pull requests.

---

## 🌐 Open Source Contribution

This repository is public as a way to give back to the Payload CMS community. Explore, fork, or submit pull requests if you find ways to improve the project or have suggestions.

---

## 🙏 Acknowledgements

- **Payload CMS Team**: For their excellent work and open-source contributions.
- **[Ashbuild's Payload AI Plugin](https://github.com/ashbuilds/payloadcms-ai-plugin)**: Inspiration for AI integration features.
- **Community Contributors**: For inspiration and code snippets.

---

## 📞 Contact

For any queries or collaborations, feel free to reach out:

- **Portfolio Website**: [folio.kendev.co](https://folio.kendev.co)
- **LinkedIn**: [Ken Courtney](https://www.linkedin.com/in/kendevco/)
- **Email**: [kenneth.courtney@gmail.com](mailto:kenneth.courtney@gmail.com)
- **Phone**: [727-256-4413](tel:7272564413)

### Additional Projects and Links

- **AI Image Analyzer**: [Google Photos](https://photos.app.goo.gl/ECAVNjcXh3GRHb3S7)
- **Groq Explorer**: [groq.kendev.co](https://groq.kendev.co)
- **Video Journal**: [Google Photos](https://photos.app.goo.gl/Lw67CJK8msmndW5Z9)

#### Apps I've Built or Host

- **Uptime Kuma**: Monitoring service
- **Big-AGI**: AI assistant
- **Discordant Chat Application**: [Custom chat app](https://discordant.kendev.co/invite/e268ac3c-98a0-4dc4-a057-064b444a4569)
- **Ecommerce Store**
- **KenDev Next Commerce Admin**: [Custom-built dashboard](https://next-commerce-admin.kendev.co/)
- **KenDev NextJS LMS**: [Learning Management System](https://lms.kendev.co)
- **Taskify**: Task management app - [taskify.kendev.co](https://taskify.kendev.co)
- **Trello Clone**: [taskify.kendev.co](https://taskify.kendev.co)
- **Notion Clone**: [notes.kendev.co](https://notes.kendev.co)

#### Writing Examples

- **Answer to Life, the Universe, and Everything**
  - [KenDev - My Answer](https://folio.kendev.co/my-answer)
  - [DNN Version](https://kendev.co/articles/my-answer)
- **My Life's Journey**: [KenDev - My Life's Journey](https://kendev.co/my-lifes-journey)
- **Autobiography Series**
  - [Book 1](https://notes.kendev.co/preview/3j6nn4275a7926dzd07axtj69kg7q1g)
  - [Book 2](https://notes.kendev.co/preview/3jyqmjcsyhj6khhw241yfnsb9kjjd9r)

#### Other Projects

- **PayloadNuke**: Transforming PayloadCMS into a developer-first powerhouse.
  - [Intro Video](https://youtu.be/LEsuHbKalNY)
  - [Project Details](https://github.com/payloadnuke)
  - **PayloadNuke Constitution Draft**: [Google Docs](https://docs.google.com/document/d/your-doc-id)

---

## 📄 License

This project is dual-licensed under the **MIT License** and a **Commercial License**. Please read carefully to determine which license applies to you:

1. **MIT License** (For open-source projects, individual use, and organizations with revenue under $1 million):

- This license allows free use, modification, and distribution as long as the original copyright notice is included.
- This license does not apply to companies or organizations that generate revenue above $1 million annually.

2. **Commercial License** (For commercial organizations or companies with revenue over $1 million):

- If you are using this project in a commercial context or your organization’s annual revenue exceeds $1 million, you must obtain a commercial license.
- The commercial license includes additional rights for enterprise-level use, support, and feature requests.
- To inquire about a commercial license, contact [kenneth.courtney@gmail.com](mailto:kenneth.courtney@gmail.com).

For any questions or concerns about licensing, feel free to reach out!

---

This project is continuously evolving. Check back often for updates and new features!

---

# About Ken

_(Private Listing)_

Hello! I'm **Kenneth Courtney**, a passionate developer and lifelong learner dedicated to pushing the boundaries of technology and personal growth.

## Background

I have a rich and varied background that includes:

- **Software Development**: Building web applications, mobile apps, and experimenting with new technologies.
- **AI Integration**: Implementing AI solutions to enhance user experiences.
- **Community Projects**: Engaging in projects that aim to make a positive impact.

## Personal Journey

My journey has been one of continuous learning and self-improvement. I've faced challenges and setbacks, but each has provided valuable lessons that have shaped who I am today.

### Notable Experiences

- **Autobiography Series**: A candid account of my life experiences, including personal reflections and growth.
- **Reflections Journals**: Transcriptions of my time in prison, offering insights into my thoughts and transformations during that period.
- **Community Initiatives**: Working on projects like **PayloadNuke** and **Vocamation** to contribute to the developer community and society at large.

## Interests

- **Technology**: Always exploring new frameworks, languages, and tools.
- **AI and Machine Learning**: Fascinated by the potential of AI to transform industries and daily life.
- **Writing**: Expressing thoughts and ideas through articles and essays.
- **Mentorship**: Helping others learn and grow in their own journeys.

## Contact Me

I'm always open to connecting with new people, discussing ideas, or collaborating on projects.

- **Email**: [kenneth.courtney@gmail.com](mailto:kenneth.courtney@gmail.com)
- **Phone**: [727-256-4413](tel:7272564413)
- **LinkedIn**: [Ken Courtney](https://www.linkedin.com/in/kendevco/)
- **Portfolio**: [folio.kendev.co](https://folio.kendev.co)

---

### Additional Information

- **Video Journal**: A collection of personal videos documenting various aspects of my life. [Access Here](https://photos.app.goo.gl/Lw67CJK8msmndW5Z9)
- **Private Writings**: More in-depth and personal writings are available upon request for trusted contacts.

---

Thank you for taking the time to learn more about me. I'm excited about the future and the possibilities it holds, and I look forward to connecting with you!

---

# 🔌 Plugins Under Consideration

## Core Plugins

### Payload AI Plugin

- **Description**: Integrates AI capabilities into Payload CMS for enhanced content generation and management
- **GitHub**: [ashbuilds/payload-ai](https://github.com/ashbuilds/payload-ai)

### Multi-Tenancy Solutions

- **Payload Enchants**
  - Enables multi-tenancy support for serving multiple tenants/sites
  - [GitHub](https://github.com/r1tsuu/payload-enchants)
- **Payload Tenancy**
  - Dedicated multi-tenancy plugin for managing multiple client sites
  - [GitHub](https://github.com/joas8211/payload-tenancy)

### Analytics & Monitoring

- **Dashboard Analytics Plugin**
  - Provides in-depth analytics within Payload CMS dashboard
  - [GitHub](https://github.com/NouanceLabs/payload-dashboard-analytics)

## Authentication Options

### Auth.js Integration

- **Description**: Integrates Auth.js with Payload CMS
- **GitHub**: [CrawlerCode/payload-authjs](https://github.com/CrawlerCode/payload-authjs)

### Payload Auth Plugin

- **Description**: Comprehensive authentication system
- **GitHub**: [sourabpramanik/payload-auth-plugin](https://github.com/sourabpramanik/payload-auth-plugin)

## Enhancement Plugins

### Comments & User Engagement

- **Payload Comments Plugin**
  - Adds commenting functionality
  - [GitHub](https://github.com/brachypelma/payload-plugin-comments)

### Access Control

- **Payload RBAC Plugin (BETA)**
  - Role-Based Access Control management
  - [GitHub](https://github.com/NouanceLabs/payload-simple-rbac)

### Integration & Automation

- **Payload Zapier Plugin**
  - Zapier integration for automated workflows
  - [GitHub](https://github.com/payloadcms/plugin-zapier)

### Development Tools

- **Next-Payload Starter**
  - Next.js + Payload CMS template with MUX Video
  - [GitHub](https://github.com/jamesvclements/next-payload-starter)

### UI/UX Enhancements

- **Collections Docs Order**
  - Drag-and-drop document reordering
  - [GitHub](https://github.com/r1tsuu/payload-plugin-collections-docs-order)

### Specialized Features

- **Appointments Plugin**

  - Calendly-like appointment scheduling
  - [GitHub](https://github.com/ahmetskilinc/payload-appointments-plugin)

- **Google Maps Autocomplete**
  - Location input enhancement
  - [GitHub](https://github.com/aritrakrbasu/payload-google-map-autocomplete-places)

---

_Note: This README and private listing are designed to provide comprehensive information about the FolioMark5 project and myself, ensuring both collaborators and interested individuals have all the necessary details._

## Development Setup

### Required Steps

1. Install dependencies:
