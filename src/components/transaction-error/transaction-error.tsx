import React from "react";
import { useTranslation } from "react-i18next";
import { ClaimAction } from "../../routes/claim/claim-form/claim-reducer";

export interface TransactionErrorProps {
  error: Error | null,
  hash: string | null,
  dispatch?: (action: ClaimAction) => void
}

export const TransactionError = ({ error, hash, dispatch }: TransactionErrorProps) => {
  const { t } = useTranslation()

  const onTryAgain = () => {
    if (dispatch) {
      dispatch({
        type: "CLAIM_TX_RESET"
      });
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'gray',
      padding: '10px',
      textAlign: 'center'
      }}
    >
      <h1>{error ? error.message : t("Something went wrong")}</h1>
      {
        hash ?
          <a
              href={`https://etherscan.io/tx/${hash}`}
              target="_blank"
              rel="noreferrer"
          >
            {t("View on Etherscan (Opens in a new tab)")}
          </a>
          :
          null
        }
    <button onClick={() => onTryAgain()}>{t("Try again")}</button>
  </div>
  )
};
