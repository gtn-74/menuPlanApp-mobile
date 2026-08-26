import React, { type ReactNode } from 'react';
import { SafeAreaView, View } from 'react-native';
import { styles } from './CalendarLayout.styles';


interface CalendarLayoutProps {
  /** 上部のヘッダー（カテゴリ切替・月移動など） */
  header: ReactNode;
  /** カレンダー本体 */
  calendar: ReactNode;
  /** ユーザーのクイックフィルタ列 */
  userFilter: ReactNode;
  /** page 側で結線した BottomSheet 等を差し込む口（任意） */
  sheet?: ReactNode;
}

/**
 * template: カレンダー画面の「配置の器」。
 * 状態・データ取得・画面遷移は一切持たず、渡された slot を並べるだけ。
 * だから RNTL で「構造（どの領域に何が入るか）」を軽くテストできる。
 * 逆に、ここに状態が生えてきたら page へ寄せるサイン。
 */
export const CalendarLayout: React.FC<CalendarLayoutProps> = ({
  header,
  calendar,
  userFilter,
  sheet,
}) => (
  <SafeAreaView style={styles.container} testID="calendar-layout">
    <View testID="region-header">{header}</View>
    <View style={styles.calendarRegion} testID="region-calendar">
      {calendar}
    </View>
    <View style={styles.filterRegion} testID="region-filter">
      {userFilter}
    </View>
    {sheet}
  </SafeAreaView>
);
