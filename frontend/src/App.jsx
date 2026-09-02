import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [recoveries, setRecoveries] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [selectedRecovery, setSelectedRecovery] = useState(null);  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchRecoveries();
  }, []);

  const fetchRecoveries = async () => {
    try {
      setError("");

      const response = await fetch(
        "http://localhost:8080/api/recoveries"
      );

      if (!response.ok) {
        throw new Error(
          `Backend returned ${response.status}`
        );
      }

      const data = await response.json();

      console.log("Recoveries received:", data);

      setRecoveries(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch recoveries:", error);
      setError(
        "Unable to connect to the backend. Make sure Spring Boot is running on port 8080."
      );
    }
  };

  const analyzeRecovery = async (id) => {
    setLoading(true);
    setAnalysis(null);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/recoveries/${id}/analyze`
      );

      if (!response.ok) {
        throw new Error(
          `Analysis failed with status ${response.status}`
        );
      }

      const data = await response.json();

      setAnalysis(data);

      const selected = recoveries.find(

        (recovery) => recovery.id === id

      );

      setSelectedRecovery(selected);
    } catch (error) {
      console.error("Failed to analyze recovery:", error);
      setError("Failed to analyze this payment.");
    } finally {
      setLoading(false);
    }
  };

  const markRecovered = async (id) => {
    try {
      setError("");

      const response = await fetch(
        `http://localhost:8080/api/recoveries/${id}/status?status=RECOVERED`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update recovery status: ${response.status}`
        );
      }

      await fetchRecoveries();

      alert("Payment marked as recovered!");
    } catch (error) {
      console.error("Failed to mark recovery:", error);
      setError("Failed to update recovery status.");
    }
  };
    const filteredRecoveries =
      filter === "ALL"
        ? recoveries
        : recoveries.filter((recovery) => recovery.status === filter);
    const totalRecoveries = recoveries.length;

    const pendingRecoveries = recoveries.filter(

      (recovery) => recovery.status === "PENDING"

    ).length;

    const recoveredPayments = recoveries.filter(

      (recovery) => recovery.status === "RECOVERED"

    ).length;

    const recoveredRevenue = recoveries

      .filter((recovery) => recovery.status === "RECOVERED")

      .reduce((sum, recovery) => sum + recovery.amount, 0) / 100;
      const recoveryRate =
        totalRecoveries > 0
          ? (recoveredPayments / totalRecoveries) * 100
          : 0;


  return (
    <div className="app">
      <header>
        <h1>Razorpay Revenue Recovery</h1>
        <p>AI-powered payment recovery dashboard</p>
        {lastUpdated && (

          <p className="last-updated">

            Last updated: {lastUpdated.toLocaleTimeString()}

          </p>

        )}
      </header>

      <main>
          <section className="stats-grid">
            <div className="stat-card">
              <h3>Total Failed Payments</h3>
              <p>{totalRecoveries}</p>
            </div>

            <div className="stat-card">
              <h3>Pending Recoveries</h3>
              <p>{pendingRecoveries}</p>
            </div>

            <div className="stat-card">
              <h3>Recovered Payments</h3>
              <p>{recoveredPayments}</p>
            </div>

            <div className="stat-card">
              <h3>Revenue Recovered</h3>
              <p>₹{recoveredRevenue.toFixed(2)}</p>
            </div>
            <div className="stat-card">

              <h3>Recovery Rate</h3>

              <p>{recoveryRate.toFixed(0)}%</p>

              <div className="progress-bar">

                <div

                  className="progress-fill"

                  style={{ width: `${recoveryRate}%` }}

                ></div>

              </div>

            </div>
          </section>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <section className="card">
          <h2>Payment Recovery Cases</h2>
          <div className="filter-buttons">
            <button
              className={filter === "ALL" ? "active-filter" : ""}
              onClick={() => setFilter("ALL")}
            >
              All
            </button>

            <button
              className={filter === "PENDING" ? "active-filter" : ""}
              onClick={() => setFilter("PENDING")}
            >
              Pending
            </button>

            <button
              className={filter === "RECOVERED" ? "active-filter" : ""}
              onClick={() => setFilter("RECOVERED")}
            >
              Recovered
            </button>
          </div>

          {recoveries.length === 0 && !error ? (
            <p className="empty-message">
              No recovery records found.
            </p>
          ) : recoveries.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Payment ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Failure Reason</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                    {filteredRecoveries.length === 0 ? (

                      <tr>

                        <td colSpan="7" className="empty-table-message">

                          No recovery cases found for this filter.

                        </td>

                      </tr>

                    ) : (

                  filteredRecoveries.map((recovery) => (
                    <tr key={recovery.id}>
                      <td>{recovery.id}</td>

                      <td>{recovery.paymentId}</td>

                      <td>{recovery.customerEmail}</td>

                      <td>
                        ₹{(recovery.amount / 100).toFixed(2)}
                      </td>

                      <td>
                        <span
                          className={`status ${recovery.status.toLowerCase()}`}
                        >
                          {recovery.status}
                        </span>
                      </td>

                      <td>
                        {recovery.failureReason}
                      </td>

                      <td>
                        <div className="action-buttons">

                          <button
                            onClick={() =>
                              analyzeRecovery(recovery.id)
                            }
                          >
                            AI Analyze
                          </button>

                          {recovery.status !== "RECOVERED" && (
                            <button
                              className="recover-button"
                              onClick={() =>
                                markRecovered(recovery.id)
                              }
                            >
                              Mark Recovered
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>

        {loading && (
          <section className="card">
            <h2>AI Recovery Analysis</h2>

            <p className="loading-message">
              Analyzing payment recovery case...
            </p>
          </section>
        )}

        {analysis && !loading && (
          <section className="card analysis">
            <h2>AI Recovery Analysis</h2>

            {selectedRecovery && (
              <div className="analysis-summary">
                <p>
                  <strong>Payment:</strong> {selectedRecovery.paymentId}
                </p>
                <p>
                  <strong>Customer:</strong> {selectedRecovery.customerEmail}
                </p>
                <p>
                  <strong>Amount:</strong> ₹
                  {(selectedRecovery.amount / 100).toFixed(2)}
                </p>
              </div>
            )}

            <div className="analysis-item">
              <h3>Likely Reason</h3>
              <p>{analysis.likelyReason}</p>
            </div>

            <div className="analysis-item">
              <h3>Recommended Action</h3>
              <p>{analysis.recommendedAction}</p>
            </div>

            <div className="analysis-item">

              <h3>Priority</h3>

              <p>

                <span

                  className={`priority-badge priority-${(

                    analysis.priority || "medium"

                  ).toLowerCase()}`}

                >

                  {analysis.priority || "Not specified"}

                </span>

              </p>

            </div>

            <div className="analysis-item">
              <h3>Customer Message</h3>
              <p>{analysis.customerMessage}</p>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}

export default App;