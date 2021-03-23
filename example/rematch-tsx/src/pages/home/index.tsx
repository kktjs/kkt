import React from 'react';
import { Button } from 'uiw';
import { DefaultProps } from '../../';

export default function Home(props: DefaultProps) {
  const { history } = props || {};
  return (
    <div>
      首页
      <Button onClick={() => history.push('/login')}>Logout</Button>
    </div>
  );
}
