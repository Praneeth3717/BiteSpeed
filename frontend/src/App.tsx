import { useState } from "react";
import "./App.css";
import { identifyContact } from "./api";
import logo from "./assets/logo.svg";

interface ContactResponse {
  primaryContactId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}

function App() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [result, setResult] = useState<ContactResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setResult(null);

    if (!email && !phoneNumber) {
      setError("Either email or phone number must be provided");
      return;
    }

    try {
      setLoading(true);

      const response = await identifyContact({
        email,
        phoneNumber,
      });

      setResult(response.contact);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <img src={logo} alt="Logo" className="logo" />
      </nav>

      <div className="container">
        <div className="form-row">
          <div className="input-group">
            <label>Email :</label>
            <input
              type="text"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Phone Number :</label>
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Identifying..." : "Identify"}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        {result && (
          <div className="result-card">
            <h3>Contact Result</h3>

            <div className="result-item">
              <span className="label">Primary ID</span>
              <span className="value">{result.primaryContactId}</span>
            </div>

            <div className="result-item">
              <span className="label">Emails</span>
              <span className="value">{result.emails.join(", ")}</span>
            </div>

            <div className="result-item">
              <span className="label">Phone Numbers</span>
              <span className="value">{result.phoneNumbers.join(", ")}</span>
            </div>

            <div className="result-item">
              <span className="label">Secondary IDs</span>
              <span className="value">
                {result.secondaryContactIds.join(", ")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;