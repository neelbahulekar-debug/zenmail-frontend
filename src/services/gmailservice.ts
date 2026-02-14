export async function getGmailStatus() {

  const res = await fetch(
    "http://localhost:3000/gmail/status"
  );

  return await res.json();

}


export async function fetchEmails() {

  const res = await fetch(
    "http://localhost:3000/gmail/emails"
  );

  const data = await res.json();

  return data.emails || [];

}


export async function sendReplyEmail(
  to: string,
  subject: string,
  replyText: string
) {

  const res = await fetch(
    "http://localhost:3000/gmail/send-reply",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to,
        subject,
        replyText
      })
    }
  );

  return await res.json();

}

