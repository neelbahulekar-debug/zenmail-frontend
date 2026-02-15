import React, { useEffect, useState } from "react";

/* ================= TYPES ================= */

type Category =
  | "Urgent"
  | "Action Required"
  | "Waiting"
  | "Spam"
  | "Promotions"
  | "Newsletters"
  | "Sent"
  | "Archived";

interface Email {
  id: string;
  subject: string;
  from: string;
  body: string;
  category: Category;
}

/* ================= COMPONENT ================= */

function App() {
  const [gmailConnected, setGmailConnected] = useState(false);
  const [connectedEmail, setConnectedEmail] = useState("");
  const [emails, setEmails] = useState<Email[]>([]);
  const [sentEmails, setSentEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("Urgent");
  const [loading, setLoading] = useState(true);
  const [generatingReply, setGeneratingReply] = useState(false);
  const [aiReply, setAiReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const backend = "https://zenmail-backend-production.up.railway.app";

  /* ================= CATEGORY ICONS & COLORS ================= */

  const categoryConfig: Record<Category, { icon: string; color: string; bgColor: string }> = {
    Urgent: { icon: "🔥", color: "#ef4444", bgColor: "#fee2e2" },
    "Action Required": { icon: "⚡", color: "#f59e0b", bgColor: "#fef3c7" },
    Waiting: { icon: "⏳", color: "#8b5cf6", bgColor: "#ede9fe" },
    Spam: { icon: "🗑️", color: "#6b7280", bgColor: "#f3f4f6" },
    Promotions: { icon: "🏷️", color: "#ec4899", bgColor: "#fce7f3" },
    Newsletters: { icon: "📰", color: "#3b82f6", bgColor: "#dbeafe" },
    Sent: { icon: "📤", color: "#059669", bgColor: "#d1fae5" },
    Archived: { icon: "📦", color: "#10b981", bgColor: "#d1fae5" },
  };

  /* ================= CHECK STATUS ================= */

  async function checkStatus() {
    try {
      console.log("Checking Gmail connection status...");
      const res = await fetch(`${backend}/gmail/status`, {
        credentials: 'include' // Important: include cookies for session
      });
      
      if (!res.ok) {
        console.error("Status check failed:", res.status, res.statusText);
        setLoading(false);
        return;
      }
      
      const data = await res.json();
      console.log("Status response:", data);

      if (data.connected) {
        console.log("Gmail connected as:", data.email);
        setGmailConnected(true);
        setConnectedEmail(data.email);
        await fetchEmails();
        await fetchSentEmails(); // Fetch sent emails too
      } else {
        console.log("Gmail not connected");
        setGmailConnected(false);
        setConnectedEmail("");
      }
    } catch (err) {
      console.error("Status check error:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ================= FETCH EMAILS ================= */

  async function fetchEmails() {
    try {
      console.log("Fetching emails...");
      const res = await fetch(`${backend}/gmail/emails`, {
        credentials: 'include' // Important: include cookies for session
      });
      const data = await res.json();

      console.log("Emails response:", data);

      if (!data.success) {
        console.log("Failed to fetch emails");
        return;
      }

      const classified = data.emails.map((e: any) => {
        const text = (e.subject + " " + e.body).toLowerCase();
        let category: Category = "Archived";

        if (text.includes("urgent")) category = "Urgent";
        else if (text.includes("meeting") || text.includes("reply"))
          category = "Action Required";
        else if (text.includes("unsubscribe")) category = "Promotions";
        else if (text.includes("newsletter")) category = "Newsletters";

        return {
          id: e.id,
          subject: e.subject,
          from: e.from,
          body: e.body,
          category,
        };
      });

      console.log(`Classified ${classified.length} emails`);
      setEmails(classified);

      // Auto-select first email in active category if none selected
      const firstInCategory = classified.find(
        (e: Email) => e.category === activeCategory
      );
      if (firstInCategory && !selectedEmail) {
        setSelectedEmail(firstInCategory);
      }
    } catch (err) {
      console.error("Fetch emails error:", err);
    }
  }

  /* ================= FETCH SENT EMAILS ================= */

  async function fetchSentEmails() {
    try {
      console.log("Fetching sent emails...");
      const res = await fetch(`${backend}/gmail/sent`, {
        credentials: 'include'
      });
      const data = await res.json();

      console.log("Sent emails response:", data);

      if (!data.success) {
        console.log("Failed to fetch sent emails");
        return;
      }

      const sentList = data.emails.map((e: any) => ({
        id: e.id,
        subject: e.subject,
        from: e.from,
        body: e.body,
        category: "Sent" as Category,
      }));

      console.log(`Fetched ${sentList.length} sent emails`);
      setSentEmails(sentList);

    } catch (err) {
      console.error("Fetch sent emails error:", err);
    }
  }

  /* ================= CONNECT ================= */

  function connectGmail() {
    window.location.href = `${backend}/auth/google`;
  }

  /* ================= LOAD ================= */

  useEffect(() => {
    // Check if we just came back from OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('success');
    
    if (authSuccess === 'true') {
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Wait a bit for backend to fully process, then check multiple times
      setTimeout(() => checkStatus(), 500);
      setTimeout(() => checkStatus(), 1500);
      setTimeout(() => checkStatus(), 3000);
    } else {
      checkStatus();
    }
  }, []);

  /* ================= AUTO-SELECT ON CATEGORY CHANGE ================= */

  useEffect(() => {
    const emailList = activeCategory === "Sent" ? sentEmails : emails;
    const firstInCategory = emailList.find((e) => e.category === activeCategory);
    if (firstInCategory) {
      setSelectedEmail(firstInCategory);
    } else {
      setSelectedEmail(null);
    }
    // Clear AI reply when switching emails
    setAiReply("");
  }, [activeCategory, emails, sentEmails]);

  /* ================= GENERATE AI REPLY ================= */

  async function generateAiReply() {
    if (!selectedEmail) return;

    setGeneratingReply(true);
    setAiReply("");

    try {
      console.log("Sending request to generate AI reply...");
      
      const response = await fetch(`${backend}/ai/generate-reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          from: selectedEmail.from,
          subject: selectedEmail.subject,
          body: selectedEmail.body,
        }),
      });

      const data = await response.json();
      
      console.log("AI reply response:", data);
      
      if (data.success && data.reply) {
        setAiReply(data.reply);
      } else {
        const errorMsg = data.message || "Sorry, couldn't generate a reply.";
        setAiReply(`Error: ${errorMsg}\n\nPlease check:\n1. Your Gemini API key is valid\n2. Backend server is running\n3. Check backend console for details`);
        console.error("AI reply failed:", data);
      }
    } catch (err) {
      console.error("AI reply error:", err);
      setAiReply(`Error: ${err.message}\n\nPlease check:\n1. Backend server is running on port 3000\n2. GEMINI_API_KEY is set in .env\n3. Check backend console for details`);
    } finally {
      setGeneratingReply(false);
    }
  }

  /* ================= SEND REPLY ================= */

  async function sendReply() {
    if (!selectedEmail || !aiReply.trim()) return;

    setSendingReply(true);

    try {
      const response = await fetch(`${backend}/gmail/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          to: selectedEmail.from,
          subject: `Re: ${selectedEmail.subject}`,
          body: aiReply,
          threadId: selectedEmail.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Reply sent successfully!");
        setAiReply("");
      } else {
        alert("❌ Failed to send reply: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Send reply error:", err);
      alert("❌ Error sending reply. Please try again.");
    } finally {
      setSendingReply(false);
    }
  }

  /* ================= FILTER ================= */

  const filtered = activeCategory === "Sent" 
    ? sentEmails 
    : emails.filter((e) => e.category === activeCategory);

  const categoryCounts = {
    ...emails.reduce((acc, email) => {
      acc[email.category] = (acc[email.category] || 0) + 1;
      return acc;
    }, {} as Record<Category, number>),
    Sent: sentEmails.length
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div style={{ textAlign: "center", color: "white" }}>
          <div
            style={{
              width: 50,
              height: 50,
              border: "4px solid rgba(255,255,255,0.3)",
              borderTop: "4px solid white",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          />
          <p style={{ fontSize: 18, margin: 0 }}>Loading ZenMail...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "#f8fafc",
        color: "#1e293b",
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: 280,
          background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "24px 0",
          display: "flex",
          flexDirection: "column",
          boxShadow: "4px 0 24px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ padding: "0 24px", marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            ✉️ ZenMail
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              opacity: 0.9,
              fontSize: 13,
              fontWeight: 400,
            }}
          >
            Smart Email Organization
          </p>
        </div>

        {!gmailConnected ? (
          <div style={{ padding: "0 24px" }}>
            <button
              onClick={connectGmail}
              style={{
                padding: "14px 20px",
                width: "100%",
                background: "white",
                color: "#667eea",
                border: "none",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
              }}
            >
              🔗 Connect Gmail
            </button>
          </div>
        ) : (
          <div
            style={{
              padding: "16px 24px",
              background: "rgba(255,255,255,0.15)",
              margin: "0 24px",
              borderRadius: 12,
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            <div style={{ opacity: 0.8, marginBottom: 4 }}>Connected as:</div>
            <div
              style={{
                fontWeight: 600,
                wordBreak: "break-all",
              }}
            >
              {connectedEmail}
            </div>
            <button
              onClick={() => {
                setLoading(true);
                fetchEmails();
                fetchSentEmails();
                setLoading(false);
              }}
              style={{
                marginTop: 12,
                padding: "8px 12px",
                width: "100%",
                background: "rgba(255,255,255,0.2)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)";
              }}
            >
              🔄 Refresh Emails
            </button>
          </div>
        )}

        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.2)",
            margin: "0 24px 16px",
          }}
        />

        <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
          {(
            [
              "Urgent",
              "Action Required",
              "Waiting",
              "Spam",
              "Promotions",
              "Newsletters",
              "Sent",
              "Archived",
            ] as Category[]
          ).map((cat) => {
            const config = categoryConfig[cat];
            const count = categoryCounts[cat] || 0;
            const isActive = activeCategory === cat;

            return (
              <div
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  background: isActive ? "rgba(255,255,255,0.2)" : "transparent",
                  borderRadius: 10,
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.2s",
                  fontWeight: isActive ? 600 : 500,
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{config.icon}</span>
                  <span style={{ fontSize: 14 }}>{cat}</span>
                </div>
                {count > 0 && (
                  <span
                    style={{
                      background: isActive ? "white" : "rgba(255,255,255,0.25)",
                      color: isActive ? "#667eea" : "white",
                      padding: "2px 8px",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      minWidth: 24,
                      textAlign: "center",
                    }}
                  >
                    {count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* EMAIL LIST */}
      <div
        style={{
          width: 360,
          background: "white",
          overflowY: "auto",
          borderRight: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>{categoryConfig[activeCategory].icon}</span>
            {activeCategory}
            {filtered.length > 0 && (
              <span
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  fontWeight: 500,
                  marginLeft: "auto",
                }}
              >
                {filtered.length} email{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div
            style={{
              padding: 60,
              textAlign: "center",
              color: "#94a3b8",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>No emails here</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>
              {gmailConnected
                ? "All clear in this category!"
                : "Connect Gmail to see your emails"}
            </div>
          </div>
        ) : (
          filtered.map((email) => {
            const isSelected = selectedEmail?.id === email.id;
            return (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                style={{
                  padding: "16px 24px",
                  borderBottom: "1px solid #f1f5f9",
                  cursor: "pointer",
                  background: isSelected ? "#f8fafc" : "white",
                  borderLeft: isSelected ? "3px solid #667eea" : "3px solid transparent",
                  transition: "all 0.15s",
                }}
                onMouseOver={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "#fafbfc";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "white";
                  }
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    marginBottom: 6,
                    color: "#1e293b",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {email.subject || "(No Subject)"}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#64748b",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {email.from}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#94a3b8",
                    marginTop: 8,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {email.body.substring(0, 60)}
                  {email.body.length > 60 ? "..." : ""}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* EMAIL VIEW */}
      <div
        style={{
          flex: 1,
          background: "white",
          overflowY: "auto",
        }}
      >
        {selectedEmail ? (
          <div style={{ maxWidth: 800, margin: "0 auto", padding: 40 }}>
            <div
              style={{
                display: "inline-block",
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                background: categoryConfig[selectedEmail.category].bgColor,
                color: categoryConfig[selectedEmail.category].color,
                marginBottom: 20,
              }}
            >
              {categoryConfig[selectedEmail.category].icon}{" "}
              {selectedEmail.category}
            </div>

            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                margin: "0 0 20px",
                color: "#0f172a",
                lineHeight: 1.3,
              }}
            >
              {selectedEmail.subject || "(No Subject)"}
            </h1>

            <div
              style={{
                padding: "16px 20px",
                background: "#f8fafc",
                borderRadius: 12,
                marginBottom: 32,
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>
                From
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>
                {selectedEmail.from}
              </div>
            </div>

            <div
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: "#334155",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                marginBottom: 32,
              }}
            >
              {selectedEmail.body}
            </div>

            {/* AI REPLY SECTION */}
            <div
              style={{
                borderTop: "2px solid #e2e8f0",
                paddingTop: 32,
                marginTop: 32,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  ✨ AI Reply
                </h3>
                
                <button
                  onClick={generateAiReply}
                  disabled={generatingReply}
                  style={{
                    padding: "10px 20px",
                    background: generatingReply
                      ? "#94a3b8"
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: generatingReply ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
                  }}
                  onMouseOver={(e) => {
                    if (!generatingReply) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(102, 126, 234, 0.4)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!generatingReply) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(102, 126, 234, 0.3)";
                    }
                  }}
                >
                  {generatingReply ? "🤖 Generating..." : "🤖 Generate Reply"}
                </button>
              </div>

              {aiReply && (
                <>
                  <textarea
                    value={aiReply}
                    onChange={(e) => setAiReply(e.target.value)}
                    style={{
                      width: "100%",
                      minHeight: 200,
                      padding: 16,
                      fontSize: 15,
                      lineHeight: 1.6,
                      border: "2px solid #e2e8f0",
                      borderRadius: 12,
                      fontFamily: "inherit",
                      resize: "vertical",
                      marginBottom: 16,
                      color: "#334155",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#667eea";
                      e.currentTarget.style.outline = "none";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                    }}
                  />
                  
                  <button
                    onClick={sendReply}
                    disabled={sendingReply || !aiReply.trim()}
                    style={{
                      padding: "12px 28px",
                      background: sendingReply || !aiReply.trim()
                        ? "#cbd5e1"
                        : "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 15,
                      fontWeight: 600,
                      cursor:
                        sendingReply || !aiReply.trim()
                          ? "not-allowed"
                          : "pointer",
                      transition: "all 0.2s",
                      boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                    }}
                    onMouseOver={(e) => {
                      if (!sendingReply && aiReply.trim()) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(16, 185, 129, 0.4)";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!sendingReply && aiReply.trim()) {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(16, 185, 129, 0.3)";
                      }
                    }}
                  >
                    {sendingReply ? "📤 Sending..." : "📤 Send Reply"}
                  </button>
                </>
              )}

              {generatingReply && (
                <div
                  style={{
                    padding: 40,
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      border: "4px solid #e2e8f0",
                      borderTop: "4px solid #667eea",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      margin: "0 auto 16px",
                    }}
                  />
                  <div style={{ fontSize: 14 }}>Generating AI reply...</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              flexDirection: "column",
              color: "#94a3b8",
            }}
          >
            <div style={{ fontSize: 64, marginBottom: 24 }}>📧</div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>No email selected</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>
              Choose an email from the list to read
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;