'use client';
import { useContext, useEffect } from 'react';
import TitleContext from './TitleContext';

const Title = ({text}: {text: string}) => {
  const setTitle = useContext(TitleContext);
  useEffect(() => {
    setTitle(text);
  }, [setTitle, text]);
  return null;
};

export default Title;
