import React from "react";
import { QRCodeSVG } from 'qrcode.react';

const QRdesign = ({ value }) => {
  return (
    <QRCodeSVG
      value={value}
      size={128}
      bgColor="#ffffff"
      fgColor="#000000"
      level="Q"
      renderas="svg"
      includeMargin={false}
      // Personaliza otros aspectos aquí si lo deseas
    />
  );
};

export default QRdesign;
