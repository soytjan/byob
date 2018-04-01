document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const appName = document.getElementById('appName').value;

  const token = await fetchAuthentication({ email, appName });

  document.querySelector('p').innerText = token;
})

const fetchAuthentication = async (body) => {
  const jsonBody = JSON.stringify(body);

  let fetchData = { 
    method: 'POST', 
    body: jsonBody, 
    headers: {
      'content-type': 'application/json'
    }
  }

  const response = await fetch('/api/v1/authenticate', fetchData);
  return await response.json();
}
