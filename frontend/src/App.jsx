import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const formatCurrency = (amount) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      }).format(amount);
  const [recoveries, setRecoveries] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [selectedRecovery, setSelectedRecovery] = useState(null);
  const [loading, setLoading] = useState(false);
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
      const pendingRevenue =
        recoveries
          .filter((recovery) => recovery.status === "PENDING")
          .reduce((sum, recovery) => sum + recovery.amount, 0) / 100;

      const averageRecoveredAmount =
        recoveredPayments > 0
          ? recoveredRevenue / recoveredPayments
          : 0;


  return (
    <div className="app">
      <header className="dashboard-header">

        <div className="header-content">

          <div>

            <div className="header-title-row">

              <h1>Revenue Recovery</h1>

              <span className="system-status">

                <span className="status-dot"></span>

                System Online

              </span>

            </div>

            <p className="header-subtitle">

              AI-powered payment recovery dashboard

            </p>

            <p className="header-description">

              Monitor failed payments, recover revenue, and use AI

              to determine the next best recovery action.

            </p>

          </div>

          {lastUpdated && (

            <div className="last-updated">

              <span>Last updated</span>

              <strong>{lastUpdated.toLocaleTimeString()}</strong>

            </div>

          )}

        </div>

      </header>

      <main>
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-label">Total Failed</span>
                <span className="stat-icon">↘</span>
              </div>

              <p className="stat-value">{totalRecoveries}</p>
              <span className="stat-description">payment cases</span>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-label">Pending</span>
                <span className="stat-icon">◷</span>
              </div>

              <p className="stat-value">{pendingRecoveries}</p>
              <span className="stat-description">needs attention</span>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-label">Recovered</span>
                <span className="stat-icon">✓</span>
              </div>

              <p className="stat-value">{recoveredPayments}</p>
              <span className="stat-description">successful recoveries</span>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-label">Revenue Recovered</span>
                <span className="stat-icon">₹</span>
              </div>

              <p className="stat-value">
                {formatCurrency(recoveredRevenue)}
              </p>

              <span className="stat-description">recovered revenue</span>
            </div>

            <div className="stat-card recovery-rate-card">
              <div className="stat-card-header">
                <span className="stat-label">Recovery Rate</span>
                <span className="stat-icon">%</span>
              </div>

              <p className="stat-value">{recoveryRate.toFixed(0)}%</p>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${recoveryRate}%` }}
                ></div>
              </div>

              <span className="stat-description">
                of failed payments recovered
              </span>
            </div>
          </section>
          <section className="insights-card">
            <div className="insights-header">
              <div>
                <h2>Recovery Insights</h2>
                <p>Overview of your current payment recovery performance</p>
              </div>
            </div>

            <div className="insights-grid">
             <div className="insight-item">

               <span className="insight-label">Pending Cases</span>

               <strong>{pendingRecoveries}</strong>

               <span className="insight-description">

                 payment cases needing attention

               </span>

             </div>

             <div className="insight-item">

               <span className="insight-label">Pending Revenue</span>

               <strong>{formatCurrency(pendingRevenue)}</strong>

               <span className="insight-description">

                 total value still pending

               </span>

             </div>

             <div className="insight-item">

               <span className="insight-label">Recovered Cases</span>

               <strong>{recoveredPayments}</strong>

               <span className="insight-description">

                 successfully recovered payments

               </span>

             </div>

             <div className="insight-item">

               <span className="insight-label">Avg. Recovered Payment</span>

               <strong>{formatCurrency(averageRecoveredAmount)}</strong>

               <span className="insight-description">

                 average recovered amount

               </span>

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

                  filteredRecoveries.map((recovery, index) => (
                    <tr key={recovery.id}>
                      <td>{index + 1}</td>

                      <td>{recovery.paymentId}</td>

                      <td>{recovery.customerEmail}</td>

                      <td>
                        {formatCurrency(recovery.amount / 100)}
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
          <section className="card ai-loading-card">
            <div className="ai-loading-icon">✦</div>

            <h2>AI Recovery Analysis</h2>

            <p className="loading-title">
              Analyzing payment recovery case
            </p>

            <p className="loading-description">
              AI is evaluating the failure reason and generating
              a safe recovery recommendation.
            </p>

            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </section>
        )}

        {analysis && !loading && (
          <section className="card analysis">
            <div className="analysis-header">
              <div>
                <div className="analysis-title-row">
                  <span className="ai-icon">✦</span>
                  <h2>AI Recovery Analysis</h2>
                </div>

                <p className="analysis-subtitle">
                  AI-generated recovery recommendation for this payment
                </p>
              </div>

              <span
                className={`priority-badge priority-${(
                  analysis.priority || "medium"
                ).toLowerCase()}`}
              >
                {analysis.priority || "Not specified"} Priority
              </span>
            </div>

            {selectedRecovery && (
              <div className="analysis-summary">
                <div className="summary-item">
                  <span>Payment</span>
                  <strong>{selectedRecovery.paymentId}</strong>
                </div>

                <div className="summary-item">
                  <span>Customer</span>
                  <strong>{selectedRecovery.customerEmail}</strong>
                </div>

                <div className="summary-item">
                  <span>Amount</span>
                  <strong>
                   {formatCurrency(selectedRecovery.amount / 100)}
                  </strong>
                </div>

                <div className="summary-item">
                  <span>Status</span>
                  <strong>
                    {selectedRecovery.status}
                  </strong>
                </div>
              </div>
            )}

            <div className="analysis-grid">
              <div className="analysis-box">
                <span className="analysis-label">Likely Reason</span>
                <p>{analysis.likelyReason}</p>
              </div>

              <div className="analysis-box">
                <span className="analysis-label">Recommended Action</span>
                <p>{analysis.recommendedAction}</p>
              </div>
            </div>

            <div className="customer-message">
              <div className="customer-message-header">
                <span className="analysis-label">Customer Message</span>
                <span className="message-badge">Ready to send</span>
              </div>

              <p>
                "{analysis.customerMessage}"
              </p>
            </div>

            <div className="ai-safety-note">
              <span>🔒</span>
              <span>
                AI recommendations are designed to avoid requesting
                sensitive payment credentials.
              </span>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}

export default App;