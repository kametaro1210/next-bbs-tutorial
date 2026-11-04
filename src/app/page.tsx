import { Suspense } from 'react';
import Loader from './Loader';
import PostList from './PostList';

export default function Home() {
  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>記事一覧</h2>

      {/* 
        【Suspenseによるローディング制御】
        子要素の <PostList /> 内で非同期データの取得（データベース通信など）が行われている間、
        データが読み込まれるまでの「待ち時間（ロード中）」に、
        fallback に指定した <Loader /> コンポーネント（ローディング画面）を代わりに表示する。
      */}
      
      <Suspense fallback={<Loader />}>
        <PostList />
      </Suspense>
    </div>
  );
}
