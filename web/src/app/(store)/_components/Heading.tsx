import React from 'react';

export const Heading2 = ({children}: {
  children?: React.ReactNode;
}) => {
  return (
    <h2 className={'text-2xl font-semibold'}>
      {children}
    </h2>
  )
}

export const Heading3 = ({children}: {
  children?: React.ReactNode;
}) => {
  return (
    <h3 className={'text-xl h-11 flex items-center'}>
      {children}
    </h3>
  )
}