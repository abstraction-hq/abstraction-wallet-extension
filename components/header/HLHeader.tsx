//simple header with name at the left and a button at the right
import React from 'react';

export const HLHeader = () => {

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        borderBottom: '1px solid #e8e8e8',
      }}
    >
      <h2>Gm mien</h2>
      <h2>Haha</h2>
    </div>
  );
};
