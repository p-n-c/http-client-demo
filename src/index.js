import { contentTypes, modes, credentials, methods } from './utils.js'

// GET
const endpointInput = document.getElementById('endpoint')
const submitGetRequestBtn = document.getElementById('submit-get-request-btn')
const responseOutput = document.getElementById('response-output')
const report = document.querySelector('[aria-labelledby="report"]')
const contentTypeText = document.getElementById('content-type')
const contentLengthText = document.getElementById('content-length')
const bytesLengthText = document.getElementById('bytes-length')
const summaries = document.querySelectorAll('summary')

// POST
const submitPostRequestBtn = document.getElementById('submit-post-request-btn')
const colourNameInput = document.getElementById('colour-name')
const hexValueInput = document.getElementById('hex-value')

const request = async ({ url, options }) => {
  const request = new Request(url, options)

  console.log(request)

  try {
    const response = await fetch(request)
    const clonedResponse = response.clone()
    const getHeader = (header) => clonedResponse.headers.get(header)
    const getBuffer = async () => {
      return await response.arrayBuffer()
    }

    const contentType = getHeader('Content-Type')
    contentTypeText.innerText = contentType || 'N/A'
    contentLengthText.innerText = getHeader('Content-Length') || 0

    const buffer = await getBuffer()
    const uncompressedBytes = buffer.byteLength
    bytesLengthText.innerText = uncompressedBytes

    if (!response.ok) {
      responseOutput.innerText = 'Your request returned no results'
      report.classList.add('hidden')
      throw new Error(`Response status: ${response.status}`)
    }

    console.log(clonedResponse)

    switch (contentType) {
      case contentTypes[0]: {
        const text = await clonedResponse.text()
        responseOutput.innerText = text
        break
      }
      case contentTypes[1]:
        {
          const json = await clonedResponse.json()
          responseOutput.innerText = JSON.stringify(json, null, 2)
        }
        break
    }

    setTimeout(() => {
      report.classList.remove('hidden')
    }, 500)
  } catch (e) {
    responseOutput.innerText = e.message
    console.error(e)
  }
}

const getRequestHandler = ({ url }) => {
  const options = {
    method: methods[0],
    mode: modes[0],
    credentials: credentials[1],
  }

  request({
    url,
    options,
  })
}

submitGetRequestBtn.addEventListener('click', (e) => {
  e.preventDefault() // prevent the request causing a page refresh
  const url = endpointInput.value
  getRequestHandler({
    url: url?.length > 0 ? url : null,
  })
})

const postRequestHandler = async (name, hex) => {
  const url = 'http://localhost:3000/post'

  const body = JSON.stringify({ name, hex })

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  }

  const request = new Request(url, options)

  try {
    const response = await fetch(request)
    console.log('response: ', response)
  } catch (e) {
    console.log('e: ', e)
  }
}

submitPostRequestBtn.addEventListener('click', (e) => {
  e.preventDefault()
  const name = colourNameInput.value
  const hex = hexValueInput.value
  postRequestHandler(name, hex)
})

// Turn details summaries into tabs
Array.from(summaries).forEach((summary) => {
  summary.addEventListener('click', (e) => {
    document.querySelector('[open] summary').click()
  })
})
