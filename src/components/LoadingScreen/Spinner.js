import React from 'react';
import { css } from '@emotion/react';
import {SyncLoader} from 'react-spinners';

const Spinner = ({ loading }) => {
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  return (
      <SyncLoader color="#4CAF50" loading={loading} css={override} size={30} />
  );
};

export default Spinner;
