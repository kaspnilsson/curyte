//import a from 'next/link'
import React from 'react'
import { IconButton } from '@chakra-ui/react'
import { Profile } from '@prisma/client'

type Props = {
  profile: Profile
}

const prefixUrlIfNeeded = (url: string) => {
  if (!url.startsWith('http')) url = `http://${url}`
  return url
}

const Socialas = ({ profile }: Props) => {
  return (
    <div className="flex items-center">
      {profile.twitterUrl && (
        <a
          target="_blank"
          href={prefixUrlIfNeeded(profile.twitterUrl)}
          rel="noreferrer"
        >
          <IconButton
            variant="link"
            aria-label="Twitter link"
            icon={
              <svg
                className="w-5 h-5 m-2 hover:text-zinc-700"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-.139 9.237c.209 4.617-3.234 9.765-9.33 9.765-1.854 0-3.579-.543-5.032-1.475 1.742.205 3.48-.278 4.86-1.359-1.437-.027-2.649-.976-3.066-2.28.515.098 1.021.069 1.482-.056-1.579-.317-2.668-1.739-2.633-3.26.442.246.949.394 1.486.411-1.461-.977-1.875-2.907-1.016-4.383 1.619 1.986 4.038 3.293 6.766 3.43-.479-2.053 1.08-4.03 3.199-4.03.943 0 1.797.398 2.395 1.037.748-.147 1.451-.42 2.086-.796-.246.767-.766 1.41-1.443 1.816.664-.08 1.297-.256 1.885-.517-.439.656-.996 1.234-1.639 1.697z"
                />
              </svg>
            }
          />
        </a>
      )}
      {profile.personalUrl && (
        <a
          target="_blank"
          href={prefixUrlIfNeeded(profile.personalUrl)}
          rel="noreferrer"
        >
          <IconButton
            variant="link"
            aria-label="Personal website link"
            icon={
              <svg
                className="w-5 h-5 m-2 hover:text-zinc-700"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.971.165zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753zm-7.241 13.56c-.244-1.039-.398-2.136-.456-3.279h2.994v3.057c-.865.034-1.714.102-2.538.222zm2.538 1.776v3.62c-.798-.959-1.458-2.126-1.957-3.456.638-.083 1.291-.136 1.957-.164zm-2.994-7.055c.057-1.128.207-2.212.446-3.239.827.121 1.68.19 2.548.224v3.015h-2.994zm1.024-5.179c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907zm.009 9.262c-.988.236-1.92.542-2.797.9-.89-1.328-1.471-2.879-1.637-4.551h3.934c.058 1.265.231 2.488.5 3.651zm.553 1.917c.342.976.768 1.881 1.257 2.712-1.223-.49-2.326-1.211-3.256-2.115.636-.229 1.299-.435 1.999-.597zm9.924 0c.7.163 1.362.367 1.999.597-.931.903-2.034 1.625-3.257 2.116.489-.832.915-1.737 1.258-2.713zm.553-1.917c.27-1.163.442-2.386.501-3.651h3.934c-.167 1.672-.748 3.223-1.638 4.551-.877-.358-1.81-.664-2.797-.9zm.501-5.651c-.058-1.251-.229-2.46-.492-3.611.992-.237 1.929-.546 2.809-.907.877 1.321 1.451 2.86 1.616 4.518h-3.933z"
                />
              </svg>
            }
          />
        </a>
      )}
      {profile.linkedinUrl && (
        <a
          target="_blank"
          href={prefixUrlIfNeeded(profile.linkedinUrl)}
          rel="noreferrer"
        >
          <IconButton
            variant="link"
            aria-label="LinkedIn link"
            icon={
              <svg
                className="w-5 h-5 m-2 hover:text-zinc-700"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                />
              </svg>
            }
          />
        </a>
      )}
      {profile.publicEmail && (
        <a
          target="_blank"
          href={`mailto:${profile.publicEmail}`}
          rel="noreferrer"
        >
          <IconButton
            variant="link"
            aria-label="Email link"
            icon={
              <svg
                className="w-5 h-5 m-2 hover:text-zinc-700"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 12.713l-11.985-9.713h23.971l-11.986 9.713zm-5.425-1.822l-6.575-5.329v12.501l6.575-7.172zm10.85 0l6.575 7.172v-12.501l-6.575 5.329zm-1.557 1.261l-3.868 3.135-3.868-3.135-8.11 8.848h23.956l-8.11-8.848z"
                />
              </svg>
            }
          />
        </a>
      )}
      {profile.venmoUrl && (
        <a
          target="_blank"
          href={prefixUrlIfNeeded(profile.venmoUrl)}
          rel="noreferrer"
        >
          <IconButton
            variant="link"
            aria-label="aedIn link"
            icon={
              <svg
                className="w-5 h-5 m-2 hover:text-zinc-700"
                xmlns="http://www.w3.org/2000/svg"
                width="516"
                height="516"
                viewBox="0 0 516 516"
              >
                <rect
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  width="516"
                  height="516"
                  rx="61"
                  ry="61"
                />
                <path
                  fill="white"
                  d="M385.16,105c11.1,18.3,16.08,37.17,16.08,61,0,76-64.87,174.7-117.52,244H163.49L115.28,121.65l105.31-10L246.2,316.82C270,278,299.43,217,299.43,175.44c0-22.77-3.9-38.25-10-51Z"
                />
              </svg>
            }
          />
        </a>
      )}
    </div>
  )
}

export default Socialas
