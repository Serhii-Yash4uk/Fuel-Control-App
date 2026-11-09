import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

export const usePrint = ({ onAfterPrint }) => {
  const printContentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printContentRef,
    onAfterPrint,
    documentTitle: 'Report',
  });

  return { printContentRef, handlePrint };
};
