'use client'

// Internal imports
import { api } from '@/api'

// Icons imports
import { RxDragHandleDots2 } from 'react-icons/rx'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { IoMdSettings } from 'react-icons/io'
import { GrFormClose } from 'react-icons/gr'

// Libraries imports
import Cookies from 'js-cookie'
import { BaseSyntheticEvent, useState, useEffect } from 'react'


export default function Home() {
  // App states
  const [userMessage, setUserMessage] = useState('')
  const [chatResponse, setChatResponse] = useState('')
  const [loading, setLoading] = useState(false)

  // Settings options states
  const [isShowing, setIsShowing] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [predefinedMessage, setPredefinedMessage] = useState('')

  // Calling the API sending the user message, the user API Key and the predefined message which is optional
  const handleApiResponse = async (e: BaseSyntheticEvent) => {
    e.preventDefault()

    // Loading icon
    setLoading(true)

    // When submit the message the user message and the previous response of the GPT API will be cleaned from the UI  
    setUserMessage('')
    setChatResponse('')

    // Calling the api which is in another folder that is a SSR component. The function passes the three parameters to the SSR component to complete the call
    if (apiKey.length < 51) {
      setLoading(false)
      setChatResponse("Verifique se a API Key salva nas configurações é válida.")
      return
    }
    try {
      const apiResponse = await api({ userMessage, apiKey, predefinedMessage });
      if (apiResponse.data.choices[0].message?.content) {
        setChatResponse(apiResponse.data.choices[0].message?.content)
      }

    } catch (error) {
      setChatResponse("Houve um erro na comunicação, por gentileza tente mais tarde.")
    }
    setLoading(false)
  }

  // Save Cookies
  const handleOpenSettings = (e: BaseSyntheticEvent) => {
    e.preventDefault()
    Cookies.set('key', apiKey, { expires: 365 })
    Cookies.set('predefinedPrompt', predefinedMessage, { expires: 365 })
    setIsShowing(false)
  }

  // Get Cookies
  useEffect(() => {
    const apiKeyCookie = Cookies.get('key')
    const predefinedPromptCookie = Cookies.get('predefinedPrompt')

    if (typeof apiKeyCookie !== "string") {
      console.log(typeof apiKeyCookie, apiKeyCookie)
      setIsShowing(true)
      return
    }
    setApiKey(apiKeyCookie)

    if (typeof predefinedPromptCookie !== "string") {
      console.log(typeof apiKeyCookie, apiKeyCookie)
      setPredefinedMessage('')
      return
    }

    setPredefinedMessage(predefinedPromptCookie)

  }, [])


  return (
    <div className='relative'>
      {/* Settings "modal" */}
      {isShowing && (
        <div className='absolute w-full p-4 rounded border border-zinc-600 bg-zinc-400 z-20'>
          <GrFormClose className='absolute top-1 right-1 text-2xl cursor-pointer transition hover:scale-125' onClick={() => setIsShowing(false)} />
          <form className='flex flex-col space-y-4' onSubmit={e => handleOpenSettings(e)}>
            <label id='apikey'>
              <h2 className='font-bold'>OpenAI Key</h2>
              <p className='text-sm'>Crie uma Key no site:{" "}
                <a href='https://platform.openai.com/account/api-keys' className='hover:text-blue-800 font-bold' target='_blank'>https://platform.openai.com/account/api-keys</a>
              </p>
              <input type="text" id='apikey' className='mt-2 w-full rounded px-2' required value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </label>
            <label id='predefinedPrompt'>
              <h2 className='font-bold'>Comando pré-definido</h2>
              <p className='text-sm'>Exemplo: digite o seguinte: &quot;Poderia me dizer qual seria a melhor tradução para o inglês do seguinte texto: &quot;<br /></p>
              <p className='text-sm mt-1'>Agora, sempre que você digitar uma mensagem em português após esse prompt, vou fornecer a tradução para você sem a necessidade de solicitar diretamente.</p>
              <input type="text" id='predefinedPrompt' className='mt-2 w-full rounded px-2' value={predefinedMessage} onChange={(e) => setPredefinedMessage(e.target.value)} />
            </label>
            <input type="submit" value="Salvar configuração" className='bg-zinc-700 text-white p-2 w-64 rounded transition-colors hover:bg-zinc-800 cursor-pointer' />
          </form>
        </div>
      )}

      <form onSubmit={(e) => handleApiResponse(e)}>
        <div className='relative flex items-center'>
          <RxDragHandleDots2 className='absolute text-2xl dragg z-10' />
          <input
            type="text"
            className="bg-zinc-500 text-white rounded px-6 py-2 w-full border border-solid border-zinc-200"
            placeholder="Send a message..."
            value={userMessage}
            onChange={(e): string => {
              setUserMessage(e.target.value)
              return e.target.value
            }}
            autoFocus
          />
          <IoMdSettings className="absolute text-2xl right-2 transition hover:animate-spin cursor-pointer z-10" onClick={() => setIsShowing(true)} />
        </div>
      </form>
      <div className='p-4 mt-4 rounded bg-zinc-900 border border-zinc-600'>

        {loading ? (<AiOutlineLoading3Quarters className='animate-spin text-white' />) : (<p className='text-zinc-100'>{chatResponse}</p>)}

      </div>
    </div>
  )
}
