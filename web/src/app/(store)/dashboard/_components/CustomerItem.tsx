import { Customer, Profile, Timestamp } from '@/api';
import { convertTimestampToDate } from '@/lib/convertors';

interface CustomerItemProps {
  customer: Customer;
  profiles: Profile[];
}

export default function CustomerItem({ customer, profiles }: CustomerItemProps) {
  // タイムスタンプを読みやすい形式の日付文字列に変換するヘルパー関数
  const formatDate = (timestamp?: Timestamp): string | null => {
    if (!timestamp) return null;
    return convertTimestampToDate(timestamp).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * 複数のプロフィールから特定のキーの値を取り出し、重複を除いてカンマ区切りの文字列を生成します。
   * @param key - プロフィールオブジェクトのキー
   */
  const getCombinedValues = (key: keyof Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): string => {
    if (!profiles || profiles.length === 0) {
      return '';
    }

    // 1. 全プロフィールから指定されたキーの値の配列を作成
    const values = profiles.map(p => p[key]);

    // 2. nullやundefined、空文字列を除外し、重複をなくす
    const uniqueValues = [...new Set(values)].filter(Boolean);

    // 3. カンマとスペースで連結して返す
    return uniqueValues.join(', ');
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-card/40 border border-card rounded-md">
      {/* 顧客基本情報 */}
      <div className="border-b border-border pb-2">
        <p className="text-sm text-muted-foreground">顧客ID</p>
        <p className="text-lg font-bold">{customer.id}</p>
        <div className="mt-2 text-xs text-muted-foreground space-y-1">
          <p>初回登録日: {formatDate(customer.createdAt)}</p>
          {customer.tosAcceptedAt && (
            <p>利用規約同意日: {formatDate(customer.tosAcceptedAt)}</p>
          )}
        </div>
      </div>

      {/* プロフィール情報（集約表示） */}
      {profiles && profiles.length > 0 ? (
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <Label>性別:</Label>         <Value>{getCombinedValues('gender')}</Value>
          <Label>生年月日:</Label>     <Value>{getCombinedValues('birthday')}</Value>
          <Label>出身地:</Label>       <Value>{getCombinedValues('birthplace')}</Value>
          <Label>職業:</Label>         <Value>{getCombinedValues('business')}</Value>
          <Label>パートナー:</Label>   <Value>{getCombinedValues('partner')}</Value>
          <Label>趣味:</Label>         <Value>{getCombinedValues('hobby')}</Value>
          <Label>関心事:</Label>       <Value>{getCombinedValues('news')}</Value>
          <Label>悩み:</Label>         <Value>{getCombinedValues('worry')}</Value>
          <Label>来店店舗:</Label>     <Value>{getCombinedValues('store')}</Value>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">プロフィール情報がありません。</p>
      )}
    </div>
  );
}

// 可読性のための小さなヘルパーコンポーネント
const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="font-semibold text-muted-foreground whitespace-nowrap">{children}</p>
);

const Value = ({ children }: { children: React.ReactNode }) => (
  <p className="text-foreground">
    {/* childrenが空文字列の場合も「未設定」と表示 */}
    {children || <span className="text-muted-foreground/60">未設定</span>}
  </p>
);
