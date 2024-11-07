;(async function main() {
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

  const url = urls[1]

  const config = {
    headers: [
      {
        name: 'Content-Length',
      },
    ],
  }

  const request = new Request(url, {
    method: methods[0],
    mode: modes[0],
    credentials: credentials[1],
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
  } catch (e) {
    console.error(e)
  }
})()
