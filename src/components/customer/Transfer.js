import CustomerHeader from "./CustomerHeader";
import "./Transfer.css";
import transfer2 from "../images/transfer2.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SuccessAlert from "../SuccessAlert";
import axios from "axios";
import { useEffect } from "react";

const Transfer = () => {
  const navigate = useNavigate("");

  const [enteredFromAccount, setFromAccount] = useState("SAVINGS");
  const [enteredTargetAccount, setTargetAccount] = useState("");
  const [enteredAmount, setAmount] = useState("");
  const [successAlert, setSuccessAlert] = useState(false);
  // const [fromAccountError, setFromAccountError] = useState("");
  // const [amountError, setAmountError] = useState("");
  const [insufficientAlert, setInsufficientAlert] = useState(false);
  const [currentBalance, setCurrentBalance] = useState("");
  const [failureAlert, setFailureAlert] = useState(false);

  const fromAccountHandler = (event) => {
    setFromAccount(event.target.value);
  };
  const targetAccountHandler = (event) => {
    setTargetAccount(event.target.value);
  };
  const amountHandler = (event) => {
    setAmount(event.target.value);
  };
  useEffect(() => {
    fetch(
      `http://localhost:8090/api/accounts/current-balance/1000001/${enteredFromAccount}`
    )
      .then((response) => response.json())
      .then((data) => setCurrentBalance(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const transferSubmitHandler = async (e) => {
    e.preventDefault();

    const isConfirmed = window.confirm("Are you sure you want to transfer?");

    if (isConfirmed) {
      const transferData = {
        fromAccount: enteredFromAccount,
        targetAccount: enteredTargetAccount,
        amount: enteredAmount,
      };

      if (transferData.amount > currentBalance) {
        setInsufficientAlert(true);
      } else {
        try {
          const response = await axios.post(
            `http://localhost:8070/api/transactions/transfer/${1000001}/${
              transferData.fromAccount
            }/${transferData.targetAccount}/${transferData.amount}`
          );

          console.log("Transfer successful");
          console.log(response.data);
          setSuccessAlert(true);
        } catch (error) {
          setFailureAlert(true);
          console.error("Transfer failed", error);
        }
      }

      // const targetAccountExists = transactionData.some(
      //   (transaction) => transaction.targetAccountId === selectedTargetAccount
      // );

      // const fromCustomer = customerData.find(
      //   (c) => c.accountType === selectedFromAccountType
      // );

      // setFromAccountError("");
      // setAmountError("");

      // if (!fromCustomer) {
      //   setFromAccountError("From account type not found");
      // }

      // if (!targetAccountExists) {
      //   setFromAccountError("Target account does not exist.");
      // }

      // if (transferAmount > fromCustomer.currentBalance) {
      //   setAmountError("Transfer amount exceeds current balance");
      // }

      // if (
      //   targetAccountExists &&
      //   transferAmount <= fromCustomer.currentBalance
      // ) {

      // }
    }
  };

  const closeAlert = () => {
    setSuccessAlert(false);
    setInsufficientAlert(false);
    setFailureAlert(false);
    navigate("/customer-dashboard");
  };

  const transferCancelHandler = () => {
    setFromAccount("SAVINGS");
    setTargetAccount("");
    setAmount("");
    // setFromAccountError("");
    // setAmountError("");
  };

  return (
    <div>
      <CustomerHeader></CustomerHeader>
      <div class="container mt-5">
        <div class="row">
          <div class="col-md-6">
            <img src={transfer2} alt="transfer" class="img-fluid" />
          </div>

          <div class="form-box container-form2 col-md-4 mt-5">
            <div class="container mt-3">
              <h2 className="heading2">Transfer</h2>
              <form onSubmit={transferSubmitHandler}>
                <div class=" form-group mb-4">
                  <label for="selectA">From Account</label>

                  <div class="input-group">
                    <select
                      class="form-select"
                      id="accountType"
                      name="accountType"
                      value={enteredFromAccount}
                      onChange={fromAccountHandler}
                    >
                      <option value="SAVINGS">SAVINGS</option>
                      <option value="CURRENT">CURRENT</option>
                    </select>
                  </div>
                </div>

                {/* {fromAccountError && (
                  <p className="text-danger">{fromAccountError}</p>
                )} */}
                <div class="form-group mb-4">
                  <label for="inputB">Target Account</label>
                  <input
                    type="number"
                    class="form-control"
                    id="inputB"
                    required
                    value={enteredTargetAccount}
                    placeholder="Enter target account"
                    onChange={targetAccountHandler}
                  />
                </div>
                {/* {amountError && <p className="text-danger">{amountError}</p>} */}
                <div class="form-group mb-4">
                  <label for="inputB">Amount</label>
                  <input
                    type="number"
                    class="form-control"
                    id="inputB"
                    required
                    value={enteredAmount}
                    placeholder="Enter amount"
                    onChange={amountHandler}
                  />
                </div>
                <div class="form-group ">
                  <button type="submit" class="btn btn-primary button-space">
                    Transfer
                  </button>
                  {successAlert && (
                    <SuccessAlert
                      message={"Transfer successful!"}
                      onClose={closeAlert}
                    />
                  )}
                  {insufficientAlert && (
                    <SuccessAlert
                      message={"Insufficient Fund!"}
                      onClose={closeAlert}
                    />
                  )}
                  {failureAlert && (
                    <SuccessAlert
                      message={
                        "Transfer not allowed due to Minimum Balance Rule!"
                      }
                      onClose={closeAlert}
                    />
                  )}
                  <button
                    type="button"
                    class="btn btn-secondary"
                    onClick={transferCancelHandler}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
