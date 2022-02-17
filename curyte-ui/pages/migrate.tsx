import { Profile, Tag } from '@prisma/client'
import ErrorPage from 'next/error'
import { useEffect, useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import { getAuthors, getLessons, getPaths, getTags } from '../firebase/api'
import supabase from '../supabase/client'

/**
 * ThE BIGGEST HACK EVER
 */
const Migrate = () => {
  const user = supabase.auth.user()

  const [migrating, setMigrating] = useState(true)

  useEffect(() => {
    if (!user || user.email !== 'kaspnilsson@gmail.com') return

    const fetchAndMigrate = async () => {
      if (confirm('Migrate lessons?')) {
        const allLessons = (await getLessons([], true)).map((l) => ({
          ...l,
          authorId: firebaseIdToSupabaseIdLookup[l.authorId],
          authorName: undefined,
        }))

        for (const l of allLessons) {
          const { error } = await supabase.from('lessons').upsert([l])

          if (error) {
            console.log(error)
            console.log(l)
            debugger
          } else {
            console.log('Migrated lesson ', l)
          }
        }
      }

      if (confirm('Migrate tags?')) {
        const allTags = (await getTags([])).map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (t) => ({ ...t, tag: undefined } as Tag)
        )
        for (const t of allTags) {
          const { error } = await supabase.from('tags').upsert([t])

          if (error) {
            console.log(error)
            console.log(t)
            debugger
          } else {
            console.log('Migrated tag ', t)
          }
        }
      }

      if (confirm('Migrate paths?')) {
        const allPaths = (await getPaths([])).map((p) => ({
          ...p,
          authorId: firebaseIdToSupabaseIdLookup[p.authorId],
        }))
        for (const p of allPaths) {
          const { error } = await supabase.from('paths').upsert([p])

          if (error) {
            console.log(error)
            console.log(p)
            debugger
          } else {
            console.log('Migrated path ', p)
          }
        }
      }

      if (confirm('Migrate profiles?')) {
        const allAuthors = (await getAuthors([])).map(
          (a) =>
            ({
              uid: firebaseIdToSupabaseIdLookup[a.uid],
              displayName: a.displayName,
              photoUrl: a.photoURL,
              bio: a.bio,
              twitterUrl: a.links?.twitter || '',
              linkedinUrl: a.links?.linkedin || '',
              personalUrl: a.links?.personalSite || '',
              publicEmail: a.links?.publicEmail || '',
              venmoUrl: a.links?.venmo || '',
              savedLessons: a.savedLessons || [],
              savedPaths: [],
            } as Profile)
        )
        for (const a of allAuthors) {
          const { error } = await supabase.from('profiles').upsert([a])

          if (error) {
            console.log(error)
            console.log(a)
            debugger
          } else {
            console.log('Migrated path ', a)
          }
        }
      }
      setMigrating(false)
    }

    fetchAndMigrate()
  }, [user])

  if (!user || user.email !== 'kaspnilsson@gmail.com') {
    return <ErrorPage statusCode={403} />
  }

  return (
    <div>
      {migrating && (
        <>
          <h1>Migrating....</h1>
          <LoadingSpinner />
        </>
      )}
      {!migrating && (
        <>
          <h1>Done!</h1>
        </>
      )}
    </div>
  )
}

export const firebaseIdToSupabaseIdLookup: { [key: string]: string } = {
  FcLTIdF6tOhMMZZzOnsSHmCQVjt1: '96e774b1-f93a-4a71-8f33-028aa2099438',
  PoX0rTaDEJeb3fw28o2kSM5oABA2: '1c343052-84c6-4abb-90d8-e1ac6d9400fa',
  '004eBjIGmHVc01bRGe3rTt3ezZx2': '95963a5b-f207-4a13-945b-af59537109c5',
  '01btLy6l3VbV8nFaFfziWoZQuqB3': '86847a34-2847-494a-bda0-fdb50bdcec35',
  '0BDuoAd0rPZUnr466XxOpYXo2p43': '1e694574-c5db-436e-95c6-f8b2aa02d54a',
  '19n4S8uISgVI74ipW6v0AndltD32': '73e65cc9-1e18-4553-9e7e-7f0285d4e3ad',
  '2GCfGfaaWvZZ4eXWXCPDE1oePj03': 'f25d89ba-c33a-4bf6-ae06-69ec22200166',
  '2R3kNtXAkeQL078udRk0b1Vq9t12': '4d07631f-7e73-4847-b15e-f4d27d31a32d',
  '2Ssd8AW7OIb2WBTMZblGPOuD9RX2': 'eb5c166e-5ed8-4fde-9f78-0ae4882176cc',
  '43myCThQ18gw2EAoAA9b3YNboHD2': '18b6176e-7705-41d0-b156-d848a1117c3c',
  '4AUv2YdN84Ol7cQaapGYjeJeLX42': '82c51bcd-173f-4043-a137-33d48dd9d5dd',
  '5M2PGV8Mp2WR7YfG2ul3tRWsA5E3': '9efe6adb-db00-4b91-89fb-fa4d9f441d6a',
  '5MpbkzIO29bOaCGOQJvbH0QxLWz2': '89d2e6a8-154c-472e-ba0d-d0a1b5e12846',
  '5Qpyf48w35c7C6V7Njx7lBEtQi32': '59a510cd-4a87-4c38-861e-3e4fba4dbb06',
  '5m8xROE0VTOzxoAYFZQAsSLDIkl2': 'cd471a72-a10f-4249-a003-a811b69dc294',
  '5oPPcq2TThSeX8Ig5ezXLq9BJui1': 'e59e2912-5921-4857-92d6-c8576fee55c6',
  '6piRqtquqmcj1qO8X8dIVgKfjRM2': '8a1ad928-c61d-4e27-b76f-deaef3f4645f',
  '7W4AvjxMP3dyjHamAzpslQADznf1': 'f26f8c30-c033-4c75-ab25-079edd6ed6a8',
  '7XcFwjUNg3Y77iAQRC7Qj6uehmc2': '8ef62727-0e64-45bf-b8a1-6774c0312268',
  '7vK3Ptrd49RVwkyovv4YwrxA8qo2': '976059cf-9051-4d40-a68c-2cdc87d424d0',
  B2vbJkCD4Ja4YHzVZzutUTB57jP2: '8fcbd1cb-0208-4a9c-9859-2ea13e0d96c4',
  BCSJIljS1JhhZd0E41OxNd1nAFm2: 'e352e77b-b18e-4bbb-87e0-9e2c76f9fffe',
  CbfDMXqp2qhD6De61NydqzXDXUV2: 'dbc082b4-4442-4f3d-a282-b20be94c4ea0',
  CuY7N1OIpeWbgCFI0MoZ5DppEqi1: '8e2772b1-7098-40a2-85ce-a7fb79f97617',
  CzL58AVgTqNjkQr2wGzEVAc6rkQ2: 'deb1f5b8-0ae3-4ee4-8b71-4ee9aff1a31d',
  DYJWXb40mYW8zQIaNMZFdADCH8O2: '5edab3cf-606b-4e66-a10f-566c4f2dee73',
  EK6O5CfqTCNQ3mvDsgkyDp2wER02: '1776506d-82cd-450c-b37c-9646c9447ae2',
  EsM1Ytj7JTXNZkVx4VMhgDFgmSR2: '97cc311c-54cd-4cb6-9530-9c7d18658bfc',
  FDK535Fcw0cbUJkkjCANsDUqdl22: 'af96308e-9ce7-4cd8-bfe3-8ff7b433aed8',
  FHc25ehg50bq6hO09aDIXwRIDxy1: 'cbd45ea1-35d7-4f53-879e-7268ded96a71',
  FLWRzzcu0dP2zGv8O8gTHAWAHUm2: 'ffaeeec5-8e8d-4d6e-b9fa-a9c919531acb',
  G24fuXIEUZVoSz3nmWRxxeo16OQ2: '4f93754f-0255-4031-bbd1-5a735cd25530',
  KklOPR3Hs4WJu3KSrCSaXkyB9Up1: '5f9b28e0-9a79-4dd3-9ab5-51a193177be2',
  MXxKHtdxdXQpWKiArA1ViiYJTGf2: '9a747f77-89be-4108-88c7-a12bd0b7f8b1',
  NHWgulGjeJZbiezSQR5ile9Cqlt2: '1cff74cd-1ae7-4e89-bf20-b2f18d782bc4',
  OXMOECx1epPOlHJn6eFRp6vAiT02: '2655aba3-1a91-4ca1-9bb3-f2ce78f558a5',
  Os0cEFPdc2cM6gPxsLZcrtmyOUC3: '475a02c9-8b57-401a-b1e6-db2c5b2a5483',
  PWHnCxvlHwQTqLD7pROSVk49zmJ2: '203a091f-88eb-4584-a671-00f903eba3df',
  QkJ1iYvQugNlMJ1WWAhIZliIOfB2: '3ebc7f6d-6eb7-4f29-af45-e3f20e8e0e12',
  VqQXd0VYeLUy6gTq3Yji1qkpNII3: '820e671c-5e5e-4d66-822a-82209d8b6bc8',
  WJpQNqEOxfNbLk0z7Q3JRylxVKJ2: '8706a242-1380-4fb5-8cb9-36ed4fa0cf43',
  WTTb5Lyywsc4ILVVvTClm76Dcji1: '58263411-cbf7-4dd6-becf-61802b87c1e5',
  WdPeCpwT4FfvS1xXdoqJIWD9GeR2: 'd95706dc-8289-4833-819c-695f9cfab290',
  XxGFsDP0dcSOedaST2c6x16l4mz1: '099907d8-9b4a-4c6d-968a-fa1ee8cfd480',
  XylcnNiFfuXuL0zZDHrL6Gxz6hI2: '32985101-30ba-4ec2-85eb-2c1c458815f2',
  YZ8xQKC9XoceQ9D3vJ9qUHy6uQI2: '0b8c6406-9085-4f1d-a78d-8650a710eca1',
  ayMpJW27wBefEOhKqxmw1LEKNs82: '22ccfdaa-f19e-4178-b7d1-fac1d231171b',
  bPY559i6AiPW8b6bC85Tt8tFJqC3: '05c08011-843e-48e2-b474-43bfdf7b0ada',
  bQZJGBQfafS3DjOJJZLMuYjABjm1: 'da3567ff-3352-484f-8b48-ef2aa6bf61a4',
  bcdpOWvSO4OLq56PixiWiItVzRl1: '2c513e96-24af-4882-8ff8-a332eb66d7c2',
  buQvWFeceEabY4qgqutN0P43Ewi2: 'e59e9e1d-b796-45be-b8cc-6a52a1cb26c9',
  c0ucMFPdLjPC2b8lmwRjaGa2EBd2: '5dea52a6-b44a-46d9-a86d-eada84fd2c3e',
  cGOWlhWzOdNcSDn8Pr44geCK9gG3: 'eca5dc6d-acb1-4a55-bd1d-6c528e9cd701',
  cqx1lX7dpHUKl53jnIIZ2KX959X2: 'e7c5cae7-ebdb-4ef6-83b7-79631c078f93',
  cvU7PSr0nnavJOPGaq7zKM2Yczn2: '87d6f280-6d71-4955-87e9-b55cbd56865b',
  dDbBkPd2xxTGgnIGRSXLIrfKlPJ3: 'da11d93d-8638-40a4-86d1-c034fc973057',
  dqHGrGa9xzRRpJPDOmK3sZdbPMf2: '78d4a64a-9cf6-4ac9-adc6-6da635217479',
  dzQKBelbKPaHodtF7i1Oy5GMyI42: 'eb135910-4496-415f-99d3-d23a0f2b73a1',
  e6Ww7TB8p1Z2P6jFSAH4cZTA5mp2: 'f32a60ce-025f-4099-b2e1-431a6ee2099c',
  eB4bhNRkkVa8jjA2LswyfhIBEtu2: '6c7ec326-7396-472d-8c95-4bdadea2a2bb',
  ebZ2hBa8odYPTGnxLeJROJiXGEa2: '80b3e298-686b-42ad-b141-41228864a618',
  fGLPjWBmC2SlGY3TYHzkSsp8QHR2: '280316be-3365-4efa-9cb4-7b1d5e556d29',
  fTyUSytUkhf7xmJwlPfSxiw5mkd2: '7cbf7f97-4c91-4053-9f5c-9a2fbbfc1205',
  ffFjSzP7p6bXCVcnCJScvYLcjl52: '06a2aae1-855d-446f-ac77-cc89c020b596',
  jTczHH8UaZeo0Rc2oBhtZamlRM52: '93cc9e0f-9a28-43bd-80ae-45172ea9735e',
  nOYtQhfZvla2EZYVml9AalCYjSB2: '1f891890-d60a-4288-92ee-98c0c453a7f8',
  npWgfJLoiTTc0lJQaxvjFNSALGb2: '9ba6aeb0-95a7-47f1-80e2-3e3893fc48de',
  pQgYZuHNYwasEU8kFcj6Br3kGLZ2: '4dad08a1-a5f0-4c49-96db-386c5d891b71',
  pZw2JUdy0aWdANWxDdy47IPJw072: '1d83cbb2-d435-45ac-a15f-ed48139a5d7d',
  qZG5aKfGHNeBw5x5i7jf2tPwlIq2: '6816b919-ae87-4e49-9cf9-8f5c967500e9',
  qZMeyoJnReUZAnILz2ramJmCcXn2: '5f80c1de-51f7-4b57-abe5-4634ea280ce2',
  rDqCI7u01ENJyVxnhut0dKHmAjb2: 'e7ab5d8f-c059-431e-9c19-dfe974187ffe',
  rLrkJIgSf9bPrzjkXEJXovzO6483: '2477db8c-f1fe-4f0f-8d6d-d81810f378d6',
  rOlS54Ds6JPRbVH57rjRTTkFGKs2: 'cc3d0719-af58-4a46-9399-c62c7f75b232',
  rjo3QeOzovReg6PSrquA6gvDb5c2: '1084c59b-b282-4171-8530-33f377660210',
  rnrf2g4CQWXD6J4ovDjZ0ijLgcw1: '155e1d46-8f67-43e0-a511-b54720da6565',
  sNVzN2LBKpaD9OuK07fmDlMpYBi1: '3cec6bc5-9410-4da6-9bb3-b1b49562fa21',
  sgtQA8jOZWYIgWW8SspgPXq8trq2: '1bf80ff8-daaf-4df3-90af-44a446e697ad',
  t7AXkXlddrfWke9fAHz46vZ7A0o1: '9dfa2876-3358-4638-8d7a-3b61e3b3be89',
  trPf93xPPtfAd7iRRxyUnnj9Rn83: 'beb38f96-5e60-479b-9626-bb988c5480ea',
  uEJk6H10e0XStspNDB0L7fvie1Q2: '4435e493-ea27-4327-858c-0a63303fbc1b',
  v3Gx4ONJMBekqIWm07v6vIEa2DB3: 'ba73391c-8619-4c55-919d-47454018736d',
  vMA03GE7i2buwMYEalDsWE6qs0T2: '7f75887a-1924-4782-82c6-9dbc09cb7382',
  vcYBl5KVSIUXoSR1QNV3BiF1dR52: '5bdcb6fa-dafd-4b96-869b-1955c2774ec0',
  wHBkEE3jNzRVuVdp6ssEN6RIvdc2: '83214b4f-c0ba-4288-bbc9-0240d6e48004',
  wjHxzphFnwRQODbt0mSc0PV7C1k1: '5ae45089-49ff-41c0-8c1d-6c1217f7c3d9',
  yvMPtJFDa8T3HHhiZHAH1XQaMxt1: '7fa616dd-5dd5-46f9-8dae-6a2de11eca1e',
  zU54Vn8U0WPh78B7dNzueKfBzeh2: '35048c6d-e92e-441c-947f-ceb080d4f9dc',
}

export default Migrate
