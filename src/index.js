const submitBtn = document.getElementById('submit-btn')
const responseOutput = document.getElementById('response-output')
const report = document.querySelector('[aria-labelledby="report"]')
const contentTypeText = document.getElementById('content-type')
const contentLengthText = document.getElementById('content-length')
const bytesLengthText = document.getElementById('bytes-length')

const request = async ({ url, method, mode, credentials }) => {
  const request = new Request(url, {
    method,
    mode,
    credentials,
  })

  console.log(request)

  try {
    const response = await fetch(request)
    const clonedResponse = response.clone()
    const getHeader = (header) => clonedResponse.headers.get(header)
    const getBuffer = async () => {
      return await response.arrayBuffer()
    }

    contentTypeText.innerText = getHeader('Content-Type') || 'N/A'
    contentLengthText.innerText = getHeader('Content-Length') || 0

    const buffer = await getBuffer()
    const uncompressedBytes = buffer.byteLength
    bytesLengthText.innerText = uncompressedBytes

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    console.log(clonedResponse)

    const json = await clonedResponse.json()
    console.log('JSON ', json)

    responseOutput.innerText = JSON.stringify(json, null, 2)
  } catch (e) {
    console.error(e)
  }
}

const handler = ({ customURL }) => {
  const urls = [
    'https://swapi.dev/api/people/10',
    'http://localhost:3000/?qs1=J',
  ]

  const modes = [
    'cors', // default
    'no-cors',
    'same-origin',
    'navigate',
  ]

  const credentials = [
    'omit',
    'same-origin', // default
    'include',
  ]

  const methods = [
    'GET', // default
    'POST',
  ]

  const url = customURL || urls[1]

  const config = {
    headers: [
      {
        name: 'Content-Length',
      },
    ],
  }

  request({
    url,
    method: methods[0],
    mode: modes[0],
    credentials: credentials[1],
  })

  setTimeout(() => {
    report.classList.remove('hidden')
  }, 500)
}

submitBtn.addEventListener('click', (e) => {
  e.preventDefault() // prevent the request causing a page refresh
  const url = document.getElementById('endpoint').value
  const customURL = url?.length > 0 ? url : null
  handler({
    customURL,
  })
})
