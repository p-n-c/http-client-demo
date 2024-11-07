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
    let contentLength = getHeader('Content-Length')
    console.log('contentLength: ', contentLength)

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    console.log(response)

    const json = await response.json()
    console.log('JSON ', json)

    const responseOutput = document.getElementById('response-output')

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
}

const submitBtn = document.getElementById('submit-btn')

submitBtn.addEventListener('click', (e) => {
  e.preventDefault() // prevent the request causing a page refresh
  const url = document.getElementById('endpoint').value
  const customURL = url?.length > 0 ? url : null
  handler({
    customURL,
  })
})
