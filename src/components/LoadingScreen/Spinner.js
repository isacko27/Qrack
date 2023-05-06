import React from 'react';
import { css } from '@emotion/react';
import { PulseLoader } from 'react-spinners';

const Spinner = ({ loading }) => {
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  return (
    <div className="spinner">
      <PulseLoader color="#4CAF50" loading={loading} css={override} size={15} />
    </div>
  );
};

export default Spinner;
