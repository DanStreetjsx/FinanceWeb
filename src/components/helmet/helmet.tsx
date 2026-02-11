import { useEffect } from 'react';

// ----------------------------------------------------------------------

type Props = {
  title: string;
};

export function Helmet({ title }: Props) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}
