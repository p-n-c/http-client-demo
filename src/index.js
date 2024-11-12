// GET
const endpointInput = document.getElementById('endpoint')
const fetchGetBtn = document.getElementById('fetch-get-btn')
const responseOutput = document.getElementById('response-output')
const report = document.querySelector('[aria-labelledby="report"]')
const contentTypeText = document.getElementById('content-type')
const contentLengthText = document.getElementById('content-length')
const bytesLengthText = document.getElementById('bytes-length')
const summaries = document.querySelectorAll('summary')

// POST
const fetchPostBtn = document.getElementById('fetch-post-btn')
const colourNameInput = document.getElementById('colour-name')
const hexValueInput = document.getElementById('hex-value')
const serverResponseText = document.getElementById('server-response')

const request = async ({ url, options }) => {
  const request = new Request(url, options)

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

    const json = await clonedResponse.json()
    responseOutput.innerText = JSON.stringify(json, null, 2)

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
    method: 'GET',
    mode: 'cors',
  }

  request({
    url,
    options,
  })
}

// Handle a request
fetchGetBtn.addEventListener('click', () => {
  const colour = endpointInput?.value || null
  const url = colour ? colour : 'http://localhost:3000/colours'
  getRequestHandler({
    url,
  })
})

const postRequestHandler = async (name, hex) => {
  const url = 'http://localhost:3000/post'

  const body = JSON.stringify({ name, hex })

  const options = {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    body,
  }

  const request = new Request(url, options)

  try {
    const response = await fetch(request)
    const json = await response.json()
    serverResponseText.innerText = json.message
  } catch (e) {
    console.log('e: ', e)
  }
}

// Handle a post
fetchPostBtn.addEventListener('click', () => {
  const name = colourNameInput.value
  const hex = hexValueInput.value
  postRequestHandler(name, hex)
})

// Turn details summaries into tabs
Array.from(summaries).forEach((summary) => {
  summary.addEventListener('click', () => {
    document.querySelector('[open] summary').click()
  })
})
